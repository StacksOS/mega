## Mega DAO Packages

The `@mega-dao/client` package provides a TypeScript client for interacting with the Mega DAO smart contracts on the Stacks blockchain. Here's an example of how to import and initialize the `MegaClient` class:

```typescript
import { MegaClient } from "@mega-dao/client";
const client = new MegaClient();
```

Once you have a ﻿MegaClient instance, you can use it to interact with the Mega DAO smart contracts. Here’s an example of how to use the ﻿transfer method to transfer STX tokens from one address to another:

```typescript
const transfer = await client.transfer(
  42,
  "ST143YHR805B8S834BWJTMZVFR1WP5FFC00V8QTV4",
  "ST248NZ0P20BH3M3ZTM9DS69EMC9G6H3MNR0WS2X"
);
```

In this example, we’re transferring ﻿42 STX tokens from the address ﻿"ST143YHR805B8S834BWJTMZVFR1WP5FFC00V8QTV4" to the address ﻿"ST248NZ0P20BH3M3ZTM9DS69EMC9G6H3MNR0WS2X". Note that the ﻿transfer method is an async function, so we’re using the ﻿await keyword to wait for the transfer to complete before moving on to the next line of code.
