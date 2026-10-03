import { z } from 'zod'

// Everything the member enters across the registration steps (except the
// password, which goes straight to Netlify Identity and is never persisted).
export type RegistrationForm = {
  profileFor: string
  gender: string
  firstName: string
  lastName: string
  dobDay: string
  dobMonth: string
  dobYear: string
  fatherName: string
  fatherOccupation: string
  fatherPassedAway: boolean
  motherName: string
  motherOccupation: string
  motherPassedAway: boolean
  brotherName: string
  brotherNA: boolean
  sisterName: string
  sisterNA: boolean
  familyStatus: string
  religion: string
  community: string
  country: string
  state: string
  city: string
  subCommunity: string
  maritalStatus: string
  height: string
  diet: string
  complexion: string
  ethnicity: string
  drink: string
  smoke: string
  email: string
  prefMarital: string
  prefReligion: string
  prefEducation: string
  prefCountry: string
  prefAgeFrom: number
  prefAgeTo: number
  prefDrinking: string
  prefSmoking: string
  prefResidency: string
  prefDiet: string
  intro: string
}

export const emptyForm: RegistrationForm = {
  profileFor: '',
  gender: '',
  firstName: '',
  lastName: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  fatherName: '',
  fatherOccupation: '',
  fatherPassedAway: false,
  motherName: '',
  motherOccupation: '',
  motherPassedAway: false,
  brotherName: '',
  brotherNA: false,
  sisterName: '',
  sisterNA: false,
  familyStatus: '',
  religion: '',
  community: '',
  country: 'India',
  state: '',
  city: '',
  subCommunity: '',
  maritalStatus: '',
  height: '',
  diet: '',
  complexion: '',
  ethnicity: '',
  drink: '',
  smoke: '',
  email: '',
  prefMarital: '',
  prefReligion: '',
  prefEducation: '',
  prefCountry: '',
  prefAgeFrom: 21,
  prefAgeTo: 28,
  prefDrinking: '',
  prefSmoking: '',
  prefResidency: '',
  prefDiet: '',
  intro: '',
}

export const INTRO_MIN = 50
export const INTRO_MAX = 4000

const req = z.string().trim().min(1)

export const registrationSchema = z.object({
  profileFor: req,
  gender: req,
  firstName: req.max(80),
  lastName: req.max(80),
  dobDay: req,
  dobMonth: req,
  dobYear: req,
  fatherName: z.string().max(120),
  fatherOccupation: z.string().max(60),
  fatherPassedAway: z.boolean(),
  motherName: z.string().max(120),
  motherOccupation: z.string().max(60),
  motherPassedAway: z.boolean(),
  brotherName: z.string().max(120),
  brotherNA: z.boolean(),
  sisterName: z.string().max(120),
  sisterNA: z.boolean(),
  familyStatus: req,
  religion: req,
  community: req,
  country: req,
  state: req.max(80),
  city: req.max(80),
  subCommunity: z.string().max(120),
  maritalStatus: req,
  height: req,
  diet: req,
  complexion: req,
  ethnicity: req,
  drink: req,
  smoke: req,
  email: z.string().trim().toLowerCase().email(),
  prefMarital: req,
  prefReligion: req,
  prefEducation: req,
  prefCountry: req,
  prefAgeFrom: z.number().int().min(18).max(80),
  prefAgeTo: z.number().int().min(18).max(80),
  prefDrinking: req,
  prefSmoking: req,
  prefResidency: z.string(),
  prefDiet: z.string(),
  intro: z.string().trim().min(INTRO_MIN).max(INTRO_MAX),
})

export function fullName(f: Pick<RegistrationForm, 'firstName' | 'lastName'>) {
  return `${f.firstName} ${f.lastName}`.trim()
}

export function dobLabel(f: Pick<RegistrationForm, 'dobDay' | 'dobMonth' | 'dobYear'>) {
  return `${f.dobDay}/${f.dobMonth}/${f.dobYear}`
}

/** Per-step completeness checks, mirroring which fields each step requires. */
export function stepComplete(step: number, f: RegistrationForm, password: string): boolean {
  switch (step) {
    case 2:
      return !!(f.profileFor && f.gender)
    case 3:
      return !!(f.firstName.trim() && f.lastName.trim() && f.dobDay && f.dobMonth && f.dobYear && f.familyStatus)
    case 4:
      return !!(f.religion && f.community && f.country)
    case 5:
      return !!(f.state.trim() && f.city.trim())
    case 6:
      return !!(f.maritalStatus && f.height && f.diet)
    case 7:
      return !!(
        f.complexion &&
        f.ethnicity &&
        f.drink &&
        f.smoke &&
        /^\S+@\S+\.\S+$/.test(f.email.trim()) &&
        password.length >= 6
      )
    case 8:
      return !!(f.prefMarital && f.prefReligion && f.prefEducation)
    case 9:
      return !!(f.prefCountry && f.prefDrinking && f.prefSmoking && f.prefAgeFrom <= f.prefAgeTo)
    case 10: {
      const len = f.intro.trim().length
      return len >= INTRO_MIN && len <= INTRO_MAX
    }
    default:
      return true
  }
}

/** Plain-text profile used by the Share button. */
export function shareText(f: RegistrationForm, url: string) {
  const v = (s: string) => s || '-'
  return [
    'BandhanJodi - Profile Details',
    '================================',
    '',
    `Profile For: ${v(f.profileFor)}`,
    `Full Name: ${v(fullName(f))}`,
    `Gender: ${v(f.gender)}`,
    `Date of Birth: ${dobLabel(f)}`,
    `Email: ${v(f.email)}`,
    '',
    '-- Family Details --',
    `Father: ${v(f.fatherName)} (${v(f.fatherOccupation)})`,
    `Mother: ${v(f.motherName)} (${v(f.motherOccupation)})`,
    `Brother: ${v(f.brotherName)}`,
    `Sister: ${v(f.sisterName)}`,
    `Family Status: ${v(f.familyStatus)}`,
    '',
    '-- Religion & Location --',
    `Religion: ${v(f.religion)}`,
    `Community: ${v(f.community)}`,
    `Gotra/Sub-Community: ${v(f.subCommunity)}`,
    `Location: ${f.city}, ${f.state}, ${f.country}`,
    '',
    '-- Lifestyle & Attributes --',
    `Marital Status: ${v(f.maritalStatus)}`,
    `Height: ${v(f.height)}`,
    `Diet: ${v(f.diet)}`,
    `Complexion: ${v(f.complexion)}`,
    `Ethnicity: ${v(f.ethnicity)}`,
    `Drink: ${v(f.drink)}`,
    `Smoke: ${v(f.smoke)}`,
    '',
    '-- Partner Preferences --',
    `Preferred Marital Status: ${v(f.prefMarital)}`,
    `Preferred Religion: ${v(f.prefReligion)}`,
    `Preferred Education: ${v(f.prefEducation)}`,
    `Preferred Country: ${v(f.prefCountry)}`,
    `Preferred Age: ${f.prefAgeFrom} to ${f.prefAgeTo}`,
    `Preferred Drinking: ${v(f.prefDrinking)}`,
    `Preferred Smoking: ${v(f.prefSmoking)}`,
    `Looking For: ${v(f.prefResidency)}`,
    `Preferred Diet: ${v(f.prefDiet)}`,
    '',
    '-- About Introduction --',
    v(f.intro),
    '',
    `Shared from BandhanJodi: ${url}`,
  ].join('\n')
}
