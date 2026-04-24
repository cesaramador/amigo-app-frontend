import { StyleSheet } from "react-native";
import { uiTokens } from "./tokens";

export type DashboardModuleAccent = "green" | "yellow" | "blue" | "lavender";

export const dashboardTheme = StyleSheet.create({
  welcomeBlock: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: uiTokens.spacing.lg,
    paddingBottom: uiTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: uiTokens.color.border,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: uiTokens.color.primary,
    textAlign: "right",
    letterSpacing: 0.2,
  },
  welcomeSubtitle: {
    marginTop: uiTokens.spacing.xs,
    fontSize: uiTokens.typography.bodySize,
    color: uiTokens.color.muted,
    lineHeight: uiTokens.typography.bodyLineHeight,
    textAlign: "right",
    maxWidth: "100%",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: uiTokens.color.primary,
    marginBottom: uiTokens.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: uiTokens.typography.bodySize,
    color: uiTokens.color.text,
    lineHeight: uiTokens.typography.bodyLineHeight,
    marginBottom: uiTokens.spacing.md,
  },
  modulesGrid: {
    gap: uiTokens.spacing.sm,
  },
  moduleCard: {
    borderWidth: 1,
    borderColor: uiTokens.color.border,
    borderRadius: uiTokens.radius.md,
    padding: uiTokens.spacing.md,
    backgroundColor: uiTokens.color.surface,
    minHeight: 96,
    justifyContent: "center",
    ...uiTokens.shadow.card,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: uiTokens.color.text,
    marginBottom: uiTokens.spacing.xs,
  },
  moduleDescription: {
    fontSize: uiTokens.typography.bodySize,
    color: uiTokens.color.muted,
    lineHeight: 24,
  },
  moduleAccentGreen: {
    borderLeftWidth: 6,
    borderLeftColor: uiTokens.color.secondary,
  },
  moduleAccentYellow: {
    borderLeftWidth: 6,
    borderLeftColor: uiTokens.color.warning,
  },
  moduleAccentBlue: {
    borderLeftWidth: 6,
    borderLeftColor: uiTokens.color.primary,
  },
  moduleAccentLavender: {
    borderLeftWidth: 6,
    borderLeftColor: uiTokens.color.focus,
  },
});
