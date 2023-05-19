export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { "string-ascii": { length: number } };
export type ClarityAbiTypeStringUtf8 = { "string-utf8": { length: number } };
export type ClarityAbiTypeResponse = {
  response: { ok: ClarityAbiType; error: ClarityAbiType };
};
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = {
  tuple: readonly { name: string; type: ClarityAbiType }[];
};
export type ClarityAbiTypeList = {
  list: { type: ClarityAbiType; length: number };
};

export type ClarityAbiTypeUInt128 = "uint128";
export type ClarityAbiTypeInt128 = "int128";
export type ClarityAbiTypeBool = "bool";
export type ClarityAbiTypePrincipal = "principal";
export type ClarityAbiTypeTraitReference = "trait_reference";
export type ClarityAbiTypeNone = "none";

export type ClarityAbiTypePrimitive =
  | ClarityAbiTypeUInt128
  | ClarityAbiTypeInt128
  | ClarityAbiTypeBool
  | ClarityAbiTypePrincipal
  | ClarityAbiTypeTraitReference
  | ClarityAbiTypeNone;

export type ClarityAbiType =
  | ClarityAbiTypePrimitive
  | ClarityAbiTypeBuffer
  | ClarityAbiTypeResponse
  | ClarityAbiTypeOptional
  | ClarityAbiTypeTuple
  | ClarityAbiTypeList
  | ClarityAbiTypeStringAscii
  | ClarityAbiTypeStringUtf8
  | ClarityAbiTypeTraitReference;

export interface ClarityAbiArg {
  name: string;
  type: ClarityAbiType;
}

export interface ClarityAbiFunction {
  name: string;
  access: "private" | "public" | "read_only";
  args: ClarityAbiArg[];
  outputs: {
    type: ClarityAbiType;
  };
}

export type TypedAbiArg<T, N extends string> = { _t?: T; name: N };

export type TypedAbiFunction<
  T extends TypedAbiArg<unknown, string>[],
  R
> = ClarityAbiFunction & {
  _t?: T;
  _r?: R;
};

export interface ClarityAbiVariable {
  name: string;
  access: "variable" | "constant";
  type: ClarityAbiType;
}

export type TypedAbiVariable<T> = ClarityAbiVariable & {
  defaultValue: T;
};

export interface ClarityAbiMap {
  name: string;
  key: ClarityAbiType;
  value: ClarityAbiType;
}

export type TypedAbiMap<K, V> = ClarityAbiMap & {
  _k?: K;
  _v?: V;
};

export interface ClarityAbiTypeFungibleToken {
  name: string;
}

export interface ClarityAbiTypeNonFungibleToken<T = unknown> {
  name: string;
  type: ClarityAbiType;
  _t?: T;
}

export interface ClarityAbi {
  functions: ClarityAbiFunction[];
  variables: ClarityAbiVariable[];
  maps: ClarityAbiMap[];
  fungible_tokens: ClarityAbiTypeFungibleToken[];
  non_fungible_tokens: readonly ClarityAbiTypeNonFungibleToken<unknown>[];
}

export type TypedAbi = Readonly<{
  functions: {
    [key: string]: TypedAbiFunction<TypedAbiArg<unknown, string>[], unknown>;
  };
  variables: {
    [key: string]: TypedAbiVariable<unknown>;
  };
  maps: {
    [key: string]: TypedAbiMap<unknown, unknown>;
  };
  constants: {
    [key: string]: unknown;
  };
  fungible_tokens: Readonly<ClarityAbiTypeFungibleToken[]>;
  non_fungible_tokens: Readonly<ClarityAbiTypeNonFungibleToken<unknown>[]>;
  contractName: string;
  contractFile?: string;
}>;

