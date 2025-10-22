import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle/db";
import { products } from "@/lib/drizzle/schema";
import WooCommerceRestApi, { WooCommerceRestApiVersion } from "@woocommerce/woocommerce-rest-api";
import { QdrantVector } from "@mastra/qdrant";
import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";
import { v5 as uuidv5 } from "uuid";

const QDRANT_COLLECTION = "products";
const QDRANT_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"; // Fixed namespace for consistent UUIDs

// WooCommerce Product type
interface WooCommerceProduct {
  id: number;
  name: string;
  description?: string;
  price?: string;
  stock_quantity?: number;
  images?: Array<{ src?: string; }>;
  permalink?: string;
  categories?: Array<{ id: number; name: string; slug: string; }>;
  tags?: Array<{ id: number; name: string; slug: string; }>;
}

// Initialize WooCommerce API client
function getWooCommerceClient() {
  return new WooCommerceRestApi({
    url: process.env.WOOCOMMERCE_URL!,
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
    version: process.env.WOOCOMMERCE_API_VERSION as WooCommerceRestApiVersion || "wc/v3",
    queryStringAuth: true, // Force Basic Authentication as query string
    axiosConfig: {
      timeout: parseInt(process.env.WOOCOMMERCE_TIMEOUT || "30000"),
      httpsAgent: process.env.WOOCOMMERCE_VERIFY_SSL === "false" ? undefined : undefined,
    },
  });
}

// Initialize Qdrant client
async function initQdrant() {
  const qdrant = new QdrantVector({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY || undefined,
  });

  // Create the collection in Qdrant if it doesn't exist
  try {
    await qdrant.createIndex({
      indexName: QDRANT_COLLECTION,
      dimension: 1536,
      metric: "cosine",
    });
    console.log(`✅ Qdrant collection ${QDRANT_COLLECTION} created or verified`);
  } catch (error) {
    console.error(`❌ Qdrant collection ${QDRANT_COLLECTION} might already exist`, error);
  }

  return qdrant;
}

