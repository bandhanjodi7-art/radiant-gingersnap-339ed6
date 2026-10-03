import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// One row per completed registration. The member's login password lives in
// Netlify Identity only — it is never stored here.
export const registrations = pgTable('registrations', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  identityUserId: text('identity_user_id'),
  profileFor: text('profile_for').notNull(),
  gender: text().notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  religion: text().notNull(),
  community: text().notNull(),
  country: text().notNull(),
  state: text().notNull(),
  city: text().notNull(),
  maritalStatus: text('marital_status').notNull(),
  // Family, lifestyle and partner-preference answers, kept as structured JSON
  family: jsonb().notNull(),
  lifestyle: jsonb().notNull(),
  preferences: jsonb().notNull(),
  intro: text().notNull(),
  status: text().notNull().default('pending_review'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// A member's claim that they paid for a plan over UPI, awaiting verification.
export const membershipPayments = pgTable('membership_payments', {
  id: uuid().primaryKey().defaultRandom(),
  registrationId: uuid('registration_id').references(() => registrations.id),
  plan: text().notNull(),
  duration: text().notNull(),
  amountInr: integer('amount_inr').notNull(),
  upiReference: text('upi_reference'),
  status: text().notNull().default('awaiting_verification'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
