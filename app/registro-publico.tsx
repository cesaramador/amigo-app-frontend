import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  obtenerCategoriasViviendasPublicas,
  obtenerEstadosPublicos,
  obtenerEstatusMaritalesPublicos,
  obtenerGenerosPublicos,
  obtenerMunicipiosPorEstado,
  obtenerTiposUsuariosPublicos,
  registrarPublico,
  type CategoriaViviendaOption,
  type EstadoOption,
  type EstatusMaritalOption,
  type EstatusUsuarioOption,
  type GeneroOption,
  type MunicipioOption,
  type RegistroPublicoPayload,
  type TipoUsuarioOption,
} from "../src/services/auth-api";
import { authStyles } from "../src/styles/auth-styles";

type FormState = Record<keyof RegistroPublicoPayload, string>;

const initialState: FormState = {
  id_tipousuario: "1",
  nombre: "",
  ap_paterno: "",
  ap_materno: "",
  fecha_nacimiento: "",
  telefono_personal: "",
  telefono_contacto: "",
  email: "",
  id_estado: "",
  id_municipio: "",
  colonia: "",
  calle: "",
  numero_int: "",
  numero_ext: "",
  codigo_postal: "",
  razon_social: "",
  rfc: "",
  id_genero: "",
  id_estatus_usuario: "",
  id_estatus_marital: "",
  id_categoria_vivienda: "",
};

const requiredFields: (keyof RegistroPublicoPayload)[] = [
  "id_tipousuario",
  "nombre",
  "telefono_personal",
  "email",
  "id_estado",
  "id_municipio",
  "colonia",
  "calle",
  "codigo_postal",
  "id_genero",
  "id_estatus_usuario",
  "id_estatus_marital",
  "id_categoria_vivienda",
];

