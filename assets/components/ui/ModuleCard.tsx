import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { dashboardTheme } from "../../styles/theme";

type ModuleCardProps = {
  title: string;
  description: string;
  variantStyle: StyleProp<ViewStyle>;
  onPress?: () => void;
};

function CardBody({ title, description, showChevron }: { title: string; description: string; showChevron: boolean }) {
  return (
    <View style={dashboardTheme.moduleCardRow}>
      <View style={dashboardTheme.moduleCardTextCol}>
        <Text style={dashboardTheme.moduleTitle}>{title}</Text>
        <Text style={dashboardTheme.moduleDescription}>{description}</Text>
      </View>
      {showChevron ? <Text style={dashboardTheme.moduleChevron}>›</Text> : null}
    </View>
  );
}

export function ModuleCard({ title, description, variantStyle, onPress }: ModuleCardProps) {
  if (!onPress) {
    return (
      <View style={[dashboardTheme.moduleCard, variantStyle]}>
        <CardBody title={title} description={description} showChevron={false} />
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        dashboardTheme.moduleCard,
        variantStyle,
        pressed ? { opacity: 0.92, transform: [{ scale: 0.992 }] } : null,
      ]}
    >
      <CardBody title={title} description={description} showChevron />
    </Pressable>
  );
}
