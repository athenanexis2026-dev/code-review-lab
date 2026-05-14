import type { CodeTestCase } from '../utils/codeTestRunner'

export const subscriptionProrationTests: CodeTestCase[] = [
  {
    name: 'Rounds only the final prorated charge',
    functionName: 'calculateProratedCharge',
    args: [100, 20, 30],
    expected: 66.67,
  },
  {
    name: 'Returns the full monthly price when all days are active',
    functionName: 'calculateProratedCharge',
    args: [29.99, 30, 30],
    expected: 29.99,
  },
  {
    name: 'Returns 0 when no days are active',
    functionName: 'calculateProratedCharge',
    args: [29.99, 0, 30],
    expected: 0,
  },
  {
    name: 'Rejects active days greater than the billing period',
    functionName: 'calculateProratedCharge',
    args: [29.99, 31, 30],
    expectError: true,
  },
  {
    name: 'Rejects negative monthly prices',
    functionName: 'calculateProratedCharge',
    args: [-10, 10, 30],
    expectError: true,
  },
]
