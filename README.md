# Magpie Node.js Library

This is the official Magpie Node.js library that we recommend for integrating with Magpie APIs.

[![npm version](https://badge.fury.io/js/%40magpieim%2Fmagpie-node.svg)](https://badge.fury.io/js/%40magpieim%2Fmagpie-node)
[![Version](https://img.shields.io/npm/v/@magpieim/magpie-node.svg)](https://www.npmjs.org/package/@magpieim/magpie-node)
[![Build Status](https://github.com/flairlabs/magpie-node/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/flairlabs/magpie-node/actions?query=branch%3Amaster)
[![Downloads](https://img.shields.io/npm/dm/@magpieim/magpie-node.svg)](https://www.npmjs.com/package/@magpieim/magpie-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

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

## Usage

The package needs to be configured with your account's secret key, which is available in the [Magpie Dashboard](https://dashboard.magpie.im/developers). Require it with the key's value:

```javascript
const magpie = require('@magpieim/magpie-node')('sk_test_...');

magpie.customers.create({
  email: 'customer@example.com',
})
  .then(customer => console.log(customer.id))
  .catch(error => console.error(error));
```

```typescript
import Magpie from '@magpieim/magpie-node';

const magpie = new Magpie('sk_test_...');
const customer = await magpie.customers.create({
  email: 'customer@example.com',
});
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [https://docs.magpie.im](https://docs.magpie.im)
- Support: [support@magpie.im](mailto:support@magpie.im)
- Issues: [GitHub Issues](https://github.com/flairlabs/magpie-node/issues)
