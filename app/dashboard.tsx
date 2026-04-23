import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { authStyles } from "../src/styles/auth-styles";
import { abandonarSesion, leerSesionActiva, limpiarSesionActiva } from "../src/services/auth-api";

export default function DashboardScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");

  useEffect(() => {
    const sesion = leerSesionActiva();
    if (!sesion?.token || !sesion?.idSession || !sesion?.userSession || !sesion.user?.nombre) {
      router.replace("/");
      return;
    }

    const partesNombre = [sesion.user.nombre, sesion.user.ap_paterno, sesion.user.ap_materno]
      .filter(Boolean)
      .map((valor) => String(valor).trim())
      .filter((valor) => valor.length > 0);

    setNombreCompleto(partesNombre.join(" "));
  }, []);

  const saludoUsuario = useMemo(() => {
    if (!nombreCompleto) return "Bienvenido";
    return `Bienvenido ${nombreCompleto}`;
  }, [nombreCompleto]);

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

  return (
    <ScrollView
      style={authStyles.screen}
      contentContainerStyle={[authStyles.content, authStyles.dashboardContent]}
    >
      <View style={authStyles.topBar}>
        <Text style={authStyles.topBarText}>{saludoUsuario}</Text>
      </View>
      <View style={authStyles.card}>
        <Text style={authStyles.title}>Bienvenido al Dashboard</Text>
        <Text style={authStyles.subtitle}>
          Inicio de sesión correcto. Esta es una vista temporal de bienvenida.
        </Text>
        {error ? <Text style={[authStyles.message, authStyles.messageError]}>{error}</Text> : null}
        <Pressable onPress={onCerrarSesion} disabled={loading}>
          <Text style={authStyles.linkText}>
            {loading ? "Cerrando sesión..." : "Cerrar sesión y volver al login"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
