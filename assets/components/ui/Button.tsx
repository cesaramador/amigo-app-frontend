import { Pressable, type PressableProps, StyleSheet, Text } from "react-native";
import { uiTokens } from "../../styles/tokens";

type ButtonVariant = "primary" | "secondary" | "warning";

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
};

export function Button({ label, variant = "primary", style, disabled, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...props}
    >
      <Text style={[styles.text, variant === "warning" && styles.warningText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: uiTokens.size.buttonHeight,
    borderRadius: uiTokens.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: uiTokens.spacing.md,
  },
  primary: {
    backgroundColor: uiTokens.color.primary,
  },
  secondary: {
    backgroundColor: uiTokens.color.secondary,
  },
  warning: {
    backgroundColor: uiTokens.color.warning,
  },
  text: {
    color: uiTokens.color.surface,
    fontSize: uiTokens.typography.buttonSize,
    fontWeight: "700",
  },
  warningText: {
    color: uiTokens.color.text,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
});
