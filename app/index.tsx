import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { authStyles } from "../src/styles/auth-styles";
import { iniciarSesion } from "../src/services/auth-api";

export default function Index() {
  const [telefonoPersonal, setTelefonoPersonal] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeTelefono = (value: string) => {
    setTelefonoPersonal(value.replace(/\D/g, "").slice(0, 10));
  };

  const onChangeCodigo = (value: string) => {
    setCodigo(value.replace(/\D/g, "").slice(0, 6));
  };

  const onSubmit = async () => {
    setError("");
    if (telefonoPersonal.length !== 10) {
      setError("El número celular debe tener 10 dígitos.");
      return;
    }
    if (codigo.length !== 6) {
      setError("El código debe tener 6 dígitos.");
      return;
    }

    setLoading(true);
    const result = await iniciarSesion(telefonoPersonal, codigo);
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Número o código incorrecto.");
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <ScrollView style={authStyles.screen} contentContainerStyle={authStyles.content}>
      <View style={authStyles.card}>
        <Text style={authStyles.title}>Acceso al Sistema</Text>
        <Text style={authStyles.subtitle}>
          Ingrese su número celular y su código personal.
        </Text>

        <View>
          <Text style={authStyles.label}>Número celular personal</Text>
          <TextInput
            style={authStyles.input}
            value={telefonoPersonal}
            onChangeText={onChangeTelefono}
            keyboardType="numeric"
            maxLength={10}
            placeholder="10 dígitos"
            accessibilityLabel="Número celular personal"
          />
        </View>

        <View>
          <Text style={authStyles.label}>Código de acceso</Text>
          <TextInput
            style={authStyles.input}
            value={codigo}
            onChangeText={onChangeCodigo}
            keyboardType="numeric"
            maxLength={6}
            placeholder="6 dígitos"
            accessibilityLabel="Código de acceso"
          />
        </View>

        {error ? (
          <Text style={[authStyles.message, authStyles.messageError]}>{error}</Text>
        ) : null}

        <Pressable style={authStyles.button} onPress={onSubmit} disabled={loading}>
          <Text style={authStyles.buttonText}>
            {loading ? "Accediendo..." : "Acceder al sistema"}
          </Text>
        </Pressable>

        <View style={authStyles.linksRow}>
          <Link href="/recuperar-codigo" style={authStyles.linkText}>
            Recuperar código de acceso
          </Link>
          <Link href="/registro-publico" style={authStyles.linkText}>
            Registro público al sistema
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
