import type { CodeTestCase } from '../utils/codeTestRunner'

const savedProfile = {
  id: 'user-1',
  displayName: 'Ari',
  preferences: {
    email: true,
    sms: false,
    push: true,
  },
}

export const profileMergeTests: CodeTestCase[] = [
  {
    name: 'Preserves existing values when update omits fields',
    functionName: 'mergeProfile',
    args: [savedProfile, {}],
    expected: savedProfile,
  },
  {
    name: 'Allows displayName to be explicitly cleared',
    functionName: 'mergeProfile',
    args: [savedProfile, { displayName: null }],
    expected: {
      ...savedProfile,
      displayName: null,
    },
  },
  {
    name: 'Deep-merges changed notification preferences',
    functionName: 'mergeProfile',
    args: [savedProfile, { preferences: { sms: true } }],
    expected: {
      ...savedProfile,
      preferences: {
        email: true,
        sms: true,
        push: true,
      },
    },
  },
  {
    name: 'Preserves unknown preference keys',
    functionName: 'mergeProfile',
    args: [
      {
        ...savedProfile,
        preferences: {
          ...savedProfile.preferences,
          inAppDigest: true,
        },
      },
      { preferences: { email: false } },
    ],
    expected: {
      ...savedProfile,
      preferences: {
        email: false,
        sms: false,
        push: true,
        inAppDigest: true,
      },
    },
  },
  {
    name: 'Does not mutate the saved profile object',
    assert: (exports) => {
      const mergeProfile = exports.mergeProfile

      if (typeof mergeProfile !== 'function') {
        throw new Error('Expected the code to export mergeProfile.')
      }

      const original = {
        id: 'user-2',
        displayName: 'Lee',
        preferences: {
          email: true,
          sms: false,
        },
      }
      const before = JSON.stringify(original)

      mergeProfile(original, { preferences: { sms: true } })

      if (JSON.stringify(original) !== before) {
        throw new Error('mergeProfile mutated the saved profile.')
      }
    },
  },
]
