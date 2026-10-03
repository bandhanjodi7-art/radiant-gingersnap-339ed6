// Membership pricing. All amounts are INR; USD is a display-only conversion.

export type PlanFeature = { label: string; included: boolean }

export type Plan = {
  name: string
  kind: 'premium' | 'vip'
  duration: string
  months: number
  price: number
  originalPrice: number
  discountLabel?: string
  contacts?: number
  emi?: number
  footer?: string
  badge?: string
}

export const USD_RATE = 0.012

export const UPI_PAYEE = {
  name: 'Mr Rakesh Kamal',
  upiId: '9202427388@nyes',
}

export const HELPLINE = '7692962396'

export const PREMIUM_PLANS: Plan[] = [
  {
    name: 'Gold',
    kind: 'premium',
    duration: '1 Month',
    months: 1,
    price: 1240,
    originalPrice: 1550,
    discountLabel: '20% off',
    contacts: 25,
    footer: 'Standard Matching',
  },
  {
    name: 'Gold Plus',
    kind: 'premium',
    duration: '2 Months',
    months: 2,
    price: 2730,
    originalPrice: 3900,
    discountLabel: '30% off',
    contacts: 100,
    footer: 'Extended Reach',
  },
  {
    name: 'Diamond',
    kind: 'premium',
    duration: '3 Months',
    months: 3,
    price: 4865,
    originalPrice: 6950,
    discountLabel: '30% off',
    contacts: 150,
    footer: 'Higher Match Visibility',
  },
  {
    name: 'Platinum Plus',
    kind: 'premium',
    duration: '12 Months',
    months: 12,
    price: 22707,
    originalPrice: 45415,
    discountLabel: '50% off',
    contacts: 2100,
    emi: 961,
    badge: 'TOP SELLER',
  },
]

export const VIP_PLANS: Plan[] = [
  { name: 'Shaadi Select', kind: 'vip', duration: '3 Months', months: 3, price: 29999, originalPrice: 45000 },
  { name: 'VIP Shaadi', kind: 'vip', duration: '6 Months', months: 6, price: 65000, originalPrice: 95000 },
  { name: 'Global Match', kind: 'vip', duration: '6 Months', months: 6, price: 45000, originalPrice: 70000 },
]

export const ALL_PLANS = [...PREMIUM_PLANS, ...VIP_PLANS]

export function findPlan(name: string) {
  return ALL_PLANS.find((p) => p.name === name)
}

/** Premium plans unlock these perks; only the top plan gets the last two. */
export function planFeatures(plan: Plan): PlanFeature[] {
  const top = plan.name === 'Platinum Plus'
  return [
    { label: 'Send unlimited messages', included: true },
    { label: `View upto ${plan.contacts} contact numbers`, included: true },
    { label: 'Standout from other profiles', included: top },
    { label: 'Let Matches contact you directly', included: top },
  ]
}

export type Currency = 'INR' | 'USD'

export function formatMoney(amount: number, currency: Currency = 'INR') {
  if (currency === 'USD') return `$${Math.round(amount * USD_RATE).toLocaleString('en-US')}`
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

export function upiLink(plan: Plan) {
  const params = new URLSearchParams({
    pa: UPI_PAYEE.upiId,
    pn: UPI_PAYEE.name,
    am: String(plan.price),
    cu: 'INR',
    tn: `BandhanJodi ${plan.name} Plan`,
  })
  return `upi://pay?${params.toString().replace(/\+/g, '%20')}`
}
