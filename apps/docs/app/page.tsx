"use client";

import { createFungiblePostCondition } from "@mega-dao/core";
import { MegaClient } from "@mega-dao/client";
import { useOpenContractCall } from "@micro-stacks/react";
const client = new MegaClient();

export default function Page() {
  const { openContractCall } = useOpenContractCall();
  const postConditions = createFungiblePostCondition(
    "SP143YHR805B8S834BWJTMZVFR1WP5FFC03WZE4BF",
    1
  );
  const sendTokens = async () => {
    const transfer = await client.transfer(
      5,
      "SP143YHR805B8S834BWJTMZVFR1WP5FFC03WZE4BF",
      "SP20KK070RWJD7DJ8C8JVH1RKDMPVGP038MVVZVGW"
    );
    await openContractCall({
      ...transfer,
      postConditions,
      onCancel: () => console.log("cancelled"),
    });
  };
  return (
    <>
      <button onClick={sendTokens}>Send MEGA</button>
    </>
  );
}
