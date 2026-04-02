import { Pressable, StyleSheet, Text, View } from "react-native";

import { radius, spacing, palette } from "@/lib/theme";
import { Locale } from "@/types/domain";

type LanguageToggleProps = {
  locale: Locale;
  esLabel: string;
  enLabel: string;
  onChange: (locale: Locale) => void;
};

export function LanguageToggle({ locale, esLabel, enLabel, onChange }: LanguageToggleProps) {
  return (
    <View style={styles.container}>
      {([
        ["es", esLabel],
        ["en", enLabel]
      ] as const).map(([nextLocale, label]) => {
        const selected = locale === nextLocale;

        return (
          <Pressable
            key={nextLocale}
            onPress={() => onChange(nextLocale)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "flex-start",
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 247, 234, 0.12)",
    borderWidth: 1,
    borderColor: palette.border
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill
  },
  optionSelected: {
    backgroundColor: palette.white
  },
  optionLabel: {
    color: palette.white,
    fontSize: 13,
    fontWeight: "700"
  },
  optionLabelSelected: {
    color: palette.ink
  }
});