export interface ResponseOk<T, E> {
  value: T;
  isOk: true;
  _e?: E;
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
  _o?: T;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export type OkType<R> = R extends ResponseOk<infer V, unknown> ? V : never;
export type ErrType<R> = R extends ResponseErr<unknown, infer V> ? V : never;

export const contracts = {
  token: {
    functions: {
      mint: {
        name: "mint",
        access: "public",
        args: [],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      transfer: {
        name: "transfer",
        access: "public",
        args: [
          { name: "amount", type: "uint128" },
          { name: "sender", type: "principal" },
          { name: "recipient", type: "principal" },
          { name: "memo", type: { optional: { buffer: { length: 34 } } } },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, "amount">,
          sender: TypedAbiArg<string, "sender">,
          recipient: TypedAbiArg<string, "recipient">,
          memo: TypedAbiArg<Uint8Array | null, "memo">
        ],
        Response<boolean, bigint>
      >,
      getBalance: {
        name: "get-balance",
        access: "read_only",
        args: [{ name: "who", type: "principal" }],
        outputs: { type: { response: { ok: "uint128", error: "none" } } },
      } as TypedAbiFunction<
        [who: TypedAbiArg<string, "who">],
        Response<bigint, null>
      >,
      getDecimals: {
        name: "get-decimals",
        access: "read_only",
        args: [],
        outputs: { type: { response: { ok: "uint128", error: "none" } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
      getName: {
        name: "get-name",
        access: "read_only",
        args: [],
        outputs: {
          type: {
            response: { ok: { "string-ascii": { length: 4 } }, error: "none" },
          },
        },
      } as TypedAbiFunction<[], Response<string, null>>,
      getSymbol: {
        name: "get-symbol",
        access: "read_only",
        args: [],
        outputs: {
          type: {
            response: { ok: { "string-ascii": { length: 4 } }, error: "none" },
          },
        },
      } as TypedAbiFunction<[], Response<string, null>>,
      getTokenUri: {
        name: "get-token-uri",
        access: "read_only",
        args: [],
        outputs: {
          type: {
            response: {
              ok: { optional: { "string-utf8": { length: 256 } } },
              error: "none",
            },
          },
        },
      } as TypedAbiFunction<[], Response<string | null, null>>,
      getTotalSupply: {
        name: "get-total-supply",
        access: "read_only",
        args: [],
        outputs: { type: { response: { ok: "uint128", error: "none" } } },
      } as TypedAbiFunction<[], Response<bigint, null>>,
    },
    maps: {},
    variables: {
      contractOwner: {
        name: "contract-owner",
        type: "principal",
        access: "constant",
      } as TypedAbiVariable<string>,
      daoPrincipal: {
        name: "dao-principal",
        type: "principal",
        access: "constant",
      } as TypedAbiVariable<string>,
      daoSupply: {
        name: "dao-supply",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      distributionPrincipal: {
        name: "distribution-principal",
        type: "principal",
        access: "constant",
      } as TypedAbiVariable<string>,
      distributionSupply: {
        name: "distribution-supply",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      errMaxSupply: {
        name: "err-max-supply",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      errNotTokenOwner: {
        name: "err-not-token-owner",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      errOwnerOnly: {
        name: "err-owner-only",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      teamPrincipal: {
        name: "team-principal",
        type: "principal",
        access: "constant",
      } as TypedAbiVariable<string>,
      teamSupply: {
        name: "team-supply",
        type: "uint128",
        access: "constant",
      } as TypedAbiVariable<bigint>,
      tokenUri: {
        name: "token-uri",
        type: {
          optional: {
            "string-utf8": {
              length: 256,
            },
          },
        },
        access: "variable",
      } as TypedAbiVariable<string | null>,
    },
    constants: {
      contractOwner: "SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335",
      daoPrincipal: "SP58N7DXQ2NJBBJWDV77BVR0M96BXFGXNYVQ0V4P",
      daoSupply: 48000000n,
      distributionPrincipal: "SP2CB60BC6ZMA44DCD1A9W4NAV8HTEFZHD0XBNFA4",
      distributionSupply: 42000000n,
      errMaxSupply: {
        isOk: false,
        value: 102n,
      },
      errNotTokenOwner: {
        isOk: false,
        value: 101n,
      },
      errOwnerOnly: {
        isOk: false,
        value: 100n,
      },
      teamPrincipal: "SP1B6HQ59YNKEA5S8V3B6QB97VQMETMWV7WQGJCKE",
      teamSupply: 10000000n,
      tokenUri: "ipfs://QmegBfV56VVh5XjgwMi3CoshLoLHRuR5kGDJNNge368oWW",
    },
    non_fungible_tokens: [],
    fungible_tokens: [{ name: "mega" }],
    clarity_version: "Clarity1",
    contractName: "mega",
  },
  dao: {
    functions: {
      isSelfOrExtension: {
        name: "is-self-or-extension",
        access: "private",
        args: [],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      setExtensionsIter: {
        name: "set-extensions-iter",
        access: "private",
        args: [
          {
            name: "item",
            type: {
              tuple: [
                { name: "enabled", type: "bool" },
                { name: "extension", type: "principal" },
              ],
            },
          },
        ],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [
          item: TypedAbiArg<
            {
              enabled: boolean;
              extension: string;
            },
            "item"
          >
        ],
        boolean
      >,
      execute: {
        name: "execute",
        access: "public",
        args: [
          { name: "proposal", type: "trait_reference" },
          { name: "sender", type: "principal" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          proposal: TypedAbiArg<string, "proposal">,
          sender: TypedAbiArg<string, "sender">
        ],
        Response<boolean, bigint>
      >,
      init: {
        name: "init",
        access: "public",
        args: [{ name: "proposal", type: "trait_reference" }],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [proposal: TypedAbiArg<string, "proposal">],
        Response<boolean, bigint>
      >,
      requestExtensionCallback: {
        name: "request-extension-callback",
        access: "public",
        args: [
          { name: "extension", type: "trait_reference" },
          { name: "memo", type: { buffer: { length: 34 } } },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          extension: TypedAbiArg<string, "extension">,
          memo: TypedAbiArg<Uint8Array, "memo">
        ],
        Response<boolean, bigint>
      >,
      setExtension: {
        name: "set-extension",
        access: "public",
        args: [
          { name: "extension", type: "principal" },
          { name: "enabled", type: "bool" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          extension: TypedAbiArg<string, "extension">,
          enabled: TypedAbiArg<boolean, "enabled">
        ],
        Response<boolean, bigint>
      >,
      setExtensions: {
        name: "set-extensions",
        access: "public",
        args: [
          {
            name: "extensionList",
            type: {
              list: {
                type: {
                  tuple: [
                    { name: "enabled", type: "bool" },
                    { name: "extension", type: "principal" },
                  ],
                },
                length: 200,
              },
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: { list: { type: "bool", length: 200 } },
              error: "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          extensionList: TypedAbiArg<
            {
              enabled: boolean;
              extension: string;
            }[],
            "extensionList"
          >
        ],
        Response<boolean[], bigint>
      >,
      executedAt: {
        name: "executed-at",
        access: "read_only",
        args: [{ name: "proposal", type: "trait_reference" }],
        outputs: { type: { optional: "uint128" } },
      } as TypedAbiFunction<
        [proposal: TypedAbiArg<string, "proposal">],
        bigint | null
      >,
      isExtension: {
        name: "is-extension",
        access: "read_only",
        args: [{ name: "extension", type: "principal" }],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [extension: TypedAbiArg<string, "extension">],
        boolean
      >,
    },
    maps: {
      executedProposals: {
        name: "ExecutedProposals",
        key: "principal",
        value: "uint128",
      } as TypedAbiMap<string, bigint>,
      extensions: {
        name: "Extensions",
        key: "principal",
        value: "bool",
      } as TypedAbiMap<string, boolean>,
    },
    variables: {
      ERR_ALREADY_EXECUTED: {
        name: "ERR_ALREADY_EXECUTED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_EXTENSION: {
        name: "ERR_INVALID_EXTENSION",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED: {
        name: "ERR_UNAUTHORIZED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      executive: {
        name: "executive",
        type: "principal",
        access: "variable",
      } as TypedAbiVariable<string>,
    },
    constants: {
      ERR_ALREADY_EXECUTED: {
        isOk: false,
        value: 1001n,
      },
      ERR_INVALID_EXTENSION: {
        isOk: false,
        value: 1002n,
      },
      ERR_UNAUTHORIZED: {
        isOk: false,
        value: 1000n,
      },
      executive: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    },
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "mega-dao",
  },
  submission: {
    functions: {
      setParametersIter: {
        name: "set-parameters-iter",
        access: "private",
        args: [
          {
            name: "item",
            type: {
              tuple: [
                { name: "parameter", type: { "string-ascii": { length: 34 } } },
                { name: "value", type: "uint128" },
              ],
            },
          },
          {
            name: "previous",
            type: { response: { ok: "bool", error: "uint128" } },
          },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          item: TypedAbiArg<
            {
              parameter: string;
              value: number | bigint;
            },
            "item"
          >,
          previous: TypedAbiArg<Response<boolean, number | bigint>, "previous">
        ],
        Response<boolean, bigint>
      >,
      callback: {
        name: "callback",
        access: "public",
        args: [
          { name: "sender", type: "principal" },
          { name: "memo", type: { buffer: { length: 34 } } },
        ],
        outputs: { type: { response: { ok: "bool", error: "none" } } },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<string, "sender">,
          memo: TypedAbiArg<Uint8Array, "memo">
        ],
        Response<boolean, null>
      >,
      isDaoOrExtension: {
        name: "is-dao-or-extension",
        access: "public",
        args: [],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      propose: {
        name: "propose",
        access: "public",
        args: [
          { name: "proposal", type: "trait_reference" },
          { name: "startBlockHeight", type: "uint128" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          proposal: TypedAbiArg<string, "proposal">,
          startBlockHeight: TypedAbiArg<number | bigint, "startBlockHeight">
        ],
        Response<boolean, bigint>
      >,
      setParameter: {
        name: "set-parameter",
        access: "public",
        args: [
          { name: "parameter", type: { "string-ascii": { length: 34 } } },
          { name: "value", type: "uint128" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          parameter: TypedAbiArg<string, "parameter">,
          value: TypedAbiArg<number | bigint, "value">
        ],
        Response<boolean, bigint>
      >,
      setParameters: {
        name: "set-parameters",
        access: "public",
        args: [
          {
            name: "parameter-list",
            type: {
              list: {
                type: {
                  tuple: [
                    {
                      name: "parameter",
                      type: { "string-ascii": { length: 34 } },
                    },
                    { name: "value", type: "uint128" },
                  ],
                },
                length: 200,
              },
            },
          },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          parameterList: TypedAbiArg<
            {
              parameter: string;
              value: number | bigint;
            }[],
            "parameterList"
          >
        ],
        Response<boolean, bigint>
      >,
      canPropose: {
        name: "can-propose",
        access: "read_only",
        args: [
          { name: "who", type: "principal" },
          { name: "tokenThreshold", type: "uint128" },
        ],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [
          who: TypedAbiArg<string, "who">,
          tokenThreshold: TypedAbiArg<number | bigint, "tokenThreshold">
        ],
        boolean
      >,
      getMicroBalance: {
        name: "get-micro-balance",
        access: "read_only",
        args: [{ name: "amount", type: "uint128" }],
        outputs: { type: "uint128" },
      } as TypedAbiFunction<
        [amount: TypedAbiArg<number | bigint, "amount">],
        bigint
      >,
      getParameter: {
        name: "get-parameter",
        access: "read_only",
        args: [{ name: "parameter", type: { "string-ascii": { length: 34 } } }],
        outputs: { type: { response: { ok: "uint128", error: "uint128" } } },
      } as TypedAbiFunction<
        [parameter: TypedAbiArg<string, "parameter">],
        Response<bigint, bigint>
      >,
    },
    maps: {
      parameters: {
        name: "parameters",
        key: { "string-ascii": { length: 34 } },
        value: "uint128",
      } as TypedAbiMap<string, bigint>,
    },
    variables: {
      ERR_PROPOSAL_MAXIMUM_START_DELAY: {
        name: "ERR_PROPOSAL_MAXIMUM_START_DELAY",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_PROPOSAL_MINIMUM_START_DELAY: {
        name: "ERR_PROPOSAL_MINIMUM_START_DELAY",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED: {
        name: "ERR_UNAUTHORIZED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED_PROPOSER: {
        name: "ERR_UNAUTHORIZED_PROPOSER",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNKNOWN_PARAMETER: {
        name: "ERR_UNKNOWN_PARAMETER",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
    },
    constants: {
      ERR_PROPOSAL_MAXIMUM_START_DELAY: {
        isOk: false,
        value: 2604n,
      },
      ERR_PROPOSAL_MINIMUM_START_DELAY: {
        isOk: false,
        value: 2603n,
      },
      ERR_UNAUTHORIZED: {
        isOk: false,
        value: 2600n,
      },
      ERR_UNAUTHORIZED_PROPOSER: {
        isOk: false,
        value: 2601n,
      },
      ERR_UNKNOWN_PARAMETER: {
        isOk: false,
        value: 2602n,
      },
    },
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "mega-submission-v2",
  },
  vault: {
    functions: {
      setWhitelistIter: {
        name: "set-whitelist-iter",
        access: "private",
        args: [
          {
            name: "item",
            type: {
              tuple: [
                { name: "enabled", type: "bool" },
                { name: "token", type: "principal" },
              ],
            },
          },
        ],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [
          item: TypedAbiArg<
            {
              enabled: boolean;
              token: string;
            },
            "item"
          >
        ],
        boolean
      >,
      callback: {
        name: "callback",
        access: "public",
        args: [
          { name: "sender", type: "principal" },
          { name: "memo", type: { buffer: { length: 34 } } },
        ],
        outputs: { type: { response: { ok: "bool", error: "none" } } },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<string, "sender">,
          memo: TypedAbiArg<Uint8Array, "memo">
        ],
        Response<boolean, null>
      >,
      deposit: {
        name: "deposit",
        access: "public",
        args: [{ name: "amount", type: "uint128" }],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [amount: TypedAbiArg<number | bigint, "amount">],
        Response<boolean, bigint>
      >,
      depositFt: {
        name: "deposit-ft",
        access: "public",
        args: [
          { name: "ft", type: "trait_reference" },
          { name: "amount", type: "uint128" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          ft: TypedAbiArg<string, "ft">,
          amount: TypedAbiArg<number | bigint, "amount">
        ],
        Response<boolean, bigint>
      >,
      depositNft: {
        name: "deposit-nft",
        access: "public",
        args: [
          { name: "nft", type: "trait_reference" },
          { name: "id", type: "uint128" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          nft: TypedAbiArg<string, "nft">,
          id: TypedAbiArg<number | bigint, "id">
        ],
        Response<boolean, bigint>
      >,
      getBalanceOf: {
        name: "get-balance-of",
        access: "public",
        args: [{ name: "assetContract", type: "trait_reference" }],
        outputs: { type: { response: { ok: "uint128", error: "uint128" } } },
      } as TypedAbiFunction<
        [assetContract: TypedAbiArg<string, "assetContract">],
        Response<bigint, bigint>
      >,
      isDaoOrExtension: {
        name: "is-dao-or-extension",
        access: "public",
        args: [],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      setWhitelist: {
        name: "set-whitelist",
        access: "public",
        args: [
          { name: "token", type: "principal" },
          { name: "enabled", type: "bool" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          token: TypedAbiArg<string, "token">,
          enabled: TypedAbiArg<boolean, "enabled">
        ],
        Response<boolean, bigint>
      >,
      setWhitelists: {
        name: "set-whitelists",
        access: "public",
        args: [
          {
            name: "whitelist",
            type: {
              list: {
                type: {
                  tuple: [
                    { name: "enabled", type: "bool" },
                    { name: "token", type: "principal" },
                  ],
                },
                length: 100,
              },
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: { list: { type: "bool", length: 100 } },
              error: "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          whitelist: TypedAbiArg<
            {
              enabled: boolean;
              token: string;
            }[],
            "whitelist"
          >
        ],
        Response<boolean[], bigint>
      >,
      transfer: {
        name: "transfer",
        access: "public",
        args: [
          { name: "amount", type: "uint128" },
          { name: "recipient", type: "principal" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, "amount">,
          recipient: TypedAbiArg<string, "recipient">
        ],
        Response<boolean, bigint>
      >,
      transferFt: {
        name: "transfer-ft",
        access: "public",
        args: [
          { name: "ft", type: "trait_reference" },
          { name: "amount", type: "uint128" },
          { name: "recipient", type: "principal" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          ft: TypedAbiArg<string, "ft">,
          amount: TypedAbiArg<number | bigint, "amount">,
          recipient: TypedAbiArg<string, "recipient">
        ],
        Response<boolean, bigint>
      >,
      transferNft: {
        name: "transfer-nft",
        access: "public",
        args: [
          { name: "nft", type: "trait_reference" },
          { name: "id", type: "uint128" },
          { name: "recipient", type: "principal" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          nft: TypedAbiArg<string, "nft">,
          id: TypedAbiArg<number | bigint, "id">,
          recipient: TypedAbiArg<string, "recipient">
        ],
        Response<boolean, bigint>
      >,
      getBalance: {
        name: "get-balance",
        access: "read_only",
        args: [],
        outputs: { type: "uint128" },
      } as TypedAbiFunction<[], bigint>,
      getWhitelistedAsset: {
        name: "get-whitelisted-asset",
        access: "read_only",
        args: [{ name: "assetContract", type: "principal" }],
        outputs: { type: { optional: "bool" } },
      } as TypedAbiFunction<
        [assetContract: TypedAbiArg<string, "assetContract">],
        boolean | null
      >,
      isWhitelisted: {
        name: "is-whitelisted",
        access: "read_only",
        args: [{ name: "assetContract", type: "principal" }],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [assetContract: TypedAbiArg<string, "assetContract">],
        boolean
      >,
    },
    maps: {
      whitelistedAssets: {
        name: "WhitelistedAssets",
        key: "principal",
        value: "bool",
      } as TypedAbiMap<string, boolean>,
    },
    variables: {
      CONTRACT_ADDRESS: {
        name: "CONTRACT_ADDRESS",
        type: "principal",
        access: "constant",
      } as TypedAbiVariable<string>,
      ERR_ASSET_NOT_WHITELISTED: {
        name: "ERR_ASSET_NOT_WHITELISTED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_FAILED_TO_TRANSFER_FT: {
        name: "ERR_FAILED_TO_TRANSFER_FT",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_FAILED_TO_TRANSFER_NFT: {
        name: "ERR_FAILED_TO_TRANSFER_NFT",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_FAILED_TO_TRANSFER_STX: {
        name: "ERR_FAILED_TO_TRANSFER_STX",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED: {
        name: "ERR_UNAUTHORIZED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
    },
    constants: {
      CONTRACT_ADDRESS:
        "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.megaVault-vars",
      ERR_ASSET_NOT_WHITELISTED: {
        isOk: false,
        value: 3201n,
      },
      ERR_FAILED_TO_TRANSFER_FT: {
        isOk: false,
        value: 3203n,
      },
      ERR_FAILED_TO_TRANSFER_NFT: {
        isOk: false,
        value: 3204n,
      },
      ERR_FAILED_TO_TRANSFER_STX: {
        isOk: false,
        value: 3202n,
      },
      ERR_UNAUTHORIZED: {
        isOk: false,
        value: 3200n,
      },
    },
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "mega-vault",
  },
  voting: {
    functions: {
      voteMap: {
        name: "vote-map",
        access: "private",
        args: [
          {
            name: "delegator",
            type: {
              tuple: [
                { name: "delegator", type: { optional: "principal" } },
                { name: "for", type: "bool" },
                { name: "proposal", type: "principal" },
              ],
            },
          },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          delegator: TypedAbiArg<
            {
              delegator: string | null;
              for: boolean;
              proposal: string;
            },
            "delegator"
          >
        ],
        Response<boolean, bigint>
      >,
      addProposal: {
        name: "add-proposal",
        access: "public",
        args: [
          { name: "proposal", type: "trait_reference" },
          {
            name: "data",
            type: {
              tuple: [
                { name: "endBlockHeight", type: "uint128" },
                { name: "proposer", type: "principal" },
                { name: "startBlockHeight", type: "uint128" },
              ],
            },
          },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          proposal: TypedAbiArg<string, "proposal">,
          data: TypedAbiArg<
            {
              endBlockHeight: number | bigint;
              proposer: string;
              startBlockHeight: number | bigint;
            },
            "data"
          >
        ],
        Response<boolean, bigint>
      >,
      callback: {
        name: "callback",
        access: "public",
        args: [
          { name: "sender", type: "principal" },
          { name: "memo", type: { buffer: { length: 34 } } },
        ],
        outputs: { type: { response: { ok: "bool", error: "none" } } },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<string, "sender">,
          memo: TypedAbiArg<Uint8Array, "memo">
        ],
        Response<boolean, null>
      >,
      conclude: {
        name: "conclude",
        access: "public",
        args: [{ name: "proposal", type: "trait_reference" }],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [proposal: TypedAbiArg<string, "proposal">],
        Response<boolean, bigint>
      >,
      delegate: {
        name: "delegate",
        access: "public",
        args: [{ name: "who", type: "principal" }],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [who: TypedAbiArg<string, "who">],
        Response<boolean, bigint>
      >,
      isDaoOrExtension: {
        name: "is-dao-or-extension",
        access: "public",
        args: [],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      revokeDelegate: {
        name: "revoke-delegate",
        access: "public",
        args: [{ name: "who", type: "principal" }],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [who: TypedAbiArg<string, "who">],
        Response<boolean, bigint>
      >,
      setParameter: {
        name: "set-parameter",
        access: "public",
        args: [
          { name: "parameter", type: { "string-ascii": { length: 34 } } },
          { name: "value", type: "uint128" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          parameter: TypedAbiArg<string, "parameter">,
          value: TypedAbiArg<number | bigint, "value">
        ],
        Response<boolean, bigint>
      >,
      vote: {
        name: "vote",
        access: "public",
        args: [
          { name: "for", type: "bool" },
          { name: "proposal", type: "principal" },
          { name: "delegator", type: { optional: "principal" } },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          _for: TypedAbiArg<boolean, "_for">,
          proposal: TypedAbiArg<string, "proposal">,
          delegator: TypedAbiArg<string | null, "delegator">
        ],
        Response<boolean, bigint>
      >,
      voteMany: {
        name: "vote-many",
        access: "public",
        args: [
          {
            name: "votes",
            type: {
              list: {
                type: {
                  tuple: [
                    { name: "delegator", type: { optional: "principal" } },
                    { name: "for", type: "bool" },
                    { name: "proposal", type: "principal" },
                  ],
                },
                length: 100,
              },
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: {
                list: {
                  type: { response: { ok: "bool", error: "uint128" } },
                  length: 100,
                },
              },
              error: "none",
            },
          },
        },
      } as TypedAbiFunction<
        [
          votes: TypedAbiArg<
            {
              delegator: string | null;
              for: boolean;
              proposal: string;
            }[],
            "votes"
          >
        ],
        Response<Response<boolean, bigint>[], null>
      >,
      canVote: {
        name: "can-vote",
        access: "read_only",
        args: [
          { name: "voter", type: "principal" },
          { name: "blockHeight", type: "uint128" },
          { name: "tokenThreshold", type: "uint128" },
        ],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [
          voter: TypedAbiArg<string, "voter">,
          blockHeight: TypedAbiArg<number | bigint, "blockHeight">,
          tokenThreshold: TypedAbiArg<number | bigint, "tokenThreshold">
        ],
        boolean
      >,
      canVoteOnBehalf: {
        name: "can-vote-on-behalf",
        access: "read_only",
        args: [
          { name: "sender", type: "principal" },
          { name: "delegator", type: { optional: "principal" } },
        ],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<string, "sender">,
          delegator: TypedAbiArg<string | null, "delegator">
        ],
        boolean
      >,
      getCurrentTotalVotes: {
        name: "get-current-total-votes",
        access: "read_only",
        args: [
          { name: "proposal", type: "principal" },
          { name: "voter", type: "principal" },
        ],
        outputs: { type: "uint128" },
      } as TypedAbiFunction<
        [
          proposal: TypedAbiArg<string, "proposal">,
          voter: TypedAbiArg<string, "voter">
        ],
        bigint
      >,
      getDelegate: {
        name: "get-delegate",
        access: "read_only",
        args: [{ name: "who", type: "principal" }],
        outputs: {
          type: { response: { ok: { optional: "principal" }, error: "none" } },
        },
      } as TypedAbiFunction<
        [who: TypedAbiArg<string, "who">],
        Response<string | null, null>
      >,
      getMicroBalance: {
        name: "get-micro-balance",
        access: "read_only",
        args: [{ name: "amount", type: "uint128" }],
        outputs: { type: "uint128" },
      } as TypedAbiFunction<
        [amount: TypedAbiArg<number | bigint, "amount">],
        bigint
      >,
      getParameter: {
        name: "get-parameter",
        access: "read_only",
        args: [{ name: "parameter", type: { "string-ascii": { length: 34 } } }],
        outputs: { type: { response: { ok: "uint128", error: "uint128" } } },
      } as TypedAbiFunction<
        [parameter: TypedAbiArg<string, "parameter">],
        Response<bigint, bigint>
      >,
      getProposalData: {
        name: "get-proposal-data",
        access: "read_only",
        args: [{ name: "proposal", type: "principal" }],
        outputs: {
          type: {
            optional: {
              tuple: [
                { name: "concluded", type: "bool" },
                { name: "endBlockHeight", type: "uint128" },
                { name: "passed", type: "bool" },
                { name: "proposer", type: "principal" },
                { name: "startBlockHeight", type: "uint128" },
                { name: "votesAgainst", type: "uint128" },
                { name: "votesFor", type: "uint128" },
              ],
            },
          },
        },
      } as TypedAbiFunction<
        [proposal: TypedAbiArg<string, "proposal">],
        {
          concluded: boolean;
          endBlockHeight: bigint;
          passed: boolean;
          proposer: string;
          startBlockHeight: bigint;
          votesAgainst: bigint;
          votesFor: bigint;
        } | null
      >,
      getVotingPower: {
        name: "get-voting-power",
        access: "read_only",
        args: [
          { name: "voter", type: "principal" },
          { name: "blockHeight", type: "uint128" },
        ],
        outputs: { type: { optional: "uint128" } },
      } as TypedAbiFunction<
        [
          voter: TypedAbiArg<string, "voter">,
          blockHeight: TypedAbiArg<number | bigint, "blockHeight">
        ],
        bigint | null
      >,
      isDelegating: {
        name: "is-delegating",
        access: "read_only",
        args: [{ name: "who", type: "principal" }],
        outputs: { type: "bool" },
      } as TypedAbiFunction<[who: TypedAbiArg<string, "who">], boolean>,
    },
    maps: {
      delegates: {
        name: "Delegates",
        key: "principal",
        value: "principal",
      } as TypedAbiMap<string, string>,
      delegators: {
        name: "Delegators",
        key: "principal",
        value: "bool",
      } as TypedAbiMap<string, boolean>,
      memberTotalVotes: {
        name: "MemberTotalVotes",
        key: {
          tuple: [
            { name: "governanceToken", type: "principal" },
            { name: "proposal", type: "principal" },
            { name: "voter", type: "principal" },
          ],
        },
        value: "uint128",
      } as TypedAbiMap<
        {
          governanceToken: string;
          proposal: string;
          voter: string;
        },
        bigint
      >,
      proposals: {
        name: "Proposals",
        key: "principal",
        value: {
          tuple: [
            { name: "concluded", type: "bool" },
            { name: "endBlockHeight", type: "uint128" },
            { name: "passed", type: "bool" },
            { name: "proposer", type: "principal" },
            { name: "startBlockHeight", type: "uint128" },
            { name: "votesAgainst", type: "uint128" },
            { name: "votesFor", type: "uint128" },
          ],
        },
      } as TypedAbiMap<
        string,
        {
          concluded: boolean;
          endBlockHeight: bigint;
          passed: boolean;
          proposer: string;
          startBlockHeight: bigint;
          votesAgainst: bigint;
          votesFor: bigint;
        }
      >,
      parameters: {
        name: "parameters",
        key: { "string-ascii": { length: 34 } },
        value: "uint128",
      } as TypedAbiMap<string, bigint>,
    },
    variables: {
      ERR_ALREADY_VOTED: {
        name: "ERR_ALREADY_VOTED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_DELEGATE_NOT_FOUND: {
        name: "ERR_DELEGATE_NOT_FOUND",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_END_BLOCK_HEIGHT_NOT_REACHED: {
        name: "ERR_END_BLOCK_HEIGHT_NOT_REACHED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_INVALID_DELEGATION: {
        name: "ERR_INVALID_DELEGATION",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_PROPOSAL_ALREADY_CONCLUDED: {
        name: "ERR_PROPOSAL_ALREADY_CONCLUDED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_PROPOSAL_ALREADY_EXECUTED: {
        name: "ERR_PROPOSAL_ALREADY_EXECUTED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_PROPOSAL_ALREADY_EXISTS: {
        name: "ERR_PROPOSAL_ALREADY_EXISTS",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_PROPOSAL_INACTIVE: {
        name: "ERR_PROPOSAL_INACTIVE",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED: {
        name: "ERR_UNAUTHORIZED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED_DELEGATE: {
        name: "ERR_UNAUTHORIZED_DELEGATE",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNAUTHORIZED_VOTER: {
        name: "ERR_UNAUTHORIZED_VOTER",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNKNOWN_PARAMETER: {
        name: "ERR_UNKNOWN_PARAMETER",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNKNOWN_PROPOSAL: {
        name: "ERR_UNKNOWN_PROPOSAL",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
    },
    constants: {
      ERR_ALREADY_VOTED: {
        isOk: false,
        value: 2508n,
      },
      ERR_DELEGATE_NOT_FOUND: {
        isOk: false,
        value: 2511n,
      },
      ERR_END_BLOCK_HEIGHT_NOT_REACHED: {
        isOk: false,
        value: 2506n,
      },
      ERR_INVALID_DELEGATION: {
        isOk: false,
        value: 2510n,
      },
      ERR_PROPOSAL_ALREADY_CONCLUDED: {
        isOk: false,
        value: 2504n,
      },
      ERR_PROPOSAL_ALREADY_EXECUTED: {
        isOk: false,
        value: 2501n,
      },
      ERR_PROPOSAL_ALREADY_EXISTS: {
        isOk: false,
        value: 2502n,
      },
      ERR_PROPOSAL_INACTIVE: {
        isOk: false,
        value: 2505n,
      },
      ERR_UNAUTHORIZED: {
        isOk: false,
        value: 2500n,
      },
      ERR_UNAUTHORIZED_DELEGATE: {
        isOk: false,
        value: 2512n,
      },
      ERR_UNAUTHORIZED_VOTER: {
        isOk: false,
        value: 2507n,
      },
      ERR_UNKNOWN_PARAMETER: {
        isOk: false,
        value: 2509n,
      },
      ERR_UNKNOWN_PROPOSAL: {
        isOk: false,
        value: 2503n,
      },
    },
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "mega-voting-v2",
  },
} as const;

export const project = {
  contracts,
} as const;
