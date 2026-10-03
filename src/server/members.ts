import { createServerFn } from '@tanstack/react-start'
import { getUser } from '@netlify/identity'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { membershipPayments, registrations } from '../../db/schema.js'
import { registrationSchema } from '../lib/registration'
import { findPlan } from '../lib/plans'

export const submitRegistration = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z.object({ form: registrationSchema, identityUserId: z.string().nullable() }).parse(data),
  )
  .handler(async ({ data }) => {
    const { form: f, identityUserId } = data

    const existing = await db
      .select({ id: registrations.id })
      .from(registrations)
      .where(eq(registrations.email, f.email))
      .limit(1)
    if (existing.length > 0) {
      return { ok: false as const, error: 'A profile with this email is already registered. Please log in instead.' }
    }

    const [row] = await db
      .insert(registrations)
      .values({
        email: f.email,
        identityUserId,
        profileFor: f.profileFor,
        gender: f.gender,
        firstName: f.firstName,
        lastName: f.lastName,
        dateOfBirth: `${f.dobYear}-${f.dobMonth}-${f.dobDay.padStart(2, '0')}`,
        religion: f.religion,
        community: f.community,
        country: f.country,
        state: f.state,
        city: f.city,
        maritalStatus: f.maritalStatus,
        family: {
          father: f.fatherPassedAway ? 'Passed Away' : f.fatherName,
          fatherOccupation: f.fatherPassedAway ? '' : f.fatherOccupation,
          mother: f.motherPassedAway ? 'Passed Away' : f.motherName,
          motherOccupation: f.motherPassedAway ? '' : f.motherOccupation,
          brother: f.brotherNA ? 'N/A' : f.brotherName,
          sister: f.sisterNA ? 'N/A' : f.sisterName,
          familyStatus: f.familyStatus,
          subCommunity: f.subCommunity,
        },
        lifestyle: {
          height: f.height,
          diet: f.diet,
          complexion: f.complexion,
          ethnicity: f.ethnicity,
          drink: f.drink,
          smoke: f.smoke,
        },
        preferences: {
          maritalStatus: f.prefMarital,
          religion: f.prefReligion,
          education: f.prefEducation,
          country: f.prefCountry,
          ageFrom: f.prefAgeFrom,
          ageTo: f.prefAgeTo,
          drinking: f.prefDrinking,
          smoking: f.prefSmoking,
          residency: f.prefResidency,
          diet: f.prefDiet,
        },
        intro: f.intro,
      })
      .returning({ id: registrations.id })

    return { ok: true as const, registrationId: row.id }
  })

export const recordPayment = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) =>
    z
      .object({
        registrationId: z.string().uuid().nullable(),
        plan: z.string(),
        upiReference: z.string().trim().max(64).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const plan = findPlan(data.plan)
    if (!plan) throw new Error('Unknown plan')

    // Logged-in members are linked by their account; otherwise use the id
    // returned when they registered in this browser.
    let registrationId = data.registrationId
    if (!registrationId) {
      const user = await getUser()
      if (user?.email) {
        const [mine] = await db
          .select({ id: registrations.id })
          .from(registrations)
          .where(eq(registrations.email, user.email.toLowerCase()))
          .limit(1)
        registrationId = mine?.id ?? null
      }
    }

    await db.insert(membershipPayments).values({
      registrationId,
      plan: plan.name,
      duration: plan.duration,
      amountInr: plan.price,
      upiReference: data.upiReference || null,
    })
    return { ok: true }
  })

export const getMyProfile = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await getUser()
  if (!user?.email) return { signedIn: false as const }

  const [profile] = await db
    .select()
    .from(registrations)
    .where(eq(registrations.email, user.email.toLowerCase()))
    .limit(1)

  const payments = profile
    ? await db
        .select()
        .from(membershipPayments)
        .where(eq(membershipPayments.registrationId, profile.id))
        .orderBy(desc(membershipPayments.createdAt))
    : []

  return {
    signedIn: true as const,
    email: user.email,
    profile: profile
      ? {
          ...profile,
          family: profile.family as Record<string, string>,
          lifestyle: profile.lifestyle as Record<string, string>,
          preferences: profile.preferences as Record<string, string | number>,
          createdAt: profile.createdAt.toISOString(),
        }
      : null,
    payments: payments.map((p) => ({
      id: p.id,
      plan: p.plan,
      duration: p.duration,
      amountInr: p.amountInr,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    })),
  }
})
