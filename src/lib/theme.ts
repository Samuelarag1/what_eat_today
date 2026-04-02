import { Platform } from "react-native";

export const palette = {
  cream: "#F7E5C6",
  creamMuted: "#EAD6B5",
  clay: "#D86B41",
  amber: "#F2B750",
  wine: "#8B3525",
  teal: "#1C5A55",
  deepTeal: "#0F3D3E",
  deepTealAlt: "#173E3A",
  pine: "#0A2525",
  white: "#FFF7EA",
  ink: "#15302E",
  border: "rgba(255, 247, 234, 0.18)",
  softBorder: "rgba(255, 247, 234, 0.08)",
  success: "#6DCF95",
  danger: "#E88974"
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999
} as const;

export const cardShadow = Platform.select({
  android: {
    elevation: 6
  },
  default: {
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 }
  }
});
