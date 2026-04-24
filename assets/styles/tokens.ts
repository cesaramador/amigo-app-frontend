export const palette = {
  azulConfianza: "#2D6CB0",
  verdeCalma: "#6BAA7B",
  amarilloSuave: "#F2C86D",
  lavandaSuave: "#A999D6",
  grisClaro: "#F2F4F7",
  azulOscuro: "#2B2F3A",
  blanco: "#FFFFFF",
} as const;

export const uiTokens = {
  color: {
    background: palette.grisClaro,
    surface: palette.blanco,
    text: palette.azulOscuro,
    muted: "#5E6676",
    border: "#D9DEE7",
    primary: palette.azulConfianza,
    secondary: palette.verdeCalma,
    warning: palette.amarilloSuave,
    focus: palette.lavandaSuave,
    error: "#C4554D",
    success: "#2E6B46",
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 16,
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
  },
  typography: {
    family: "Atkinson Hyperlegible",
    bodySize: 18,
    bodyLineHeight: 27,
    titleSize: 28,
    subtitleSize: 18,
    labelSize: 17,
    buttonSize: 18,
    messageSize: 16,
  },
  shadow: {
    card: {
      shadowColor: "#000000",
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
  },
  size: {
    minTouchTarget: 44,
    buttonHeight: 52,
  },
} as const;