// POST /api/products-sync/from-woocommerce
// Import products from WooCommerce to Supabase
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "from-woocommerce") {
      return await importFromWooCommerce();
    } else if (action === "to-qdrant") {
      return await syncToQdrant();
    } else {
      return NextResponse.json(
        {
          error: "Invalid Action",
          message: "Use ?action=from-woocommerce or ?action=to-qdrant",
          availableActions: ["from-woocommerce", "to-qdrant"],
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("❌ Products sync error:", error);
    return NextResponse.json(
      {
        error: "Sync Failed",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Import products from WooCommerce to Supabase
async function importFromWooCommerce() {
  console.log("🚀 Starting import from WooCommerce to Supabase");

  const wooCommerce = getWooCommerceClient();
  let allProducts: WooCommerceProduct[] = [];
  let page = 1;
  const perPage = 100;
  let hasMoreProducts = true;

  // Fetch all products from WooCommerce (paginated)
  while (hasMoreProducts) {
    try {
      console.log(`📥 Fetching WooCommerce products page ${page}...`);
      const response = await wooCommerce.get("products", {
        per_page: perPage,
        page: page,
        status: "publish", // Only published products
      });

      const pageProducts = response.data;
      allProducts = allProducts.concat(pageProducts);

      console.log(`✅ Fetched ${pageProducts.length} products from page ${page}`);

      if (pageProducts.length < perPage) {
        hasMoreProducts = false;
      } else {
        page++;
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error &&
        error.response && typeof error.response === 'object' &&
        'status' in error.response && error.response.status === 400) {
        // No more pages
        hasMoreProducts = false;
      } else {
        throw error;
      }
    }
  }

  console.log(`📦 Total products fetched from WooCommerce: ${allProducts.length}`);

  if (allProducts.length === 0) {
    return NextResponse.json({
      message: "No products found in WooCommerce",
      imported: 0,
      timestamp: new Date().toISOString(),
    });
  }

  // Transform and insert/update products in Supabase
  const importedProducts = [];

  for (const wooProduct of allProducts) {
    try {
      const productData = {
        id: wooProduct.id.toString(),
        name: wooProduct.name,
        description: wooProduct.description || "",
        descriptionExtra: "", // Empty initially as requested
        price: wooProduct.price || "0",
        stock: wooProduct.stock_quantity || 0,
        imageUrl: wooProduct.images?.[0]?.src || "",
        productUrl: wooProduct.permalink || "",
        categories: wooProduct.categories || [],
        updated_at: new Date(),
      };

      // Upsert product (insert or update if exists)
      await db
        .insert(products)
        .values(productData)
        .onConflictDoUpdate({
          target: products.id,
          set: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            stock: productData.stock,
            imageUrl: productData.imageUrl,
            productUrl: productData.productUrl,
            categories: productData.categories,
            updated_at: productData.updated_at,
          },
        });

      importedProducts.push(productData);
      console.log(`✅ Imported product: ${productData.name} (ID: ${productData.id})`);
    } catch (error) {
      console.error(`❌ Failed to import product ${wooProduct.id}:`, error);
    }
  }

  console.log(`🎉 Successfully imported ${importedProducts.length} products to Supabase`);

  return NextResponse.json({
    message: "Products imported from WooCommerce successfully",
    imported: importedProducts.length,
    total: allProducts.length,
    products: importedProducts.map((p) => ({ id: p.id, name: p.name })),
    timestamp: new Date().toISOString(),
  });
}

// Sync products from Supabase to Qdrant with embeddings
async function syncToQdrant() {
  console.log("🚀 Starting sync from Supabase to Qdrant");

  // Initialize Qdrant
  const qdrant = await initQdrant();

  // Fetch all products from Supabase
  const allProducts = await db.select().from(products);

  if (allProducts.length === 0) {
    return NextResponse.json({
      message: "No products found in Supabase to sync",
      synced: 0,
      timestamp: new Date().toISOString(),
    });
  }

  console.log(`📦 Found ${allProducts.length} products in Supabase`);

  // Prepare texts for embedding (include category names for better semantic search)
  const textsToEmbed = allProducts.map((product) => {
    const categories = Array.isArray(product.categories)
      ? product.categories.map((cat: any) => cat.name).join(" ")
      : "";
    return `${product.name} ${product.description || ""} ${product.descriptionExtra || ""} ${categories}`.trim();
  });

  // Generate embeddings using OpenAI
  console.log("🧠 Generating embeddings for products...");
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: textsToEmbed,
  });

  console.log(`✅ Generated ${embeddings.length} embeddings`);

  // Prepare metadata for Qdrant
  const metadata = allProducts.map((product) => {
    const categories = Array.isArray(product.categories) ? product.categories : [];
    const categoryNames = categories.map((cat: any) => cat.name).join(" ");

    // Normalize category names for flexible matching (lowercase, remove special chars)
    const normalizedCategories = categories
      .map((cat: any) => cat.name.toLowerCase().replace(/[^a-z0-9]/g, ''))
      .join(" ");

    return {
      id: product.id,
      name: product.name,
      description: product.description || "",
      descriptionExtra: product.descriptionExtra || "",
      price: parseFloat(product.price || "0"),
      stock: product.stock || 0,
      imageUrl: product.imageUrl || "",
      productUrl: product.productUrl || "",
      categories: categories, // Store full category objects
      categoryNames: categoryNames, // Flattened category names (original)
      categoryNamesNormalized: normalizedCategories, // Normalized for filtering (lowercase, no special chars)
      text: `${product.name} ${product.description || ""} ${product.descriptionExtra || ""} ${categoryNames}`.trim(),
    };
  });

  // Upload to Qdrant
  console.log("📤 Uploading products to Qdrant...");
  await qdrant.upsert({
    indexName: QDRANT_COLLECTION,
    vectors: embeddings,
    metadata,
    ids: allProducts.map((p) => uuidv5(p.id, QDRANT_NAMESPACE)),
  });

  console.log(`🎉 Successfully synced ${allProducts.length} products to Qdrant`);

  // Get collection stats
  const collectionInfo = await qdrant.describeIndex({
    indexName: QDRANT_COLLECTION,
  });

  return NextResponse.json({
    message: "Products synced to Qdrant successfully",
    synced: allProducts.length,
    collection: QDRANT_COLLECTION,
    qdrantStats: {
      count: collectionInfo.count,
      dimension: collectionInfo.dimension,
      metric: collectionInfo.metric,
    },
    timestamp: new Date().toISOString(),
  });
}

