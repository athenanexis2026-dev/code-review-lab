import type { CodeTestCase } from '../utils/codeTestRunner'

export const shippingThresholdTests: CodeTestCase[] = [
  {
    name: 'Uses the pre-tax subtotal for the free shipping threshold',
    functionName: 'getShippingCost',
    args: [49, 0.1, 50],
    expected: 7.99,
  },
  {
    name: 'Returns free shipping when subtotal meets the threshold',
    functionName: 'getShippingCost',
    args: [50, 0.1, 50],
    expected: 0,
  },
  {
    name: 'Handles zero subtotal with the standard shipping fee',
    functionName: 'getShippingCost',
    args: [0, 0.08, 50],
    expected: 7.99,
  },
  {
    name: 'Rejects negative subtotals',
    functionName: 'getShippingCost',
    args: [-1, 0.08, 50],
    expectError: true,
  },
  {
    name: 'Rejects invalid tax rates',
    functionName: 'getShippingCost',
    args: [40, -0.1, 50],
    expectError: true,
  },
]
