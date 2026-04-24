import { useState } from "react";
import { Link } from "expo-router";
import { ScrollView, Text, TextInput, View } from "react-native";
import { Button, Card } from "../assets/components/ui";
import { authStyles } from "../src/styles/auth-styles";
import { recuperarCodigo } from "../src/services/auth-api";

export default function RecuperarCodigoScreen() {
  const [telefonoPersonal, setTelefonoPersonal] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setMessage("");
    setError("");
    if (telefonoPersonal.length !== 10) {
      setError("El número celular debe tener 10 dígitos.");
      return;
    }
    if (!email.includes("@")) {
      setError("Ingrese un email válido.");
      return;
    }

    setLoading(true);
    const result = await recuperarCodigo(telefonoPersonal, email.trim().toLowerCase());
    setLoading(false);

    if (!result.success) {
      setError(result.message || "No se pudo completar la solicitud. Intente de nuevo.");
      return;
    }

    setMessage(result.message || "Operación completada.");
  };

  return (
    <ScrollView style={authStyles.screen} contentContainerStyle={authStyles.content}>
      <Card style={authStyles.cardNarrow}>
        <Text style={[authStyles.title, authStyles.textCenter]}>Recuperar Código</Text>
        <Text style={[authStyles.subtitle, authStyles.textCenter]}>
          Captura tu número celular y correo para recibir un nuevo código por email.
        </Text>

        <View>
          <Text style={authStyles.label}>Número celular personal</Text>
          <TextInput
            style={authStyles.input}
            value={telefonoPersonal}
            onChangeText={(v) => setTelefonoPersonal(v.replace(/\D/g, "").slice(0, 10))}
            keyboardType="numeric"
            maxLength={10}
            placeholder="10 dígitos"
          />
        </View>

        <View>
          <Text style={authStyles.label}>Correo electrónico</Text>
          <TextInput
            style={authStyles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="correo@ejemplo.com"
          />
        </View>

        {error ? (
          <Text style={[authStyles.message, authStyles.messageError]}>{error}</Text>
        ) : null}
        {message ? (
          <Text style={[authStyles.message, authStyles.messageSuccess]}>{message}</Text>
        ) : null}

        <Button
          variant="secondary"
          label={loading ? "Enviando..." : "Enviar nuevo código"}
          onPress={onSubmit}
          disabled={loading}
        />

        <View style={authStyles.linksRowCentered}>
          <Link href="/" style={[authStyles.linkText, authStyles.textCenter]}>
            Volver al login
          </Link>
        </View>
      </Card>
    </ScrollView>
  );
}
