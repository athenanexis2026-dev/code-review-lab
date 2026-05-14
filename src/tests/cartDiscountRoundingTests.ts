import type { CodeTestCase } from '../utils/codeTestRunner'

export const cartDiscountRoundingTests: CodeTestCase[] = [
  {
    name: 'Empty carts return 0',
    functionName: 'calculateTotal',
    args: [[], 20],
    expected: 0,
  },
  {
    name: 'Rounds only after applying the discount to the cart subtotal',
    functionName: 'calculateTotal',
    args: [
      [
        { price: 0.335, quantity: 3 },
        { price: 0.335, quantity: 3 },
      ],
      10,
    ],
    expected: 1.81,
  },
  {
    name: 'A 100% discount returns 0',
    functionName: 'calculateTotal',
    args: [[{ price: 19.99, quantity: 2 }], 100],
    expected: 0,
  },
  {
    name: 'Rejects negative cart item values',
    functionName: 'calculateTotal',
    args: [[{ price: -3, quantity: 1 }], 10],
    expectError: true,
  },
  {
    name: 'Rejects discounts outside 0-100',
    functionName: 'calculateTotal',
    args: [[{ price: 10, quantity: 1 }], 125],
    expectError: true,
  },
]