function toPayload(form: FormState): RegistroPublicoPayload {
  return {
    id_tipousuario: Number(form.id_tipousuario),
    nombre: form.nombre.trim(),
    ap_paterno: form.ap_paterno.trim(),
    ap_materno: form.ap_materno.trim(),
    fecha_nacimiento: form.fecha_nacimiento.trim(),
    telefono_personal: form.telefono_personal.trim(),
    telefono_contacto: form.telefono_contacto.trim(),
    email: form.email.trim().toLowerCase(),
    id_estado: Number(form.id_estado),
    id_municipio: Number(form.id_municipio),
    colonia: form.colonia.trim(),
    calle: form.calle.trim(),
    numero_int: form.numero_int.trim(),
    numero_ext: form.numero_ext.trim(),
    codigo_postal: form.codigo_postal.trim(),
    razon_social: form.razon_social.trim(),
    rfc: form.rfc.trim(),
    id_genero: Number(form.id_genero),
    id_estatus_usuario: Number(form.id_estatus_usuario),
    id_estatus_marital: Number(form.id_estatus_marital),
    id_categoria_vivienda: Number(form.id_categoria_vivienda),
  };
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDateText(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

const isWeb = Platform.OS === "web";
const todayIsoDate = formatDate(new Date());
const fallbackEstatusUsuarios: EstatusUsuarioOption[] = [
  { id_estatususuario: 1, estatus_usuario: "vigente" },
];

export default function RegistroPublicoScreen() {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBirthdatePicker, setShowBirthdatePicker] = useState(false);
  const [tiposUsuarios, setTiposUsuarios] = useState<TipoUsuarioOption[]>([]);
  const [estados, setEstados] = useState<EstadoOption[]>([]);
  const [municipios, setMunicipios] = useState<MunicipioOption[]>([]);
  const [generos, setGeneros] = useState<GeneroOption[]>([]);
  const [estatusUsuarios, setEstatusUsuarios] = useState<
    EstatusUsuarioOption[]
  >([]);
  const [estatusMaritales, setEstatusMaritales] = useState<
    EstatusMaritalOption[]
  >([]);
  const [categoriasVivienda, setCategoriasVivienda] = useState<
    CategoriaViviendaOption[]
  >([]);
  const [loadingTiposUsuarios, setLoadingTiposUsuarios] = useState(true);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  const updateField = (field: keyof RegistroPublicoPayload, value: string) => {
    if (field === "telefono_personal" || field === "telefono_contacto") {
      setForm((prev) => ({
        ...prev,
        [field]: value.replace(/\D/g, "").slice(0, 10),
      }));
      return;
    }
    if (field === "codigo_postal") {
      setForm((prev) => ({
        ...prev,
        [field]: value.replace(/\D/g, "").slice(0, 5),
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    setError("");
    setMessage("");

    const missing = requiredFields.filter((field) => !form[field].trim());
    if (missing.length > 0) {
      setError(`Complete los campos obligatorios (${missing.join(", ")}).`);
      return;
    }
    if (form.telefono_personal.length !== 10) {
      setError("El número celular personal debe tener 10 dígitos.");
      return;
    }

    setLoading(true);
    const result = await registrarPublico(toPayload(form));
    setLoading(false);

    if (!result.success) {
      setError(result.message || "No fue posible completar el registro.");
      return;
    }

    setMessage(result.message);
    setForm(initialState);
  };

  const onBirthdateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "dismissed") {
      setShowBirthdatePicker(false);
      return;
    }

    if (selectedDate) {
      updateField("fecha_nacimiento", formatDate(selectedDate));
    }
    setShowBirthdatePicker(false);
  };

  useEffect(() => {
    const loadCatalogos = async () => {
      setLoadingTiposUsuarios(true);
      setLoadingCatalogos(true);
      const [
        tiposUsuariosResult,
        estadosResult,
        generosResult,
        estatusMaritalesResult,
        categoriasViviendaResult,
      ] = await Promise.all([
        obtenerTiposUsuariosPublicos(),
        obtenerEstadosPublicos(),
        obtenerGenerosPublicos(),
        obtenerEstatusMaritalesPublicos(),
        obtenerCategoriasViviendasPublicas(),
      ]);
      setLoadingTiposUsuarios(false);
      setLoadingCatalogos(false);

      const errores: string[] = [];
      const tipos =
        tiposUsuariosResult.success && tiposUsuariosResult.data
          ? tiposUsuariosResult.data
          : [];
      const estadosDisponibles =
        estadosResult.success && estadosResult.data ? estadosResult.data : [];
      const generosDisponibles =
        generosResult.success && generosResult.data ? generosResult.data : [];
      const estatusMaritalesDisponibles =
        estatusMaritalesResult.success && estatusMaritalesResult.data
          ? estatusMaritalesResult.data
          : [];
      const categoriasDisponibles =
        categoriasViviendaResult.success && categoriasViviendaResult.data
          ? categoriasViviendaResult.data
          : [];

      if (tipos.length === 0) errores.push("tipos de usuario");
      if (estadosDisponibles.length === 0) errores.push("estados");
      if (generosDisponibles.length === 0) errores.push("géneros");
      if (estatusMaritalesDisponibles.length === 0)
        errores.push("estatus maritales");
      if (categoriasDisponibles.length === 0)
        errores.push("categorías de vivienda");

      setTiposUsuarios(tipos);
      setEstados(estadosDisponibles);
      setGeneros(generosDisponibles);
      // Este catálogo en nube responde 401; se usa fallback para no bloquear registro.
      setEstatusUsuarios(fallbackEstatusUsuarios);
      setEstatusMaritales(estatusMaritalesDisponibles);
      setCategoriasVivienda(categoriasDisponibles);

      setForm((prev) => ({
        ...prev,
        id_tipousuario: tipos.length > 0 ? String(tipos[0].id_tipousuario) : "",
        id_estado:
          estadosDisponibles.length > 0
            ? String(estadosDisponibles[0].id_estado)
            : "",
        id_genero:
          generosDisponibles.length > 0
            ? String(generosDisponibles[0].id_genero)
            : "",
        id_estatus_usuario: String(
          fallbackEstatusUsuarios[0].id_estatususuario,
        ),
        id_estatus_marital:
          estatusMaritalesDisponibles.length > 0
            ? String(estatusMaritalesDisponibles[0].id_estatusmarital)
            : "",
        id_categoria_vivienda:
          categoriasDisponibles.length > 0
            ? String(categoriasDisponibles[0].id_categoriavivienda)
            : "",
      }));

      if (errores.length > 0) {
        setError(
          `No se pudieron cargar algunos catálogos: ${errores.join(", ")}.`,
        );
      } else {
        setError("");
      }
    };

    loadCatalogos();
  }, []);

  useEffect(() => {
    const loadMunicipios = async () => {
      if (!form.id_estado) {
        setMunicipios([]);
        setForm((prev) => ({ ...prev, id_municipio: "" }));
        return;
      }

      setLoadingMunicipios(true);
      const result = await obtenerMunicipiosPorEstado(form.id_estado);
      setLoadingMunicipios(false);

      if (!result.success || !result.data) {
        setError(result.message || "No fue posible cargar los municipios.");
        setMunicipios([]);
        setForm((prev) => ({ ...prev, id_municipio: "" }));
        return;
      }

      setMunicipios(result.data);
      setForm((prev) => ({
        ...prev,
        id_municipio:
          result.data && result.data.length > 0
            ? String(result.data[0].num_municipio)
            : "",
      }));
    };

    loadMunicipios();
  }, [form.id_estado]);

  return (
    <ScrollView
      style={authStyles.screen}
      contentContainerStyle={authStyles.content}
    >
      <View style={authStyles.card}>
        <Text style={authStyles.title}>Registro Público</Text>
        <Text style={authStyles.subtitle}>
          Complete sus datos para crear su cuenta y recibir el código por email.
        </Text>

        <Text style={authStyles.label}>Nombre *</Text>
        <TextInput
          style={authStyles.input}
          value={form.nombre}
          onChangeText={(v) => updateField("nombre", v)}
        />

        <Text style={authStyles.label}>Apellido paterno</Text>
        <TextInput
          style={authStyles.input}
          value={form.ap_paterno}
          onChangeText={(v) => updateField("ap_paterno", v)}
        />

        <Text style={authStyles.label}>Apellido materno</Text>
        <TextInput
          style={authStyles.input}
          value={form.ap_materno}
          onChangeText={(v) => updateField("ap_materno", v)}
        />

        <Text style={authStyles.label}>Fecha de nacimiento (YYYY-MM-DD)</Text>
        {isWeb ? (
          <View style={authStyles.input}>
            <input
              type="date"
              value={form.fecha_nacimiento}
              max={todayIsoDate}
              onChange={(event) => {
                updateField("fecha_nacimiento", event.target.value);
                if (error) setError("");
              }}
              onBlur={() => {
                if (
                  form.fecha_nacimiento &&
                  !isValidDateText(form.fecha_nacimiento)
                ) {
                  setError(
                    "La fecha de nacimiento debe tener formato YYYY-MM-DD.",
                  );
                }
              }}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 18,
                color: "#1D1D1D",
              }}
              aria-label="Fecha de nacimiento"
            />
          </View>
        ) : (
          <>
            <Pressable
              style={authStyles.input}
              onPress={() => setShowBirthdatePicker(true)}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: form.fecha_nacimiento ? "#1D1D1D" : "#6B6B6B",
                }}
              >
                {form.fecha_nacimiento || "Seleccionar fecha"}
              </Text>
            </Pressable>
            {showBirthdatePicker ? (
              <DateTimePicker
                value={
                  form.fecha_nacimiento
                    ? new Date(`${form.fecha_nacimiento}T00:00:00`)
                    : new Date()
                }
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={onBirthdateChange}
              />
            ) : null}
          </>
        )}

        <Text style={authStyles.label}>Número celular personal *</Text>
        <TextInput
          style={authStyles.input}
          value={form.telefono_personal}
          keyboardType="numeric"
          maxLength={10}
          onChangeText={(v) => updateField("telefono_personal", v)}
        />

        <Text style={authStyles.label}>Número de contacto</Text>
        <TextInput
          style={authStyles.input}
          value={form.telefono_contacto}
          keyboardType="numeric"
          maxLength={10}
          onChangeText={(v) => updateField("telefono_contacto", v)}
        />

        <Text style={authStyles.label}>Correo electrónico *</Text>
        <TextInput
          style={authStyles.input}
          value={form.email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(v) => updateField("email", v)}
        />

        <Text style={authStyles.label}>Tipo de usuario *</Text>
        <View style={authStyles.input}>
          <Picker
            selectedValue={form.id_tipousuario}
            onValueChange={(value) =>
              updateField("id_tipousuario", String(value))
            }
            enabled={!loadingTiposUsuarios && tiposUsuarios.length > 0}
          >
            {loadingTiposUsuarios ? (
              <Picker.Item label="Cargando tipos de usuario..." value="" />
            ) : null}
            {!loadingTiposUsuarios && tiposUsuarios.length === 0 ? (
              <Picker.Item label="Sin opciones disponibles" value="" />
            ) : null}
            {tiposUsuarios.map((tipo) => (
              <Picker.Item
                key={tipo.id_tipousuario}
                label={tipo.tipo_usuario}
                value={String(tipo.id_tipousuario)}
              />
            ))}
          </Picker>
        </View>

        <Text style={authStyles.label}>ID estado *</Text>
        <View style={authStyles.input}>
          <Picker
            selectedValue={form.id_estado}
            onValueChange={(value) => updateField("id_estado", String(value))}
            enabled={!loadingCatalogos && estados.length > 0}
          >
            {loadingCatalogos ? (
              <Picker.Item label="Cargando estados..." value="" />
            ) : null}
            {!loadingCatalogos && estados.length === 0 ? (
              <Picker.Item label="Sin opciones disponibles" value="" />
            ) : null}
            {estados.map((estado) => (
              <Picker.Item
                key={estado.id_estado}
                label={estado.estado}
                value={String(estado.id_estado)}
              />
            ))}
          </Picker>
        </View>

        <Text style={authStyles.label}>Municipio *</Text>
        <View style={authStyles.input}>
          <Picker
            selectedValue={form.id_municipio}
            onValueChange={(value) =>
              updateField("id_municipio", String(value))
            }
            enabled={!loadingMunicipios && municipios.length > 0}
          >
            {loadingMunicipios ? (
              <Picker.Item label="Cargando municipios..." value="" />
            ) : null}
            {!loadingMunicipios && municipios.length === 0 ? (
              <Picker.Item label="Sin opciones disponibles" value="" />
            ) : null}
            {municipios.map((municipio) => (
              <Picker.Item
                key={`${form.id_estado}-${municipio.num_municipio}`}
                label={municipio.municipio}
                value={String(municipio.num_municipio)}
              />
            ))}
          </Picker>
        </View>

        <Text style={authStyles.label}>Colonia *</Text>
        <TextInput
          style={authStyles.input}
          value={form.colonia}
          onChangeText={(v) => updateField("colonia", v)}
        />

        <Text style={authStyles.label}>Calle *</Text>
        <TextInput
          style={authStyles.input}
          value={form.calle}
          onChangeText={(v) => updateField("calle", v)}
        />

        <Text style={authStyles.label}>Número interior</Text>
        <TextInput
          style={authStyles.input}
          value={form.numero_int}
          onChangeText={(v) => updateField("numero_int", v)}
        />

        <Text style={authStyles.label}>Número exterior</Text>
        <TextInput
          style={authStyles.input}
          value={form.numero_ext}
          onChangeText={(v) => updateField("numero_ext", v)}
        />

        <Text style={authStyles.label}>Código postal *</Text>
        <TextInput
          style={authStyles.input}
          value={form.codigo_postal}
          keyboardType="numeric"
          maxLength={5}
          onChangeText={(v) => updateField("codigo_postal", v)}
        />

        <Text style={authStyles.label}>Razón social</Text>
        <TextInput
          style={authStyles.input}
          value={form.razon_social}
          onChangeText={(v) => updateField("razon_social", v)}
        />

        <Text style={authStyles.label}>RFC</Text>
        <TextInput
          style={authStyles.input}
          value={form.rfc}
          onChangeText={(v) => updateField("rfc", v)}
        />

        <Text style={authStyles.label}>Género *</Text>
        <View style={authStyles.input}>
          <Picker
            selectedValue={form.id_genero}
            onValueChange={(value) => updateField("id_genero", String(value))}
            enabled={!loadingCatalogos && generos.length > 0}
          >
            {loadingCatalogos ? (
              <Picker.Item label="Cargando géneros..." value="" />
            ) : null}
            {!loadingCatalogos && generos.length === 0 ? (
              <Picker.Item label="Sin opciones disponibles" value="" />
            ) : null}
            {generos.map((genero) => (
              <Picker.Item
                key={genero.id_genero}
                label={genero.genero}
                value={String(genero.id_genero)}
              />
            ))}
          </Picker>
        </View>

        <Text style={authStyles.label}>Estatus de usuario *</Text>
        <View style={authStyles.input}>
          <Picker
            selectedValue={form.id_estatus_usuario}
            onValueChange={(value) =>
              updateField("id_estatus_usuario", String(value))
            }
            enabled={!loadingCatalogos && estatusUsuarios.length > 0}
          >
            {loadingCatalogos ? (
              <Picker.Item label="Cargando estatus..." value="" />
            ) : null}
            {!loadingCatalogos && estatusUsuarios.length === 0 ? (
              <Picker.Item label="Sin opciones disponibles" value="" />
            ) : null}
            {estatusUsuarios.map((estatus) => (
              <Picker.Item
                key={estatus.id_estatususuario}
                label={estatus.estatus_usuario}
                value={String(estatus.id_estatususuario)}
              />
            ))}
          </Picker>
        </View>

        <Text style={authStyles.label}>Estatus marital *</Text>
        <View style={authStyles.input}>
          <Picker
            selectedValue={form.id_estatus_marital}
            onValueChange={(value) =>
              updateField("id_estatus_marital", String(value))
            }
            enabled={!loadingCatalogos && estatusMaritales.length > 0}
          >
            {loadingCatalogos ? (
              <Picker.Item label="Cargando estatus marital..." value="" />
            ) : null}
            {!loadingCatalogos && estatusMaritales.length === 0 ? (
              <Picker.Item label="Sin opciones disponibles" value="" />
            ) : null}
            {estatusMaritales.map((estatus) => (
              <Picker.Item
                key={estatus.id_estatusmarital}
                label={estatus.estatus_marital}
                value={String(estatus.id_estatusmarital)}
              />
            ))}
          </Picker>
        </View>

        <Text style={authStyles.label}>Categoría de vivienda *</Text>
        <View style={authStyles.input}>
          <Picker
            selectedValue={form.id_categoria_vivienda}
            onValueChange={(value) =>
              updateField("id_categoria_vivienda", String(value))
            }
            enabled={!loadingCatalogos && categoriasVivienda.length > 0}
          >
            {loadingCatalogos ? (
              <Picker.Item label="Cargando categorías..." value="" />
            ) : null}
            {!loadingCatalogos && categoriasVivienda.length === 0 ? (
              <Picker.Item label="Sin opciones disponibles" value="" />
            ) : null}
            {categoriasVivienda.map((categoria) => (
              <Picker.Item
                key={categoria.id_categoriavivienda}
                label={categoria.categoria_vivienda}
                value={String(categoria.id_categoriavivienda)}
              />
            ))}
          </Picker>
        </View>

        {error ? (
          <Text style={[authStyles.message, authStyles.messageError]}>
            {error}
          </Text>
        ) : null}
        {message ? (
          <Text style={[authStyles.message, authStyles.messageSuccess]}>
            {message}
          </Text>
        ) : null}

        <Pressable
          style={[authStyles.button, authStyles.buttonSecondary]}
          onPress={onSubmit}
          disabled={loading}
        >
          <Text style={authStyles.buttonText}>
            {loading ? "Registrando..." : "Completar registro público"}
          </Text>
        </Pressable>

        <Link href="/" style={authStyles.linkText}>
          Volver al login
        </Link>
      </View>
    </ScrollView>
  );
}
