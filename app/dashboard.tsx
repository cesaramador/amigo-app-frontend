import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import { Button, Card, ModuleCard } from "../assets/components/ui";
import { dashboardTheme } from "../assets/styles/theme";
import { dashboardModules } from "../assets/data/dashboard-modules";
import { authStyles } from "../src/styles/auth-styles";
import { abandonarSesion, leerSesionActiva, limpiarSesionActiva } from "../src/services/auth-api";

/** Solo nombre de pila (campo `nombre`), cada palabra con mayúscula inicial. */
function tituloNombrePropio(nombreRaw: string): string {
  const partes = String(nombreRaw ?? "")
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0)
    .map((palabra) => {
      const lower = palabra.toLocaleLowerCase("es");
      return lower.charAt(0).toLocaleUpperCase("es") + lower.slice(1);
    });
  return partes.join(" ");
}

export default function DashboardScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nombreSaludo, setNombreSaludo] = useState(() => {
    const s = leerSesionActiva();
    if (!s?.user?.nombre) return "";
    const n = tituloNombrePropio(s.user.nombre);
    return n.length > 0 ? n : "Amigo";
  });

  useEffect(() => {
    const sesion = leerSesionActiva();
    if (!sesion?.token || !sesion?.idSession || !sesion?.userSession || !sesion.user?.nombre) {
      router.replace("/");
      return;
    }

    const soloNombre = tituloNombrePropio(sesion.user.nombre);
    setNombreSaludo(soloNombre.length > 0 ? soloNombre : "Amigo");
  }, []);

  const onCerrarSesion = async () => {
    setError("");
    setLoading(true);
    const result = await abandonarSesion();
    setLoading(false);

    if (!result.success) {
      setError(result.message || "No fue posible cerrar la sesión.");
      return;
    }

    limpiarSesionActiva();
    router.replace("/");
  };

  const accentStyleByModule = {
    green: dashboardTheme.moduleAccentGreen,
    yellow: dashboardTheme.moduleAccentYellow,
    blue: dashboardTheme.moduleAccentBlue,
    lavender: dashboardTheme.moduleAccentLavender,
  } as const;

  const scrollPad =
    Platform.OS === "web"
      ? { paddingHorizontal: 28, paddingVertical: 8 }
      : { paddingHorizontal: 18, paddingVertical: 16 };

  return (
    <ScrollView
      style={authStyles.screen}
      contentContainerStyle={[
        authStyles.content,
        authStyles.dashboardContent,
        dashboardTheme.scrollContent,
        scrollPad,
      ]}
    >
      <View style={dashboardTheme.pageShell}>
        <Card style={dashboardTheme.cardInner}>
          <View style={dashboardTheme.welcomeBlock}>
            <Text style={dashboardTheme.welcomeTitle}>
              Hola, {nombreSaludo} 👋 ✨
            </Text>
            <Text style={dashboardTheme.welcomeSubtitle}>
              Hoy es un buen día para cuidar de tu salud. Gracias por confiar en este espacio.
            </Text>
          </View>

          <Text style={dashboardTheme.sectionTitle}>Secciones del sistema</Text>
          <View style={dashboardTheme.modulesGrid}>
            {dashboardModules.map((moduleItem) => (
              <ModuleCard
                key={moduleItem.key}
                title={moduleItem.title}
                description={moduleItem.description}
                variantStyle={accentStyleByModule[moduleItem.accent]}
                onPress={
                  moduleItem.route
                    ? () => {
                        router.push(moduleItem.route as never);
                      }
                    : undefined
                }
              />
            ))}
          </View>

          <View style={dashboardTheme.actionsBlock}>
            {error ? <Text style={[authStyles.message, authStyles.messageError]}>{error}</Text> : null}
            <Button
              label={loading ? "Cerrando sesión..." : "Cerrar sesión y volver al login"}
              variant="warning"
              onPress={onCerrarSesion}
              disabled={loading}
            />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}
