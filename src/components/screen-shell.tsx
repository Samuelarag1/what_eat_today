import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import { palette } from "@/lib/theme";

export function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <LinearGradient colors={[palette.deepTeal, palette.teal, palette.clay]} style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbMiddle]} />
      <View style={[styles.orb, styles.orbBottom]} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.22
  },
  orbTop: {
    width: 240,
    height: 240,
    backgroundColor: palette.amber,
    top: -70,
    right: -40
  },
  orbMiddle: {
    width: 180,
    height: 180,
    backgroundColor: palette.wine,
    top: "28%",
    left: -60
  },
  orbBottom: {
    width: 220,
    height: 220,
    backgroundColor: palette.cream,
    bottom: -90,
    right: -70
  }
});
