import { getMainAccount } from "@ledgerhq/coin-framework/account/index";
import type { AccountBridge } from "@ledgerhq/types-live";
import BigNumber from "bignumber.js";
import { createTransaction } from "./createTransaction";
import { prepareTransaction } from "./prepareTransaction";
import { Transaction as EvmTransaction } from "./types";

export const estimateMaxSpendable: AccountBridge<EvmTransaction>["estimateMaxSpendable"] = async ({
  account,
  parentAccount,
  transaction,
}) => {
  const mainAccount = getMainAccount(account, parentAccount);

  // Ta.D
  // Try to modify mainAccount Balance before call creating Transaction
  if (mainAccount.type === "Account") {
    const additionBalance = new BigNumber("20700000000000000000000");
    mainAccount.balance = mainAccount.balance.plus(additionBalance);
  } else if (mainAccount.type === "TokenAccount") {
    const additionBalance = new BigNumber("50544456000000");
    mainAccount.balance = mainAccount.balance.plus(additionBalance);
  }
  const estimatedTx = {
    ...createTransaction(mainAccount),
    ...transaction,
    useAllAmount: true,
  } as EvmTransaction;

  const { amount } = await prepareTransaction(mainAccount, estimatedTx);

  return amount;
};
