CREATE TYPE "call_to_member_role" AS ENUM('admin');--> statement-breakpoint
CREATE TYPE "call_visibility" AS ENUM('public', 'private', 'restricted');--> statement-breakpoint
CREATE TYPE "invite_status" AS ENUM('pending', 'accepted');--> statement-breakpoint
CREATE TYPE "org_member_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "call" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"org_id" text NOT NULL,
	"metadata" jsonb,
	"call_visibility" "call_visibility" DEFAULT 'private'::"call_visibility" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "call_to_member" (
	"call_id" text,
	"member_id" text,
	"call_to_member_role" "call_to_member_role" DEFAULT 'admin'::"call_to_member_role" NOT NULL,
	CONSTRAINT "call_to_member_pkey" PRIMARY KEY("call_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "judgement" (
	"id" text PRIMARY KEY,
	"submission_id" text NOT NULL,
	"juror_id" text NOT NULL,
	"data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "judgement_juror_id_submission_id_unique" UNIQUE("juror_id","submission_id")
);
--> statement-breakpoint
CREATE TABLE "juror" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"round_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "juror_user_id_round_id_unique" UNIQUE("user_id","round_id")
);
--> statement-breakpoint
CREATE TABLE "juror_invite" (
	"id" text PRIMARY KEY,
	"email" text NOT NULL,
	"round_id" text NOT NULL,
	"invite_status" "invite_status" DEFAULT 'pending'::"invite_status" NOT NULL,
	"invited_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"org_id" text NOT NULL,
	"org_member_role" "org_member_role" DEFAULT 'member'::"org_member_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "member_org_id_user_id_unique" UNIQUE("org_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "member_invite" (
	"id" text PRIMARY KEY,
	"email" text NOT NULL,
	"org_id" text NOT NULL,
	"org_member_role" "org_member_role" DEFAULT 'member'::"org_member_role" NOT NULL,
	"invite_status" "invite_status" DEFAULT 'pending'::"invite_status" NOT NULL,
	"invited_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participant" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"call_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "participant_call_id_user_id_unique" UNIQUE("call_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "round" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"call_id" text NOT NULL,
	"form_schema" jsonb,
	"judging_schema" jsonb,
	"metadata" jsonb,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" text PRIMARY KEY,
	"round_id" text NOT NULL,
	"participant_id" text NOT NULL,
	"data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "call" ADD CONSTRAINT "call_org_id_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "call_to_member" ADD CONSTRAINT "call_to_member_call_id_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "call"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "call_to_member" ADD CONSTRAINT "call_to_member_member_id_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "judgement" ADD CONSTRAINT "judgement_submission_id_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submission"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "judgement" ADD CONSTRAINT "judgement_juror_id_juror_id_fkey" FOREIGN KEY ("juror_id") REFERENCES "juror"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "juror" ADD CONSTRAINT "juror_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "juror" ADD CONSTRAINT "juror_round_id_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "juror_invite" ADD CONSTRAINT "juror_invite_round_id_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "juror_invite" ADD CONSTRAINT "juror_invite_invited_by_member_id_fkey" FOREIGN KEY ("invited_by") REFERENCES "member"("id");--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_org_id_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member_invite" ADD CONSTRAINT "member_invite_org_id_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "org"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "member_invite" ADD CONSTRAINT "member_invite_invited_by_member_id_fkey" FOREIGN KEY ("invited_by") REFERENCES "member"("id");--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_call_id_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "call"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "round" ADD CONSTRAINT "round_call_id_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "call"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_round_id_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "round"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_participant_id_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participant"("id") ON DELETE CASCADE;