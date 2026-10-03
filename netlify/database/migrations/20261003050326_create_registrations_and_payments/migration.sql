CREATE TABLE "membership_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"registration_id" uuid,
	"plan" text NOT NULL,
	"duration" text NOT NULL,
	"amount_inr" integer NOT NULL,
	"upi_reference" text,
	"status" text DEFAULT 'awaiting_verification' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL UNIQUE,
	"identity_user_id" text,
	"profile_for" text NOT NULL,
	"gender" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" text NOT NULL,
	"religion" text NOT NULL,
	"community" text NOT NULL,
	"country" text NOT NULL,
	"state" text NOT NULL,
	"city" text NOT NULL,
	"marital_status" text NOT NULL,
	"family" jsonb NOT NULL,
	"lifestyle" jsonb NOT NULL,
	"preferences" jsonb NOT NULL,
	"intro" text NOT NULL,
	"status" text DEFAULT 'pending_review' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "membership_payments" ADD CONSTRAINT "membership_payments_registration_id_registrations_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id");