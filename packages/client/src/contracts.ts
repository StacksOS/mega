import type {
  ContractFactory,
  DeploymentNetwork,
  Response,
} from "@clarigen/core";
import { ClarigenClient, contractFactory } from "@clarigen/core";
import {
  contracts,
  createErrorWithStackTrace,
  DEFAULT_MAINNET_API_URL,
  DEFAULT_TESTNET_API_URL,
  DEPLOYER,
  TOKEN_IDENTIFIER,
} from "@mega-dao/core";

export type MegaContracts = ContractFactory<any>;

export class MegaClient {
  readonly client: ClarigenClient;
  readonly network: DeploymentNetwork;
  readonly apiUrl: string;
  readonly contracts: MegaContracts;

  constructor(
    network: DeploymentNetwork = "mainnet",
    config: { apiUrl?: string } = {}
  ) {
    this.network = network;
    this.apiUrl = config.apiUrl || this.getDefaultApiUrl;
    this.client = new ClarigenClient(this.apiUrl);
    this.contracts = contracts;
  }

  get isMainnet() {
    return this.network === "mainnet";
  }

  get getDefaultApiUrl() {
    switch (this.network) {
      case "mainnet":
        return DEFAULT_MAINNET_API_URL;
      case "testnet":
        return DEFAULT_TESTNET_API_URL;
      default:
        throw new Error(`Unknown network: ${this.network}`);
    }
  }

  get dao() {
    return contractFactory(
      this.contracts.dao,
      `${DEPLOYER}.${this.contracts.dao.contractName}`
    );
  }

  get token() {
    return contractFactory(
      this.contracts.token,
      `${TOKEN_IDENTIFIER}.${this.contracts.token.contractName}`
    );
  }

  get vault() {
    return contractFactory(
      this.contracts.vault,
      `${DEPLOYER}.${this.contracts.vault.contractName}`
    );
  }

  get submission() {
    return contractFactory(
      this.contracts.submission,
      `${DEPLOYER}.${this.contracts.submission.contractName}`
    );
  }

  get voting() {
    return contractFactory(
      this.contracts.voting,
      `${DEPLOYER}.${this.contracts.voting.contractName}`
    );
  }

