## Mega DAO | Client

The `@mega-dao/client` package provides a TypeScript client for interacting with the Mega DAO smart contracts on the Stacks blockchain. Here's an example of how to import and initialize the `MegaClient` class:

```typescript
import { MegaClient } from "@mega-dao/client";

const client = new MegaClient();
```

Once you have a ﻿MegaClient instance, you can use it to interact with the Mega DAO smart contracts.

```typescript
const transfer = await client.transfer(
  42,
  "ST143YHR805B8S834BWJTMZVFR1WP5FFC00V8QTV4",
  "ST248NZ0P20BH3M3ZTM9DS69EMC9G6H3MNR0WS2X"
);
```

Here's how to use it with `@micro-stacks/react`:

```typescript
export default function App() {
  const { openContractCall } = useOpenContractCall();

  const sendTokens = async () => {
    const transfer = await client.transfer(
      42,
      "ST143YHR805B8S834BWJTMZVFR1WP5FFC00V8QTV4",
      "ST248NZ0P20BH3M3ZTM9DS69EMC9G6H3MNR0WS2X"
    );
    await openContractCall({
      ...transfer,
    });
  };

  return <button onClick={sendTokens}>Send MEGA</button>;
}
```

And with Post Conditions:

```typescript
import { createFungiblePostCondition } from "@mega-dao/core";

export default function App() {
  const { openContractCall } = useOpenContractCall();

  const postConditions = createFungiblePostCondition(
    "ST143YHR805B8S834BWJTMZVFR1WP5FFC00V8QTV4",
    42
  );

  const sendTokens = async () => {
    const transfer = await client.transfer(
      42,
      "ST143YHR805B8S834BWJTMZVFR1WP5FFC00V8QTV4",
      "ST248NZ0P20BH3M3ZTM9DS69EMC9G6H3MNR0WS2X"
    );
    await openContractCall({
      ...transfer,
      postConditions,
    });
  };

  return <button onClick={sendTokens}>Send MEGA</button>;
}
```
