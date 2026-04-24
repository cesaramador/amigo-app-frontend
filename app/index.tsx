import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { Button, Card } from "../assets/components/ui";
import { authStyles } from "../src/styles/auth-styles";
import { guardarSesionActiva, iniciarSesion } from "../src/services/auth-api";

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

    if (!result.data?.token || !result.data?.idSession || !result.data?.userSession || !result.data?.user) {
      setError("El servidor no devolvió una sesión válida. Intente nuevamente.");
      return;
    }

    guardarSesionActiva(result.data);
    router.replace("/dashboard");
  };

  return (
    <ScrollView style={authStyles.screen} contentContainerStyle={authStyles.content}>
      <Card style={[authStyles.cardNarrow, authStyles.authFormCard]}>
        <View style={authStyles.authFormStack}>
          <View style={authStyles.authFormHeader}>
            <Text style={[authStyles.title, authStyles.textCenter]}>Acceso al Sistema</Text>
            <Text style={[authStyles.subtitle, authStyles.textCenter]}>
              Ingrese su número celular y su código personal.
            </Text>
          </View>

          <View>
            <Text style={[authStyles.label, authStyles.authFormLabelExtra]}>
              Número celular personal
            </Text>
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
            <Text style={[authStyles.label, authStyles.authFormLabelExtra]}>Código de acceso</Text>
            <TextInput
              style={authStyles.input}
              value={codigo}
              onChangeText={onChangeCodigo}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              placeholder="6 dígitos"
              accessibilityLabel="Código de acceso"
            />
          </View>

          {error ? (
            <Text style={[authStyles.message, authStyles.messageError]}>{error}</Text>
          ) : null}

          <Button
            variant="secondary"
            label={loading ? "Accediendo..." : "Acceder al sistema"}
            onPress={onSubmit}
            disabled={loading}
          />

          <View style={authStyles.authFormLinks}>
            <Link href="/recuperar-codigo" style={[authStyles.linkText, authStyles.textCenter]}>
              Recuperar código de acceso
            </Link>
            <Link href="/registro-publico" style={[authStyles.linkText, authStyles.textCenter]}>
              Registro público al sistema
            </Link>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}
