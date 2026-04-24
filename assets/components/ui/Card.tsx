import { type ReactNode } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { uiTokens } from "../../styles/tokens";

type CardProps = ViewProps & {
  children: ReactNode;
};

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: uiTokens.color.surface,
    borderRadius: uiTokens.radius.lg,
    padding: uiTokens.spacing.lg,
    borderWidth: 1,
    borderColor: uiTokens.color.border,
    ...uiTokens.shadow.card,
  },
});
