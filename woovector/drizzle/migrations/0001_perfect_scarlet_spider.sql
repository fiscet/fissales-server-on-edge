CREATE TABLE "vendor_stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"store_name" text NOT NULL,
	"store_url" text,
	"api_key" text NOT NULL,
	"brand_voice" text,
	"store_description" text,
	"default_language" text DEFAULT 'en' NOT NULL,
	"wc_consumer_key" text,
	"wc_consumer_secret" text,
	"wc_api_url" text,
	"chatbot_enabled" boolean DEFAULT true NOT NULL,
	"max_session_length" text DEFAULT '30m' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vendor_stores_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"description_extra" text,
	"price" numeric(10, 2) NOT NULL,
	"stock" integer DEFAULT 0,
	"image_url" text,
	"product_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vendor_stores" ADD CONSTRAINT "vendor_stores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_vendor_stores_user_id" ON "vendor_stores" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_vendor_stores_api_key" ON "vendor_stores" USING btree ("api_key");--> statement-breakpoint
CREATE INDEX "idx_vendor_stores_status" ON "vendor_stores" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_vendor_stores_chatbot_enabled" ON "vendor_stores" USING btree ("chatbot_enabled");