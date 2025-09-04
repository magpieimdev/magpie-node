/**
 * Test fixtures containing mock API responses and test data
 * These mirror the actual Magpie API response structures
 */

export const mockCustomer = {
  id: 'cus_test_123456',
  object: 'customer',
  created: 1640995200,
  email: 'test@example.com',
  name: 'Test Customer',
  phone: '+63917123456',
  description: null,
  metadata: {},
  livemode: false
};

export const mockSource = {
  id: 'src_test_123456',
  object: 'source',
  type: 'card',
  created: 1640995200,
  currency: 'php',
  livemode: false,
  owner: {
    email: 'test@example.com',
    name: 'Test User',
    phone: '+63917123456',
  },
  card: {
    brand: 'visa',
    country: 'PH',
    exp_month: 12,
    exp_year: 2025,
    funding: 'credit',
    last4: '4242',
  },
  redirect: {
    success: 'https://example.com/success',
    fail: 'https://example.com/fail',
    notify: 'https://example.com/notify',
  }
};

export const mockCharge = {
  id: 'ch_test_123456',
  object: 'charge',
  amount: 10000,
  currency: 'php',
  created: 1640995200,
  description: 'Test charge',
  livemode: false,
  status: 'succeeded',
  source: 'src_test_123456',
  metadata: {},
  refunds: {},
  statement_descriptor: null,
  captured: true,
};

export const mockCheckoutSession = {
  id: 'cs_test_123456',
  object: 'checkout.session',
  cancel_url: 'https://example.com/cancel',
  client_reference_id: null,
  customer: null,
  customer_email: null,
  display_items: [
    {
      amount: 2000,
      currency: 'php',
      custom: {
        name: 'T-shirt',
        description: 'Comfortable cotton t-shirt'
      },
      quantity: 1,
      type: 'custom'
    }
  ],
  livemode: false,
  locale: null,
  metadata: {},
  mode: 'payment',
  payment_intent: 'pi_test_123456',
  payment_method_types: ['card'],
  payment_status: 'unpaid',
  success_url: 'https://example.com/success',
  url: 'https://checkout.magpie.im/pay/cs_test_123456',
  created: 1640995200,
  expires_at: 1641081600
};

export const mockPaymentRequest = {
  id: 'pr_test_123456',
  object: 'payment_request',
  amount: 15000,
  currency: 'php',
  created: 1640995200,
  description: 'Payment request for invoice #1234',
  livemode: false,
  metadata: {},
  status: 'pending',
  customer: 'cus_test_123456',
  invoice: null,
  payment_method_types: ['card', 'gcash', 'paymaya'],
  expires_at: 1641081600,
  url: 'https://pr.magpie.im/pr_test_123456'
};

export const mockPaymentLink = {
  id: 'plink_test_123456',
  object: 'payment_link',
  active: true,
  after_completion: {
    type: 'redirect',
    redirect: {
      url: 'https://example.com/success'
    }
  },
  allow_promotion_codes: false,
  application_fee_amount: null,
  application_fee_percent: null,
  automatic_tax: {
    enabled: false
  },
  billing_address_collection: 'auto',
  created: 1640995200,
  currency: 'php',
  livemode: false,
  metadata: {},
  payment_method_types: ['card'],
  phone_number_collection: {
    enabled: false
  },
  shipping_address_collection: null,
  submit_type: null,
  subscription_data: null,
  tax_id_collection: {
    enabled: false
  },
  transfer_data: null,
  url: 'https://buy.magpie.im/test/plink_test_123456',
  line_items: {
    object: 'list',
    data: [
      {
        id: 'li_test_123456',
        object: 'item',
        amount_subtotal: 10000,
        amount_total: 10000,
        currency: 'php',
        description: 'Test product',
        price: {
          id: 'price_test_123456',
          object: 'price',
          active: true,
          currency: 'php',
          nickname: null,
          product: 'prod_test_123456',
          type: 'one_time',
          unit_amount: 10000
        },
        quantity: 1
      }
    ],
    has_more: false,
    total_count: 1,
    url: '/v1/payment_links/plink_test_123456/line_items'
  }
};

export const mockWebhookEvent = {
  id: 'evt_test_123456',
  object: 'event',
  api_version: '2024-06-20',
  created: 1640995200,
  data: {
    object: mockCharge,
    previous_attributes: {}
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: 'req_test_123456',
    idempotency_key: null
  },
  type: 'charge.succeeded'
};

export const mockListResponse = {
  object: 'list',
  data: [mockCustomer],
  has_more: false,
  total_count: 1,
  url: '/v1/customers'
};

export const mockErrorResponse = {
  error: {
    code: 'resource_missing',
    doc_url: 'https://docs.magpie.im/api#errors-resource_missing',
    message: 'No such customer: cus_nonexistent',
    param: 'id',
    type: 'invalid_request_error'
  }
};

export const mockValidationErrorResponse = {
  error: {
    code: 'parameter_invalid',
    doc_url: 'https://docs.magpie.im/api#errors-parameter_invalid',
    message: 'Invalid email address',
    param: 'email',
    type: 'invalid_request_error'
  }
};

export const mockAuthenticationErrorResponse = {
  error: {
    message: 'Invalid API Key provided: sk_test_invalid',
    type: 'invalid_request_error'
  }
};

export const mockRateLimitErrorResponse = {
  error: {
    message: 'Too many requests hit the API too quickly. Please retry your request later.',
    type: 'rate_limit_error'
  }
};