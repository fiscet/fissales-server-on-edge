import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/ai/src/mastra';
import { db } from '@/lib/drizzle/db';
import { vendorStores, isValidApiKeyFormat } from '@/lib/drizzle/schema/vendor-stores';
import { eq, and } from 'drizzle-orm';

/**
 * Chatbot API Endpoint
 * 
 * Supports both:
 * - Standard JSON responses (default)
 * - Server-Sent Events (SSE) streaming
 * 
 * Query parameter: ?stream=true for SSE
 * 
 * Authentication: API key is passed in the URL path as vendorApiKey
 */

/**
 * Validates the vendor API key and returns the vendor store if valid
 */
async function validateApiKey(apiKey: string) {
  // Check format first
  if (!isValidApiKeyFormat(apiKey)) {
    return null;
  }

  // Look up the vendor store by API key
  const vendorStore = await db
    .select()
    .from(vendorStores)
    .where(
      and(
        eq(vendorStores.api_key, apiKey),
        eq(vendorStores.status, 'active'),
        eq(vendorStores.chatbot_enabled, true)
      )
    )
    .limit(1);

  return vendorStore[0] || null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ vendorApiKey: string; }>; }
) {
  try {
    const { vendorApiKey } = await params;

    // Validate the API key
    const vendorStore = await validateApiKey(vendorApiKey);

    if (!vendorStore) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or inactive API key. Please check your API key or contact support.'
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, userId, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if client wants streaming
    const useStreaming = request.nextUrl.searchParams.get('stream') === 'true';

    if (useStreaming) {
      // ============================================================
      // OPTION 1: MASTRA NATIVE STREAMING
      // ============================================================

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const workflow = mastra.getWorkflow('ecommerceFlow');
            const run = await workflow.createRun();

            const result = run.stream({
              inputData: {
                message,
                session_id: sessionId || 'default',
                customer_id: userId
              }
            });

            // Stream chunks from Mastra
            for await (const chunk of result) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
              );
            }

            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({
                type: 'error',
                message: errorMessage
              })}\n\n`)
            );
            controller.close();
          }
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // ============================================================
      // OPTION 2: STANDARD JSON RESPONSE (Non-streaming)
      // ============================================================

      try {
        // @ts-expect-error - Mastra workflow execute type mismatch
        const result = await mastra.getWorkflow('ecommerceFlow').execute({
          inputData: {
            message,
            session_id: sessionId || 'default',
            customer_id: userId
          }
        });

        return NextResponse.json({
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        });
      } catch (workflowError) {
        console.error('Workflow execution error:', workflowError);

        // Return a fallback response when workflow fails
        return NextResponse.json({
          success: true,
          data: {
            message: `Ciao! Sono l'assistente di ${vendorStore.store_name}. Ho ricevuto il tuo messaggio: "${message}". Il sistema AI è in fase di configurazione, ma l'API key è stata validata correttamente!`,
            intent: 'test',
            status: 'workflow_configuring'
          },
          vendor: {
            store_name: vendorStore.store_name,
            store_url: vendorStore.store_url,
          },
          timestamp: new Date().toISOString(),
          note: 'Workflow is being configured. API key validation successful.'
        });
      }
    }
  } catch (error) {
    console.error('❌ Chatbot API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check API key validity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vendorApiKey: string; }>; }
) {
  const { vendorApiKey } = await params;

  // TODO: Validate vendorApiKey
  // const isValidApiKey = await validateApiKey(vendorApiKey);

  return NextResponse.json({
    message: 'Chatbot API is active',
    apiKey: vendorApiKey.substring(0, 8) + '...',
    endpoints: {
      chat: `/api/chatbot/${vendorApiKey}`,
      chatStream: `/api/chatbot/${vendorApiKey}?stream=true`
    }
  });
}

