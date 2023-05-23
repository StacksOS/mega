## Mega DAO | Core

#### `contracts`

Contract types for the Mega protocol.

#### `createFungiblePostCondition`

Create a fungible post condition for asset transferring.

```typescript
import { createFungiblePostCondition } from "@mega-dao/core";

const postConditions = createFungiblePostCondition(
  "ST143YHR805B8S834BWJTMZVFR1WP5FFC00V8QTV4",
  42
);
```
