# Magpie Node.js Library

The official Magpie Node.js library for seamless integration with Magpie's payment processing APIs. Built with TypeScript and designed for modern Node.js applications.

[![npm version](https://badge.fury.io/js/%40magpieim%2Fmagpie-node.svg)](https://badge.fury.io/js/%40magpieim%2Fmagpie-node)
[![Version](https://img.shields.io/npm/v/@magpieim/magpie-node.svg)](https://www.npmjs.org/package/@magpieim/magpie-node)
[![Build Status](https://github.com/flairlabs/magpie-node/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/flairlabs/magpie-node/actions?query=branch%3Amain)
[![Downloads](https://img.shields.io/npm/dm/@magpieim/magpie-node.svg)](https://www.npmjs.com/package/@magpieim/magpie-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

Install the package using your preferred package manager:

```bash
npm install @magpieim/magpie-node
# or
yarn add @magpieim/magpie-node
# or
pnpm add @magpieim/magpie-node
```

## Requirements

- Node.js 18.0.0 or higher
- TypeScript 4.5+ (for TypeScript projects)

## Quick Start

Initialize the Magpie client with your secret key from the [Magpie Dashboard](https://dashboard.magpie.im/developers):

### JavaScript (CommonJS)

```javascript
const Magpie = require('@magpieim/magpie-node');
const magpie = new Magpie('sk_test_...');

// Create a customer
magpie.customers.create({
  name: 'John Doe',
  email: 'john@example.com',
})
  .then(customer => console.log('Customer created:', customer.id))
  .catch(error => console.error('Error:', error.message));
```

### TypeScript/ES Modules

```typescript
import Magpie from '@magpieim/magpie-node';

const magpie = new Magpie('sk_test_...');

// Create a customer with full type safety
const customer = await magpie.customers.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+63917123456',
  metadata: {
    source: 'website',
    campaign: 'summer-2024'
  }
});

console.log('Customer created:', customer.id);
```

## Core Features

### Process Payments

```typescript
// Create a charge
const charge = await magpie.charges.create({
  amount: 50000, // ₱500.00 in centavos
  currency: 'php',
  source: 'src_1234567890',
  description: 'Payment for Order #1234'
});
```

### Checkout Sessions

```typescript
// Create a hosted checkout page
const session = await magpie.checkout.sessions.create({
  line_items: [{
    name: 'T-shirt',
    amount: 2000,
    currency: 'php',
    quantity: 1
  }],
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel'
});
```

### Webhook Handling

```typescript
// Verify and handle webhooks
const event = magpie.webhooks.constructEvent(
  req.body, 
  req.headers['magpie-signature'], 
  webhookSecret
);

if (event.type === 'charge.succeeded') {
  console.log('Payment succeeded!', event.data.object);
}
```

## Configuration

```typescript
const magpie = new Magpie('sk_test_...', {
  timeout: 10000,
  maxNetworkRetries: 3,
  debug: true
});
```

## Error Handling

```typescript
try {
  const charge = await magpie.charges.create({...});
} catch (error) {
  if (error instanceof Magpie.AuthenticationError) {
    console.log('Invalid API key');
  } else if (error instanceof Magpie.ValidationError) {
    console.log('Invalid parameters:', error.errors);
  }
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
const customer: Magpie.Customer = await magpie.customers.create({
  name: 'John Doe',
  email: 'john@example.com'
});
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [https://docs.magpie.im](https://docs.magpie.im)
- Support: [support@magpie.im](mailto:support@magpie.im)
- Issues: [GitHub Issues](https://github.com/flairlabs/magpie-node/issues)
