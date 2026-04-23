import { StyleSheet } from "react-native";

export const colors = {
  // Paleta recomendada
  blueTrust: "#2D6CB0",
  greenCalm: "#6BAA7B",
  yellowSoft: "#F2C86D",
  lavenderSoft: "#A999D6",
  lightGray: "#F2F4F7",
  darkBlue: "#2B2F3A",

  // Tokens de UI
  background: "#F2F4F7",
  surface: "#FFFFFF",
  primary: "#2D6CB0",
  secondary: "#A999D6",
  accent: "#F2C86D",
  text: "#2B2F3A",
  muted: "#5E6676",
  border: "#D9DEE7",
  success: "#6BAA7B",
  error: "#C4554D",
};

export const authStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    gap: 14,
  },
  dashboardContent: {
    justifyContent: "flex-start",
  },
  topBar: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 6,
  },
  topBarText: {
    color: colors.darkBlue,
    fontSize: 16,
    fontWeight: "700",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 12,
  },
  cardNarrow: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  cardWide: {
    width: "100%",
    maxWidth: 730,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
  },
  textCenter: {
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: colors.darkBlue,
    lineHeight: 26,
  },
  label: {
    fontSize: 17,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 6,
  },
  requiredAsterisk: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.lightGray,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 18,
    color: colors.text,
  },
  multilineInput: {
    minHeight: 98,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonSecondary: {
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.darkBlue,
    fontSize: 18,
    fontWeight: "700",
  },
  linksRow: {
    gap: 10,
    marginTop: 8,
  },
  linksRowCentered: {
    alignItems: "center",
  },
  linkText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    padding: 10,
    borderRadius: 8,
  },
  messageError: {
    color: colors.error,
    backgroundColor: "#FBEAE8",
  },
  messageSuccess: {
    color: "#2E6B46",
    backgroundColor: "#EAF5EE",
  },
});
