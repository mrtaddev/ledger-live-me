// @flow

import React, { useCallback, useState, useEffect } from "react";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { StellarMemoType } from "@ledgerhq/live-common/lib/families/stellar/types";
import Select from "~/renderer/components/Select";
import invariant from "invariant";
import type { Account, Transaction } from "@ledgerhq/live-common/lib/types";

const MemoTypeField = ({
  onChange,
  account,
  transaction,
}: {
  onChange: string => void,
  account: Account,
  transaction: Transaction,
}) => {
  invariant(transaction.family === "stellar", "MemoTypeField: stellar family expected");

  const bridge = getAccountBridge(account);

  const options = StellarMemoType.map(type => ({
    label: type,
    value: type,
  }));

  const [selectedMemoType, setSelectedMemoType] = useState(options[0]);

  const onMemoTypeChange = useCallback(
    memoType => {
      setSelectedMemoType(memoType);
      onChange(bridge.updateTransaction(transaction, { memoType: memoType.value }));
    },
    [onChange, transaction.memoType, bridge],
  );

  useEffect(() => {
    setSelectedMemoType(options.find(option => option.value === transaction.memoType));
  }, [transaction.memoType]);

  return (
    <Select
      width={"156px"}
      isSearchable={false}
      onChange={onMemoTypeChange}
      value={selectedMemoType}
      options={options}
    />
  );
};

export default MemoTypeField;
