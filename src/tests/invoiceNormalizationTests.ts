import type { CodeTestCase } from '../utils/codeTestRunner'

export const invoiceNormalizationTests: CodeTestCase[] = [
  {
    name: 'Returns a normalized invoice for valid vendor rows',
    functionName: 'normalizeInvoice',
    args: [{ id: ' INV-100 ', total: '123.45', date: '2026-04-18', memo: ' Paid ' }],
    expected: {
      ok: true,
      invoice: {
        invoiceId: 'INV-100',
        total: 123.45,
        issuedOn: '2026-04-18',
        memo: 'Paid',
      },
    },
  },
  {
    name: 'Parses comma-formatted totals',
    functionName: 'normalizeInvoice',
    args: [{ id: 'INV-101', total: '1,240.50', date: '2026-04-19', memo: 'Import' }],
    expected: {
      ok: true,
      invoice: {
        invoiceId: 'INV-101',
        total: 1240.5,
        issuedOn: '2026-04-19',
        memo: 'Import',
      },
    },
  },
  {
    name: 'Does not roll offset timestamps into another calendar date',
    functionName: 'normalizeInvoice',
    args: [{ id: 'INV-102', total: '50', date: '2026-03-01T00:30:00+05:00', memo: '' }],
    expected: {
      ok: true,
      invoice: {
        invoiceId: 'INV-102',
        total: 50,
        issuedOn: '2026-03-01',
        memo: '',
      },
    },
  },
  {
    name: 'Returns validation errors for missing invoice IDs',
    functionName: 'normalizeInvoice',
    args: [{ id: '   ', total: '15', date: '2026-04-20', memo: 'Missing id' }],
    expected: {
      ok: false,
      errors: ['invoiceId is required'],
    },
  },
  {
    name: 'Reports all validation failures in one response',
    functionName: 'normalizeInvoice',
    args: [{ id: '', total: '-2', date: '2026-04-20', memo: '' }],
    expected: {
      ok: false,
      errors: ['invoiceId is required', 'total is invalid'],
    },
  },
]
