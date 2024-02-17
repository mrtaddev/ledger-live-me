import { useSelector } from "react-redux";
import { AccountLike, PortfolioRange } from "@ledgerhq/types-live";
import { CryptoCurrency, TokenCurrency } from "@ledgerhq/types-cryptoassets";
import {
  usePortfolio as usePortfolioRaw,
  useBalanceHistoryWithCountervalue as useBalanceHistoryWithCountervalueRaw,
  useCurrencyPortfolio as useCurrencyPortfolioRaw,
} from "@ledgerhq/live-countervalues-react/portfolio";
import { selectedTimeRangeSelector } from "~/renderer/reducers/settings";
import { counterValueCurrencySelector } from "./../reducers/settings";
import { accountsSelector } from "./../reducers/accounts";

// provide redux states via custom hook wrapper

export function useBalanceHistoryWithCountervalue({
  account,
  range,
}: {
  account: AccountLike;
  range: PortfolioRange;
}) {
  const to = useSelector(counterValueCurrencySelector);
  return useBalanceHistoryWithCountervalueRaw({
    account,
    range,
    to,
  });
}
export function usePortfolio() {
  const to = useSelector(counterValueCurrencySelector);
  const accounts = useSelector(accountsSelector);
  const range = useSelector(selectedTimeRangeSelector);
  return usePortfolioRaw({
    accounts,
    range,
    to,
  });
}
export function useCurrencyPortfolio({
  currency,
  range,
}: {
  currency: CryptoCurrency | TokenCurrency;
  range: PortfolioRange;
}) {
  const accounts = useSelector(accountsSelector);
  const to = useSelector(counterValueCurrencySelector);
  return useCurrencyPortfolioRaw({
    accounts,
    range,
    to,
    currency,
  });
}
