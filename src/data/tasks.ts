export type ReviewTask = {
  id: string
  title: string
  category: 'Bug Fix' | 'Test Writing' | 'Refactor'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  expectedBehavior: string[]
  edgeCases: string[]
  buggyCode: string
  fixedCode: string
  testResults: {
    total: number
    passed: number
    failed: number
    failedCases: string[]
  }
  reviewComments: string[]
  rubric: {
    correctness: number
    tests: number
    edgeCases: number
    codeQuality: number
    clarity: number
  }
}

export const tasks: ReviewTask[] = [
  {
    id: 'cart-discount-rounding',
    title: 'Repair Cart Discount Rounding',
    category: 'Bug Fix',
    difficulty: 'Medium',
    description:
      'A checkout helper applies percentage discounts, but it rounds each line item before summing the cart. The bug creates penny-level drift in realistic orders and can overcharge customers.',
    expectedBehavior: [
      'Calculate the subtotal from all valid cart items before applying the discount.',
      'Apply the percentage discount once to the subtotal.',
      'Round only the final payable amount to two decimal places.',
      'Reject negative quantities, negative prices, and discounts outside 0-100.',
    ],
    edgeCases: [
      'Empty carts return 0 without throwing.',
      'Fractional prices such as 19.995 are handled consistently.',
      'A 100% discount returns 0.',
      'Invalid input fails before any amount is returned.',
    ],
    buggyCode: `type CartItem = {
  price: number
  quantity: number
}

export function calculateTotal(items: CartItem[], discount: number) {
  return items.reduce((total, item) => {
    const discounted = item.price * item.quantity * (1 - discount / 100)
    return total + Math.round(discounted * 100) / 100
  }, 0)
}`,
    fixedCode: `type CartItem = {
  price: number
  quantity: number
}

export function calculateTotal(items: CartItem[], discount: number) {
  if (discount < 0 || discount > 100) {
    throw new RangeError('Discount must be between 0 and 100')
  }

  const subtotal = items.reduce((total, item) => {
    if (item.price < 0 || item.quantity < 0) {
      throw new RangeError('Cart item values cannot be negative')
    }

    return total + item.price * item.quantity
  }, 0)

  const discountedTotal = subtotal * (1 - discount / 100)
  return Math.round(discountedTotal * 100) / 100
}`,
    testResults: {
      total: 5,
      passed: 2,
      failed: 3,
      failedCases: [
        'Rounds each discounted line instead of the final total.',
        'Accepts a negative item price and returns a misleading total.',
        'Accepts discounts above 100% instead of rejecting invalid input.',
      ],
    },
    reviewComments: [
      'The reference fix moves rounding to the final calculation, which matches the financial requirement.',
      'Input validation is explicit and easy to test.',
      'The tests should include both drift-producing decimals and invalid cart item values.',
    ],
    rubric: {
      correctness: 94,
      tests: 90,
      edgeCases: 92,
      codeQuality: 95,
      clarity: 93,
    },
  },
  {
    id: 'profile-merge-tests',
    title: 'Design Tests For Profile Merge',
    category: 'Test Writing',
    difficulty: 'Hard',
    description:
      'A profile merge utility combines a saved user profile with partial updates. The implementation mostly works for happy paths, but sparse objects and nullable fields are under-tested.',
    expectedBehavior: [
      'Preserve existing profile values when an update omits a field.',
      'Allow explicit null for optional fields that users can clear.',
      'Deep-merge notification preferences without dropping existing channels.',
      'Never mutate the original saved profile object.',
    ],
    edgeCases: [
      'Update payload contains an empty nested preferences object.',
      'Optional displayName is explicitly set to null.',
      'Saved profile has unknown preference keys from a newer client.',
      'Multiple updates run against the same source object.',
    ],
    buggyCode: `type Profile = {
  id: string
  displayName: string | null
  preferences: Record<string, boolean>
}

export function mergeProfile(saved: Profile, update: Partial<Profile>) {
  return {
    ...saved,
    ...update,
    preferences: update.preferences || saved.preferences,
  }
}`,
    fixedCode: `type Profile = {
  id: string
  displayName: string | null
  preferences: Record<string, boolean>
}

export function mergeProfile(saved: Profile, update: Partial<Profile>) {
  return {
    ...saved,
    ...update,
    preferences: {
      ...saved.preferences,
      ...(update.preferences ?? {}),
    },
  }
}`,
    testResults: {
      total: 5,
      passed: 3,
      failed: 2,
      failedCases: [
        'Replacing preferences drops saved channels when only one channel is updated.',
        'A mutation check is missing for callers that reuse the saved profile.',
      ],
    },
    reviewComments: [
      'The strongest tests assert object identity and source immutability, not just returned values.',
      'The final suite covers explicit null separately from undefined, which is the key ambiguity in this task.',
      'A table-driven test layout would make the edge-case expectations easier to audit.',
    ],
    rubric: {
      correctness: 91,
      tests: 96,
      edgeCases: 95,
      codeQuality: 90,
      clarity: 92,
    },
  },
  {
    id: 'invoice-normalization-refactor',
    title: 'Refactor Invoice Normalization',
    category: 'Refactor',
    difficulty: 'Medium',
    description:
      'An invoice import path normalizes rows from multiple vendors. The current function mixes parsing, validation, and formatting, which makes review difficult and hides a timezone bug.',
    expectedBehavior: [
      'Normalize vendor dates to ISO yyyy-mm-dd strings.',
      'Treat blank memo fields as an empty string.',
      'Return structured validation errors for missing invoice IDs or invalid totals.',
      'Keep parsing helpers small enough to review independently.',
    ],
    edgeCases: [
      'Date strings with timezone offsets should not roll into the previous day.',
      'Totals supplied as strings with commas should parse correctly.',
      'Blank memo fields should not become the text "undefined".',
      'Rows with multiple validation failures should report all failures.',
    ],
    buggyCode: `export function normalizeInvoice(row: Record<string, string>) {
  return {
    invoiceId: row.id,
    total: Number(row.total),
    issuedOn: new Date(row.date).toISOString().slice(0, 10),
    memo: String(row.memo),
  }
}`,
    fixedCode: `type NormalizedInvoice = {
  invoiceId: string
  total: number
  issuedOn: string
  memo: string
}

export function normalizeInvoice(row: Record<string, string>) {
  const errors: string[] = []
  const invoiceId = row.id?.trim()
  const total = Number(row.total?.replaceAll(',', ''))

  if (!invoiceId) errors.push('invoiceId is required')
  if (!Number.isFinite(total) || total < 0) errors.push('total is invalid')

  if (errors.length > 0) {
    return { ok: false as const, errors }
  }

  const invoice: NormalizedInvoice = {
    invoiceId,
    total,
    issuedOn: row.date.slice(0, 10),
    memo: row.memo?.trim() ?? '',
  }

  return { ok: true as const, invoice }
}`,
    testResults: {
      total: 5,
      passed: 0,
      failed: 5,
      failedCases: [
        'Valid rows are returned in the old plain-object shape instead of a discriminated result.',
        'Timezone conversion changes the calendar date for offset timestamps.',
        'Comma-formatted totals become NaN.',
        'Missing IDs are returned as undefined instead of structured validation errors.',
        'Multiple validation errors are not collected together.',
      ],
    },
    reviewComments: [
      'The refactor separates validation from formatting without adding unnecessary architecture.',
      'Returning a discriminated result makes downstream handling safer than throwing in the import loop.',
      'The remaining risk is vendor-specific date formats, which should be captured in follow-up fixtures.',
    ],
    rubric: {
      correctness: 89,
      tests: 88,
      edgeCases: 94,
      codeQuality: 93,
      clarity: 91,
    },
  },
  {
    id: 'shipping-threshold-tax',
    title: 'Repair Shipping Threshold Tax',
    category: 'Bug Fix',
    difficulty: 'Easy',
    description:
      'A shipping helper decides whether an order qualifies for free shipping, but it uses the tax-included amount for the threshold. That lets under-threshold orders skip shipping fees.',
    expectedBehavior: [
      'Use the pre-tax subtotal when checking the free shipping threshold.',
      'Return the standard shipping fee for orders below the threshold.',
      'Return 0 when the subtotal meets or exceeds the threshold.',
      'Reject negative subtotals, thresholds, and invalid tax rates.',
    ],
    edgeCases: [
      'A subtotal one cent below the threshold still pays shipping.',
      'A subtotal exactly at the threshold gets free shipping.',
      'Zero-dollar carts still return the standard shipping fee.',
      'Invalid numeric inputs fail before returning a fee.',
    ],
    buggyCode: `export function getShippingCost(
  subtotal: number,
  taxRate: number,
  freeShippingThreshold: number,
) {
  const totalWithTax = subtotal * (1 + taxRate)

  if (totalWithTax >= freeShippingThreshold) {
    return 0
  }

  return 7.99
}`,
    fixedCode: `export function getShippingCost(
  subtotal: number,
  taxRate: number,
  freeShippingThreshold: number,
) {
  if (subtotal < 0 || freeShippingThreshold < 0 || taxRate < 0 || taxRate > 1) {
    throw new RangeError('Invalid shipping inputs')
  }

  if (subtotal >= freeShippingThreshold) {
    return 0
  }

  return 7.99
}`,
    testResults: {
      total: 5,
      passed: 2,
      failed: 3,
      failedCases: [
        'Tax-included totals incorrectly qualify below-threshold orders.',
        'Negative subtotals are accepted instead of rejected.',
        'Invalid tax rates are accepted and can produce misleading fees.',
      ],
    },
    reviewComments: [
      'The corrected implementation checks the threshold against the same subtotal shown to shoppers before tax.',
      'Input validation prevents silent success for negative financial values.',
      'The tests pin the boundary at just below, exactly at, and invalid inputs.',
    ],
    rubric: {
      correctness: 92,
      tests: 91,
      edgeCases: 90,
      codeQuality: 94,
      clarity: 93,
    },
  },
  {
    id: 'subscription-proration-rounding',
    title: 'Repair Subscription Proration Rounding',
    category: 'Bug Fix',
    difficulty: 'Medium',
    description:
      'A billing helper prorates monthly subscription charges, but it rounds the daily rate before multiplying by active days. That creates drift on partial billing periods.',
    expectedBehavior: [
      'Calculate the prorated amount from the exact monthly price and day ratio.',
      'Round only the final charge to two decimal places.',
      'Return the full monthly price when the subscription is active for the full period.',
      'Reject negative prices and impossible day counts.',
    ],
    edgeCases: [
      'Zero active days returns 0.',
      'Active days cannot exceed days in the billing period.',
      'Billing periods must have at least one day.',
      'Prices with cents should not lose precision through daily-rate rounding.',
    ],
    buggyCode: `export function calculateProratedCharge(
  monthlyPrice: number,
  activeDays: number,
  daysInPeriod: number,
) {
  const dailyRate = Math.round((monthlyPrice / daysInPeriod) * 100) / 100

  return Math.round(dailyRate * activeDays * 100) / 100
}`,
    fixedCode: `export function calculateProratedCharge(
  monthlyPrice: number,
  activeDays: number,
  daysInPeriod: number,
) {
  if (
    monthlyPrice < 0 ||
    activeDays < 0 ||
    daysInPeriod <= 0 ||
    activeDays > daysInPeriod
  ) {
    throw new RangeError('Invalid proration inputs')
  }

  const proratedCharge = monthlyPrice * (activeDays / daysInPeriod)

  return Math.round(proratedCharge * 100) / 100
}`,
    testResults: {
      total: 5,
      passed: 2,
      failed: 3,
      failedCases: [
        'Rounding the daily rate first changes partial-period charges.',
        'Impossible day counts are accepted instead of rejected.',
        'Negative monthly prices are accepted instead of rejected.',
      ],
    },
    reviewComments: [
      'The fix keeps full precision until the final payable charge.',
      'Validation guards the billing helper against nonsensical periods and prices.',
      'The tests cover both rounding drift and business-rule boundaries.',
    ],
    rubric: {
      correctness: 93,
      tests: 92,
      edgeCases: 91,
      codeQuality: 94,
      clarity: 92,
    },
  },
]
