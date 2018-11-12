// @flow
import React, { PureComponent } from "react";
import { View, StyleSheet, Image } from "react-native";

import shield from "../images/shield.png";
import shieldWarning from "../images/shield-warning.png";
import shieldCheckmark from "../images/shield-checkmark.png";

import colors from "../colors";

import LText from "./LText";

type Props = {
  text: React$Node,
  unsafe?: boolean,
  verified?: boolean,
};

class VerifyAddressDisclaimer extends PureComponent<Props> {
  static defaultProps = {
    unsafe: false,
    verified: false,
  };

  render() {
    const { unsafe, verified, text } = this.props;

    return (
      <View
        style={[styles.wrapper, unsafe ? styles.wrapperWarning : undefined]}
      >
        <Image
          source={unsafe ? shieldWarning : verified ? shieldCheckmark : shield}
        />
        <View style={styles.textWrapper}>
          <LText style={[styles.text, unsafe ? styles.textWarning : undefined]}>
            {text}
          </LText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    borderRadius: 4,
    backgroundColor: colors.lightGrey,
    flexDirection: "row",
    alignItems: "center",
  },
  wrapperWarning: {
    borderColor: colors.alert,
    backgroundColor: colors.lightAlert,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 12,
    color: colors.grey,
    lineHeight: 18,
    paddingLeft: 16,
  },
  textWarning: {
    color: colors.alert,
  },
});

export default VerifyAddressDisclaimer;
