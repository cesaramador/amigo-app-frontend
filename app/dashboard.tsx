import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { authStyles } from "../src/styles/auth-styles";

export default function DashboardScreen() {
  return (
    <ScrollView style={authStyles.screen} contentContainerStyle={authStyles.content}>
      <View style={authStyles.card}>
        <Text style={authStyles.title}>Bienvenido al Dashboard</Text>
        <Text style={authStyles.subtitle}>
          Inicio de sesión correcto. Esta es una vista temporal de bienvenida.
        </Text>
        <Link href="/" style={authStyles.linkText}>
          Cerrar sesión y volver al login
        </Link>
      </View>
    </ScrollView>
  );
}
