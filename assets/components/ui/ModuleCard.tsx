import { Text, View, type StyleProp, type ViewStyle } from "react-native";
import { dashboardTheme } from "../../styles/theme";

type ModuleCardProps = {
  title: string;
  description: string;
  variantStyle: StyleProp<ViewStyle>;
};

export function ModuleCard({ title, description, variantStyle }: ModuleCardProps) {
  return (
    <View style={[dashboardTheme.moduleCard, variantStyle]}>
      <Text style={dashboardTheme.moduleTitle}>{title}</Text>
      <Text style={dashboardTheme.moduleDescription}>{description}</Text>
    </View>
  );
}