  /**
   * Checks if the specified extension is registered with the DAO.
   * @async
   * @param {string} extension - The extension to check.
   * @returns {Promise<object>} A Promise that resolves to an object containing the result of the check.
   * @throws {Error} If there was an error checking the extension, or if the provided address is not valid.
   */
  async isExtension(extension: string) {
    try {
      const isExtension = await this.client.ro(this.dao.isExtension(extension));
      return isExtension;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the block height at which the specified extension was executed.
   * @async
   * @param {string} extension - The extension to check.
   * @returns {Promise<object>} A Promise that resolves to an object containing the block height at which the extension was executed.
   * @throws {Error} If there was an error getting the block height, or if the provided address is not valid.
   */
  async executedAt(extension: string) {
    try {
      const block = await this.client.ro(this.dao.executedAt(extension));
      return block;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the balance of MEGA for the specified Stacks address.
   * @async
   * @param {string} who - The Stacks address to get the balance for.
   * @returns {Promise<bigint>} A Promise that resolves to the balance of the address.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getTokenBalance(who: string) {
    try {
      const balance: Response<boolean, bigint> = await this.client.ro(
        this.token.getBalance(who)
      );
      if (balance.isOk) {
        return balance.value;
      }
      throw new Error(`Unexpected error: ${balance.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the number of decimal places used by the token.
   * @async
   * @returns {Promise<bigint>} A Promise that resolves to the number of decimal places.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getDecimals() {
    try {
      const decimals: Response<boolean, bigint> = await this.client.ro(
        this.token.getDecimals()
      );
      if (decimals.isOk) {
        return decimals.value;
      }
      throw new Error(`Unexpected error: ${decimals.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the name of the token.
   * @async
   * @returns {Promise<string>} A Promise that resolves to the name of the token.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getName() {
    try {
      const name: Response<boolean, bigint> = await this.client.ro(
        this.token.getName()
      );
      if (name.isOk) {
        return name.value;
      }
      throw new Error(`Unexpected error: ${name.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the symbol of the token.
   * @async
   * @returns {Promise<bigint>} A Promise that resolves to the symbol of the token.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getSymbol() {
    try {
      const symbol: Response<boolean, bigint> = await this.client.ro(
        this.token.getSymbol()
      );
      if (symbol.isOk) {
        return symbol.value;
      }
      throw new Error(`Unexpected error: ${symbol.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the URI of the token.
   * @async
   * @returns {Promise<bigint>} A Promise that resolves to the URI of the token.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getTokenUri() {
    try {
      const tokenUri: Response<boolean, bigint> = await this.client.ro(
        this.token.getTokenUri()
      );
      if (tokenUri.isOk) {
        return tokenUri.value;
      }
      throw new Error(`Unexpected error: ${tokenUri.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the total supply of the token.
   * @async
   * @returns {Promise<bigint>} A Promise that resolves to the total supply of the token.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getTotalSupply() {
    try {
      const totalSupply: Response<boolean, bigint> = await this.client.ro(
        this.token.getTotalSupply()
      );
      if (totalSupply.isOk) {
        return totalSupply.value;
      }
      throw new Error(`Unexpected error: ${totalSupply.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
    •	Get the total STX balance of the vault.
    * @async
    •	@returns {Promise} A promise that resolves to the balance of the vault as a bigint.
    •	@throws {Error} If an error occurs while retrieving the balance.
    •	@throws {Error} If the provided Stacks address is invalid.
  */
  async getVaultBalance() {
    try {
      const balance: bigint = await this.client.ro(this.vault.getBalance());
      return balance;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the balance of a specified token in the DAO vault.
   * @async
   * @param {string} [assetContract="SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.mega"] - The asset contract of the token to get the balance of.
   * @returns {Promise<bigint>} A Promise that resolves to the balance of the specified token.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getBalanceOfToken(
    assetContract = "SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.mega"
  ) {
    try {
      const balance: Response<boolean, bigint> = await this.client.ro(
        this.vault.getBalanceOf(assetContract)
      );
      if (balance.isOk) {
        return balance.value;
      }
      throw new Error(`Unexpected error: ${balance.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Checks if a token or NFT is whitelisted.
   * @async
   * @param {string} assetContract - The asset contract of the asset to check.
   * @returns {Promise<boolean>} A Promise that resolves to true if the asset is whitelisted, false otherwise.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async isAssetWhitlisted(assetContract: string) {
    try {
      const asset: Response<boolean, bigint> = await this.client.ro(
        this.vault.isWhitelisted(assetContract)
      );
      return asset;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the threshold required for submitting proposals.
   * @async
   * @returns {Promise<bigint>} A Promise that resolves to the proposal threshold for proposals.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getTokenThreshold() {
    try {
      const getParameter: Response<boolean, bigint> = await this.client.ro(
        this.submission.getParameter("proposeThreshold")
      );
      if (getParameter.isOk) {
        return getParameter.value;
      }
      throw new Error(`Unexpected error: ${getParameter.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the default duration of proposals in blocks.
   * @async
   * @returns {Promise<bigint>} A Promise that resolves to the duration of proposals in blocks.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getProposalDuration() {
    try {
      const getParameter: Response<boolean, bigint> = await this.client.ro(
        this.submission.getParameter("proposalDuration")
      );
      if (getParameter.isOk) {
        return getParameter.value;
      }
      throw new Error(`Unexpected error: ${getParameter.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the minimum start delay for proposals in blocks.
   * @async
   * @returns {Promise<bigint>} A Promise that resolves to the minimum start delay for proposals in blocks.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getMinimumStartDelay() {
    try {
      const getParameter: Response<boolean, bigint> = await this.client.ro(
        this.submission.getParameter("minimumProposalStartDelay")
      );
      if (getParameter.isOk) {
        return getParameter.value;
      }
      throw new Error(`Unexpected error: ${getParameter.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the maximum start delay for proposals in blocks.
   * @async
   * @returns {Promise<bigint>} A Promise that resolves to the maximum start delay for proposals in blocks.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async getMaximumStartDelay() {
    try {
      const getParameter: Response<boolean, bigint> = await this.client.ro(
        this.submission.getParameter("maximumProposalStartDelay")
      );
      if (getParameter.isOk) {
        return getParameter.value;
      }
      throw new Error(`Unexpected error: ${getParameter.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Checks if the specified address can submit a proposal.
   * @async
   * @param {string} who - The address to check.
   * @returns {Promise<boolean>} A Promise that resolves to true if the address can propose, false otherwise.
   * @throws {Error} Throws an error if an unexpected error occurs.
   * @throws {Error} Throws an error if the provided address is not valid.
   */
  async canPropose(who: string) {
    try {
      const balance: Response<boolean, bigint> = await this.client.ro(
        this.token.getBalance(who)
      );
      if (balance.isOk) {
        const canPropose: boolean = await this.client.ro(
          this.submission.canPropose(who, balance.value)
        );
        return canPropose;
      }
      throw new Error(`Unexpected error: ${balance.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Initializes a DAO contract with the specified proposal.
   * @async
   * @param {string} proposal - The proposal to use for initialization.
   * @returns {Promise<object>} A Promise that resolves to an object containing the DAO contract properties.
   * @throws {Error} If there was an error initializing the DAO contract.
   */
  async init(proposal: string) {
    const {
      nativeArgs,
      function: fn,
      ...payload
    } = this.contracts.dao.construct(proposal);

    return payload;
  }

  /**
   * Transfers an amount of tokens from the sender to the recipient.
   * @async
   * @param {number} amount - The amount of tokens to transfer.
   * @param {string} sender - The address of the sender.
   * @param {string} recipient - The address of the recipient.
   * @param {string} [memo] - An optional memo to include with the transfer.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing the payload of the transfer transaction.
   */
  async transfer(
    amount: number,
    sender: string,
    recipient: string,
    memo?: string
  ) {
    const decimals = await this.getDecimals();
    const amountWithDecimals = amount * 10 ** Number(decimals);
    const {
      nativeArgs,
      function: fn,
      ...payload
    } = this.token.transfer(amountWithDecimals, sender, recipient, memo);

    return payload;
  }

  /**
   * Deposits an amount of STX into the vault.
   * @async
   * @param {number} amount - The amount of STX to deposit.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing the payload of the deposit transaction.
   */
  async deposit(amount: number) {
    const { nativeArgs, function: fn, ...payload } = this.vault.deposit(amount);

    return payload;
  }

  /**
   * Deposits an amount of a SIP-10 token into the vault.
   * @async
   * @param {number} amount - The amount of SIP-10 tokens to deposit.
   * @param {string} [assetContract="SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.mega"] - The address of the asset contract to deposit the tokens from, defaults to Mega.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing the payload of the deposit transaction.
   */
  async depositToken(
    amount: number,
    assetContract = "SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.mega"
  ) {
    const {
      nativeArgs,
      function: fn,
      ...payload
    } = this.vault.depositFt(assetContract, amount);

    return payload;
  }

  /**
   * Deposits a SIP-9 NFT into the vault.
   * @async
   * @param {number} tokenId - The ID of the NFT to deposit.
   * @param {string} assetContract - The address of the asset contract that the NFT belongs to.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing the payload of the deposit transaction.
   */
  async depositNft(tokenId: number, assetContract: string) {
    const {
      nativeArgs,
      function: fn,
      ...payload
    } = this.vault.depositNft(assetContract, tokenId);

    return payload;
  }

  /**
   * Submit a new proposal for submission.
   * @async
   * @param {string} proposal - The proposal to submit.
   * @param {number} startBlockHeight - The block height at which the proposal should start.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing the payload of the proposal transaction.
   */
  async propose(proposal: string, startBlockHeight: number) {
    const {
      nativeArgs,
      function: fn,
      ...payload
    } = this.submission.propose(proposal, startBlockHeight);

    return payload;
  }

  /**
   * Votes for or against a proposal.
   * @async
   * @param {boolean} isFor - Whether to vote for or against the proposal.
   * @param {string} proposal - The ID of the proposal to vote on.
   * @param {string} [delegate] - An optional address to delegate the vote to.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing the payload of the vote transaction.
   */
  async vote(isFor: boolean, proposal: string, delegate?: string) {
    const {
      nativeArgs,
      function: fn,
      ...payload
    } = this.voting.vote(isFor, proposal, delegate);

    return payload;
  }

  /**
   * Send many votes for or against a proposal.
   * @async
   * @param {Object[]} votes - An array of objects representing the votes to cast.
   * @param {boolean} votes[].for - Whether to vote for or against the proposal.
   * @param {string} votes[].proposal - The ID of the proposal to vote on.
   * @param {string} [votes[].delegator] - An optional address to delegate the vote to.
   * @throws {Error} - Throws an error if the length of the `votes` array is greater than 100.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing the payload of the vote transaction.
   */
  async voteMany(
    votes: {
      for: boolean;
      proposal: string;
      delegator?: string | null | undefined;
    }[]
  ) {
    if (votes.length > 100) {
      throw createErrorWithStackTrace(
        "Invalid votes: the provided array is too long",
        Error
      );
    }
    const {
      nativeArgs,
      function: fn,
      ...payload
    } = this.voting.voteMany(votes);

    return payload;
  }

  /**
   * Delegates voting power to another address.
   * @async
   * @param {string} delegatee - The address to delegate voting power to.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing the payload of the delegate transaction.
   */
  async delegate(delegatee: string) {
    const {
      nativeArgs,
      function: fn,
      ...payload
    } = this.voting.delegate(delegatee);

    return payload;
  }

  /**
   * Revokes a previously delegated voting power.
   * @async
   * @param {string} delegatee - The address to revoke voting power from.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing the payload of the revoke delegate transaction.
   */
  async revokeDelegate(delegatee: string) {
    const {
      nativeArgs,
      function: fn,
      ...payload
    } = this.voting.revokeDelegate(delegatee);

    return payload;
  }

  /**
   * Concludes a proposal.
   * @async
   * @param {string} proposal - The ID of the proposal to conclude.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing the payload of the conclude transaction.
   */
  async conclude(proposal: string) {
    const {
      nativeArgs,
      function: fn,
      ...payload
    } = this.voting.conclude(proposal);

    return payload;
  }

  /**
   * Gets the current vote threshold for proposals.
   * @async
   * @throws {Error} - Throws an error if an unexpected error occurs or if the provided address is not a valid Stacks address.
   * @returns {Promise<bigint>} - A Promise that resolves to a bigint representing the current vote threshold.
   */
  async getVoteThreshold() {
    try {
      const threshold: Response<boolean, bigint> = await this.client.ro(
        this.voting.getParameter("voteThreshold")
      );
      if (threshold.isOk) {
        return threshold.value;
      }
      throw new Error(`Unexpected error: ${threshold.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the current quorum threshold for proposals.
   * @async
   * @throws {Error} - Throws an error if an unexpected error occurs or if the provided address is not a valid Stacks address.
   * @returns {Promise<bigint>} - A Promise that resolves to a bigint representing the current quorum threshold.
   */
  async getQuorumThreshold() {
    try {
      const quorum: Response<boolean, bigint> = await this.client.ro(
        this.voting.getParameter("quorumThreshold")
      );
      if (quorum.isOk) {
        return quorum.value;
      }
      throw new Error(`Unexpected error: ${quorum.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the current execution delay for proposals.
   * @async
   * @throws {Error} - Throws an error if an unexpected error occurs or if the provided address is not a valid Stacks address.
   * @returns {Promise<bigint>} - A Promise that resolves to a bigint representing the current execution delay.
   */
  async getExecutionDelay() {
    try {
      const executionDelay: Response<boolean, bigint> = await this.client.ro(
        this.voting.getParameter("executionDelay")
      );
      if (executionDelay.isOk) {
        return executionDelay.value;
      }
      throw new Error(`Unexpected error: ${executionDelay.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets data for a specific proposal.
   * @async
   * @param {string} proposal - The ID of the proposal to get data for.
   * @throws {Error} - Throws an error if an unexpected error occurs or if the provided address is not a valid Stacks address.
   * @returns {Promise<Object>} - A Promise that resolves to an object containing data for the specified proposal.
   */
  async getProposal(proposal: string) {
    try {
      const proposalData: Response<boolean, bigint> = await this.client.ro(
        this.voting.getProposalData(proposal)
      );
      if (!proposalData) return {};
      if (proposalData.isOk) {
        return proposalData.value;
      }
      throw new Error(`Unexpected error: ${proposalData.value}`);
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the total votes for a specific proposal by a specific address.
   * @async
   * @param {string} proposal - The ID of the proposal to get votes for.
   * @param {string} who - The address to get votes by.
   * @throws {Error} - Throws an error if an unexpected error occurs or if the provided address is not a valid Stacks address.
   * @returns {Promise<Response<boolean, bigint>>} - A Promise that resolves to a Response object containing a boolean indicating success or failure and a bigint representing the total votes for the specified proposal and address.
   */
  async getVotesByAddress(proposal: string, who: string) {
    try {
      const totalVotes: Response<boolean, bigint> = await this.client.ro(
        this.voting.getCurrentTotalVotes(proposal, who)
      );
      return totalVotes;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Gets the voting power of a specific address at a specific block height.
   * @async
   * @param {string} who - The address to get voting power for.
   * @param {number} blockHeight - The block height to get voting power at.
   * @throws {Error} - Throws an error if an unexpected error occurs, if the provided address is not a valid Stacks address, or if the provided block height is not valid.
   * @returns {Promise<Response<boolean, bigint>>} - A Promise that resolves to a Response object containing a boolean indicating success or failure and a bigint representing the voting power of the specified address at the specified block height.
   */
  async getVotingPower(who: string, blockHeight: number) {
    try {
      const votingPower: Response<boolean, bigint> = await this.client.ro(
        this.voting.getVotingPower(who, blockHeight)
      );
      return votingPower;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else if (err.message.includes("NoSuchContract")) {
        throw createErrorWithStackTrace(
          "Invalid Block Height: the provided blockHeight is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Determines whether a specific address can vote at a specific block height and threshold.
   * @async
   * @param {string} who - The address to check voting eligibility for.
   * @param {number} blockHeight - The block height to check voting eligibility at.
   * @param {number} threshold - The vote threshold to check eligibility against.
   * @throws {Error} - Throws an error if an unexpected error occurs, if the provided address is not a valid Stacks address, or if the provided block height is not valid.
   * @returns {Promise<Response<boolean, bigint>>} - A Promise that resolves to a Response object containing a boolean indicating whether the specified address can vote at the specified block height and threshold, and a bigint representing the address's voting power.
   */
  async canVote(who: string, blockHeight: number, threshold: number) {
    try {
      const canVote: Response<boolean, bigint> = await this.client.ro(
        this.voting.canVote(who, blockHeight, threshold)
      );
      return canVote;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else if (err.message.includes("NoSuchContract")) {
        throw createErrorWithStackTrace(
          "Invalid Block Height: the provided blockHeight is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Determines whether a specific address can vote on behalf of another specific address.
   * @async
   * @param {string} who - The address to check voting eligibility for.
   * @param {string} delegator - The address to check voting eligibility on behalf of.
   * @throws {Error} - Throws an error if an unexpected error occurs or if the provided address is not a valid Stacks address.
   * @returns {Promise<Response<boolean, bigint>>} - A Promise that resolves to a Response object containing a boolean indicating whether the specified address can vote on behalf of the specified delegator, and a bigint representing the address's voting power.
   */
  async canVoteOnBehalf(who: string, delegator: string) {
    try {
      const canVoteOnBehalf: Response<boolean, bigint> = await this.client.ro(
        this.voting.canVoteOnBehalf(who, delegator)
      );
      return canVoteOnBehalf;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  /**
   * Determines whether a specific address is currently delegating their voting power to another address.
   * @async
   * @param {string} who - The address to check delegating status for.
   * @throws {Error} - Throws an error if an unexpected error occurs or if the provided address is not a valid Stacks address.
   * @returns {Promise<Response<boolean, bigint>>} - A Promise that resolves to a Response object containing a boolean indicating whether the specified address is currently delegating their voting power, and a bigint representing the address's voting power.
   */
  async isDelegating(who: string) {
    try {
      const canVoteOnBehalf: Response<boolean, bigint> = await this.client.ro(
        this.voting.isDelegating(who)
      );
      return canVoteOnBehalf;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }
}
