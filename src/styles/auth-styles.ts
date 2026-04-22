import { StyleSheet } from "react-native";

export const colors = {
  background: "#F5F0E8",
  surface: "#FFFDF8",
  primary: "#1F4E79",
  secondary: "#C76B39",
  text: "#1D1D1D",
  muted: "#5A5A5A",
  border: "#C9BCA9",
  success: "#2E7D32",
  error: "#B3261E",
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text,
    lineHeight: 26,
  },
  label: {
    fontSize: 17,
    color: colors.text,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
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
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  linksRow: {
    gap: 10,
    marginTop: 8,
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
    backgroundColor: "#FDECEC",
  },
  messageSuccess: {
    color: colors.success,
    backgroundColor: "#E9F7EC",
  },
});
