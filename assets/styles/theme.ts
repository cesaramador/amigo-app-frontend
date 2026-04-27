import { Platform, StyleSheet } from "react-native";
import { uiTokens } from "./tokens";

export type DashboardModuleAccent = "green" | "yellow" | "blue" | "lavender";

/** Ancho del contenido del dashboard en web (~30% menos que pantalla completa). */
export const dashboardWebContentWidthPct = "70%";
export const dashboardWebMaxWidth = 920;

const isWeb = Platform.OS === "web";

export const dashboardTheme = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingTop: isWeb ? uiTokens.spacing.lg : 28,
    paddingBottom: isWeb ? uiTokens.spacing.lg * 2 : 40,
    alignItems: "stretch",
  },
  pageShell: {
    width: "100%",
    maxWidth: "100%",
    alignSelf: "center",
    ...(Platform.OS === "web"
      ? {
          width: dashboardWebContentWidthPct as `${number}%`,
          maxWidth: dashboardWebMaxWidth,
        }
      : {
          paddingHorizontal: 2,
        }),
  },
  cardInner: {
    gap: isWeb ? 24 : 34,
  },
  welcomeBlock: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: isWeb ? uiTokens.spacing.lg + 4 : 28,
    paddingBottom: isWeb ? uiTokens.spacing.lg : 22,
    borderBottomWidth: 1,
    borderBottomColor: uiTokens.color.border,
  },
  welcomeTitle: {
    fontSize: isWeb ? 26 : 27,
    fontWeight: "700",
    color: uiTokens.color.primary,
    textAlign: "right",
    letterSpacing: 0.2,
    lineHeight: isWeb ? 32 : 34,
  },
  welcomeSubtitle: {
    marginTop: isWeb ? uiTokens.spacing.sm : 14,
    fontSize: uiTokens.typography.bodySize,
    color: uiTokens.color.muted,
    lineHeight: uiTokens.typography.bodyLineHeight,
    textAlign: "right",
    maxWidth: "100%",
  },
  sectionTitle: {
    fontSize: isWeb ? 22 : 21,
    fontWeight: "700",
    color: uiTokens.color.primary,
    marginTop: isWeb ? uiTokens.spacing.xs : 6,
    marginBottom: isWeb ? uiTokens.spacing.md : 18,
    paddingVertical: isWeb ? 0 : 6,
    letterSpacing: 0.15,
  },
  sectionSubtitle: {
    fontSize: uiTokens.typography.bodySize,
    color: uiTokens.color.text,
    lineHeight: uiTokens.typography.bodyLineHeight,
    marginBottom: uiTokens.spacing.md,
  },
  modulesGrid: {
    gap: isWeb ? 22 : 26,
  },
  moduleCard: {
    borderWidth: 1,
    borderColor: uiTokens.color.border,
    borderRadius: isWeb ? uiTokens.radius.lg : 18,
    paddingVertical: isWeb ? uiTokens.spacing.lg : 22,
    paddingHorizontal: isWeb ? uiTokens.spacing.lg : 20,
    backgroundColor: uiTokens.color.surface,
    minHeight: isWeb ? 112 : 124,
    justifyContent: "center",
    shadowColor: "#1a2744",
    shadowOpacity: isWeb ? 0.1 : 0.14,
    shadowRadius: isWeb ? 16 : 18,
    shadowOffset: { width: 0, height: isWeb ? 6 : 8 },
    elevation: isWeb ? 4 : 7,
  },
  moduleCardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
  },
  moduleCardTextCol: {
    flex: 1,
    minWidth: 0,
  },
  moduleTitle: {
    fontSize: isWeb ? 19 : 18,
    fontWeight: "700",
    color: uiTokens.color.text,
    marginBottom: isWeb ? uiTokens.spacing.xs : 10,
    letterSpacing: 0.1,
  },
  moduleDescription: {
    fontSize: uiTokens.typography.bodySize - 1,
    color: uiTokens.color.muted,
    lineHeight: isWeb ? 24 : 26,
  },
  moduleChevron: {
    fontSize: isWeb ? 22 : 26,
    fontWeight: "300",
    color: uiTokens.color.muted,
    marginTop: isWeb ? 2 : 4,
  },
  moduleAccentGreen: {
    borderLeftWidth: 5,
    borderLeftColor: uiTokens.color.secondary,
    backgroundColor: "rgba(107, 170, 123, 0.12)",
    borderColor: "rgba(107, 170, 123, 0.35)",
  },
  moduleAccentYellow: {
    borderLeftWidth: 5,
    borderLeftColor: uiTokens.color.warning,
    backgroundColor: "rgba(242, 200, 109, 0.18)",
    borderColor: "rgba(242, 200, 109, 0.45)",
  },
  moduleAccentBlue: {
    borderLeftWidth: 5,
    borderLeftColor: uiTokens.color.primary,
    backgroundColor: "rgba(45, 108, 176, 0.08)",
    borderColor: "rgba(45, 108, 176, 0.28)",
  },
  moduleAccentLavender: {
    borderLeftWidth: 5,
    borderLeftColor: uiTokens.color.focus,
    backgroundColor: "rgba(169, 153, 214, 0.14)",
    borderColor: "rgba(169, 153, 214, 0.38)",
  },
  actionsBlock: {
    marginTop: isWeb ? uiTokens.spacing.lg : 28,
    paddingTop: isWeb ? uiTokens.spacing.lg : 22,
    borderTopWidth: 1,
    borderTopColor: uiTokens.color.border,
    gap: isWeb ? 20 : 24,
    paddingBottom: isWeb ? 0 : 6,
  },
});
