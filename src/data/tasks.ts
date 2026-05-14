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
      total: 12,
      passed: 10,
      failed: 2,
      failedCases: [
        'Rounds each discounted line instead of the final total.',
        'Accepts a negative item price and returns a misleading total.',
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
      total: 15,
      passed: 13,
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
      total: 14,
      passed: 11,
      failed: 3,
      failedCases: [
        'Timezone conversion changes the calendar date for offset timestamps.',
        'Comma-formatted totals become NaN.',
        'Missing IDs are returned as undefined instead of structured validation errors.',
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
]
