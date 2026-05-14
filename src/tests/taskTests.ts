import type { CodeTestCase } from '../utils/codeTestRunner'
import { cartDiscountRoundingTests } from './cartDiscountRoundingTests'
import { invoiceNormalizationTests } from './invoiceNormalizationTests'
import { profileMergeTests } from './profileMergeTests'
import { shippingThresholdTests } from './shippingThresholdTests'
import { subscriptionProrationTests } from './subscriptionProrationTests'

export const taskTestsById: Record<string, CodeTestCase[]> = {
  'cart-discount-rounding': cartDiscountRoundingTests,
  'profile-merge-tests': profileMergeTests,
  'invoice-normalization-refactor': invoiceNormalizationTests,
  'shipping-threshold-tax': shippingThresholdTests,
  'subscription-proration-rounding': subscriptionProrationTests,
}
