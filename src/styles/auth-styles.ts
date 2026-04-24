import { StyleSheet } from "react-native";
import { palette, uiTokens } from "../../assets/styles/tokens";

export const colors = {
  blueTrust: palette.azulConfianza,
  greenCalm: palette.verdeCalma,
  yellowSoft: palette.amarilloSuave,
  lavenderSoft: palette.lavandaSuave,
  lightGray: palette.grisClaro,
  darkBlue: palette.azulOscuro,
  background: uiTokens.color.background,
  surface: uiTokens.color.surface,
  primary: uiTokens.color.primary,
  secondary: uiTokens.color.secondary,
  accent: uiTokens.color.warning,
  text: uiTokens.color.text,
  muted: uiTokens.color.muted,
  border: uiTokens.color.border,
  success: uiTokens.color.secondary,
  error: uiTokens.color.error,
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
    borderRadius: uiTokens.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: uiTokens.spacing.lg,
    gap: 12,
    ...uiTokens.shadow.card,
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
    fontSize: uiTokens.typography.titleSize,
    fontWeight: "700",
    color: colors.primary,
  },
  textCenter: {
    textAlign: "center",
  },
  subtitle: {
    fontSize: uiTokens.typography.subtitleSize,
    color: colors.darkBlue,
    lineHeight: uiTokens.typography.bodyLineHeight,
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
    borderRadius: uiTokens.radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: uiTokens.typography.bodySize,
    color: colors.text,
    minHeight: uiTokens.size.minTouchTarget,
  },
  multilineInput: {
    minHeight: 98,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: uiTokens.radius.sm,
    minHeight: uiTokens.size.buttonHeight,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: colors.surface,
    fontSize: uiTokens.typography.buttonSize,
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
