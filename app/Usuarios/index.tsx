import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button, Card } from "../../assets/components/ui";
import { uiTokens } from "../../assets/styles/tokens";
import {
  actualizarUsuario,
  type CategoriaViviendaAdminOption,
  crearUsuario,
  eliminarUsuario,
  type EstadoAdminOption,
  type EstatusMaritalAdminOption,
  leerSesionActiva,
  type MunicipioAdminOption,
  obtenerCategoriasViviendas,
  obtenerEstados,
  obtenerEstatusMaritales,
  obtenerEstatusUsuarios,
  obtenerGeneros,
  obtenerMunicipios,
  obtenerTiposUsuarios,
  obtenerUsuarioById,
  obtenerUsuarios,
  type UsuarioCrud,
  type UsuarioCrudPayload,
} from "../../src/services/auth-api";
import { authStyles, colors } from "../../src/styles/auth-styles";
import { formatPhoneMask } from "../../src/utils/format-phone-mask";

type UserFormState = {
  id_tipousuario: string;
  nombre: string;
  ap_paterno: string;
  ap_materno: string;
  fecha_nacimiento: string;
  telefono_personal: string;
  telefono_contacto: string;
  email: string;
  id_estado: string;
  id_municipio: string;
  colonia: string;
  calle: string;
  numero_int: string;
  numero_ext: string;
  codigo_postal: string;
  razon_social: string;
  rfc: string;
  id_genero: string;
  id_estatus_usuario: string;
  id_estatus_marital: string;
  id_categoria_vivienda: string;
};

const emptyForm: UserFormState = {
  id_tipousuario: "",
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

const requiredFieldLabels: Array<{ key: keyof UserFormState; label: string }> = [
  { key: "nombre", label: "Nombre" },
  { key: "telefono_personal", label: "Teléfono personal" },
  { key: "email", label: "Email" },
  { key: "id_estado", label: "Estado" },
  { key: "id_municipio", label: "Municipio" },
  { key: "colonia", label: "Colonia" },
  { key: "calle", label: "Calle" },
  { key: "codigo_postal", label: "Código postal" },
  { key: "id_genero", label: "Género" },
  { key: "id_estatus_marital", label: "Estatus marital" },
  { key: "id_categoria_vivienda", label: "Categoría vivienda" },
];

function normalizeText(v: string): string {
  return String(v ?? "").trim();
}

function parseRequiredInt(value: string): number | null {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

function toForm(user: UsuarioCrud): UserFormState {
  return {
    id_tipousuario: String(user.id_tipousuario ?? ""),
    nombre: user.nombre ?? "",
    ap_paterno: user.ap_paterno ?? "",
    ap_materno: user.ap_materno ?? "",
    fecha_nacimiento: user.fecha_nacimiento ? String(user.fecha_nacimiento).slice(0, 10) : "",
    telefono_personal: user.telefono_personal ?? "",
    telefono_contacto: user.telefono_contacto ?? "",
    email: user.email ?? "",
    id_estado: String(user.id_estado ?? ""),
    id_municipio: String(user.id_municipio ?? ""),
    colonia: user.colonia ?? "",
    calle: user.calle ?? "",
    numero_int: user.numero_int ?? "",
    numero_ext: user.numero_ext ?? "",
    codigo_postal: user.codigo_postal ?? "",
    razon_social: user.razon_social ?? "",
    rfc: user.rfc ?? "",
    id_genero: String(user.id_genero ?? ""),
    id_estatus_usuario: String(user.id_estatus_usuario ?? ""),
    id_estatus_marital: String(user.id_estatus_marital ?? ""),
    id_categoria_vivienda: String(user.id_categoria_vivienda ?? ""),
  };
}

function buildPayloadFromForm(form: UserFormState): {
  payload?: UsuarioCrudPayload;
  error?: string;
} {
  for (const { key, label } of requiredFieldLabels) {
    const raw = normalizeText(form[key]);
    if (!raw) return { error: `El campo ${label} es obligatorio.` };
  }

  const id_tipousuario = parseRequiredInt(form.id_tipousuario || "3");
  const id_estado = parseRequiredInt(form.id_estado);
  const id_municipio = parseRequiredInt(form.id_municipio);
  const id_genero = parseRequiredInt(form.id_genero);
  const id_estatus_usuario = parseRequiredInt(form.id_estatus_usuario || "3");
  const id_estatus_marital = parseRequiredInt(form.id_estatus_marital);
  const id_categoria_vivienda = parseRequiredInt(form.id_categoria_vivienda);

  if (!id_tipousuario) return { error: "id_tipousuario debe ser un entero positivo." };
  if (!id_estado) return { error: "id_estado debe ser un entero positivo." };
  if (!id_municipio) return { error: "id_municipio debe ser un entero positivo." };
  if (!id_genero) return { error: "id_genero debe ser un entero positivo." };
  if (!id_estatus_usuario) return { error: "id_estatus_usuario debe ser un entero positivo." };
  if (!id_estatus_marital) return { error: "id_estatus_marital debe ser un entero positivo." };
  if (!id_categoria_vivienda) {
    return { error: "id_categoria_vivienda debe ser un entero positivo." };
  }

  const payload: UsuarioCrudPayload = {
    id_tipousuario,
    nombre: normalizeText(form.nombre),
    ap_paterno: normalizeText(form.ap_paterno),
    ap_materno: normalizeText(form.ap_materno),
    fecha_nacimiento: normalizeText(form.fecha_nacimiento),
    telefono_personal: normalizeText(form.telefono_personal),
    telefono_contacto: normalizeText(form.telefono_contacto),
    email: normalizeText(form.email),
    id_estado,
    id_municipio,
    colonia: normalizeText(form.colonia),
    calle: normalizeText(form.calle),
    numero_int: normalizeText(form.numero_int),
    numero_ext: normalizeText(form.numero_ext),
    codigo_postal: normalizeText(form.codigo_postal),
    razon_social: normalizeText(form.razon_social),
    rfc: normalizeText(form.rfc),
    id_genero,
    id_estatus_usuario,
    id_estatus_marital,
    id_categoria_vivienda,
  };

  return { payload };
}

type SelectOption = {
  value: string;
  label: string;
};

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDateText(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  return formatDate(date) === value;
}

function validateEmail(value: string): string {
  const v = normalizeText(value);
  if (!v) return "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Email inválido.";
  return "";
}

function validatePhone(value: string): string {
  const v = normalizeText(value);
  if (!v) return "";
  if (!/^\d{10}$/.test(v)) return "Debe contener 10 dígitos.";
  return "";
}

function validatePostalCode(value: string): string {
  const v = normalizeText(value);
  if (!v) return "";
  if (!/^\d{5}$/.test(v)) return "Debe contener 5 dígitos.";
  return "";
}

export default function UsuariosScreen() {
  const [users, setUsers] = useState<UsuarioCrud[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [showBirthdatePicker, setShowBirthdatePicker] = useState(false);

  const [tiposUsuarioMap, setTiposUsuarioMap] = useState<Record<number, string>>({});
  const [generoMap, setGeneroMap] = useState<Record<number, string>>({});
  const [estatusMap, setEstatusMap] = useState<Record<number, string>>({});
  const [estadoOptions, setEstadoOptions] = useState<EstadoAdminOption[]>([]);
  const [municipioOptions, setMunicipioOptions] = useState<MunicipioAdminOption[]>([]);
  const [estatusMaritalOptions, setEstatusMaritalOptions] = useState<EstatusMaritalAdminOption[]>([]);
  const [categoriaViviendaOptions, setCategoriaViviendaOptions] = useState<CategoriaViviendaAdminOption[]>(
    [],
  );

  const selectedUser = useMemo(
    () => users.find((u) => u.id_usuario === selectedUserId) ?? null,
    [selectedUserId, users],
  );

  const reloadData = useCallback(async () => {
    setLoading(true);
    setError("");

    const [usersRes, tiposRes, generoRes, estatusRes, estadosRes, estatusMaritalRes, categoriasRes] = await Promise.all([
      obtenerUsuarios(),
      obtenerTiposUsuarios(),
      obtenerGeneros(),
      obtenerEstatusUsuarios(),
      obtenerEstados(),
      obtenerEstatusMaritales(),
      obtenerCategoriasViviendas(),
    ]);

    if (!usersRes.success) {
      setError(usersRes.message || "No se pudieron cargar los usuarios.");
      setLoading(false);
      return;
    }

    const rows = usersRes.data?.data ?? [];
    setUsers(rows);

    const tMap: Record<number, string> = {};
    for (const item of tiposRes.data?.data ?? []) {
      if (typeof item.id_tipousuario === "number" && item.tipo_usuario) {
        tMap[item.id_tipousuario] = item.tipo_usuario;
      }
    }
    setTiposUsuarioMap(tMap);

    const gMap: Record<number, string> = {};
    for (const item of generoRes.data?.data ?? []) {
      if (typeof item.id_genero === "number" && item.genero) {
        gMap[item.id_genero] = item.genero;
      }
    }
    setGeneroMap(gMap);

    const eMap: Record<number, string> = {};
    for (const item of estatusRes.data?.data ?? []) {
      if (typeof item.id_estatususuario === "number" && item.estatus_usuario) {
        eMap[item.id_estatususuario] = item.estatus_usuario;
      }
    }
    setEstatusMap(eMap);
    setEstadoOptions(estadosRes.data?.data ?? []);
    setEstatusMaritalOptions(estatusMaritalRes.data?.data ?? []);
    setCategoriaViviendaOptions(categoriasRes.data?.data ?? []);

    if (selectedUserId && !rows.some((u) => u.id_usuario === selectedUserId)) {
      setSelectedUserId(null);
    }

    if (
      !tiposRes.success ||
      !generoRes.success ||
      !estatusRes.success ||
      !estadosRes.success ||
      !estatusMaritalRes.success ||
      !categoriasRes.success
    ) {
      setMessage(
        "Usuarios cargados, pero algunos catálogos no estuvieron disponibles. Se mostrarán IDs donde falte etiqueta.",
      );
    }

    setLoading(false);
  }, [selectedUserId]);

  useEffect(() => {
    const sesion = leerSesionActiva();
    if (!sesion?.token || !sesion?.idSession || !sesion?.userSession) {
      router.replace("/");
      return;
    }
    void reloadData();
  }, [reloadData]);

  useEffect(() => {
    if (!isFormOpen) return;
    const estadoId = Number(form.id_estado);
    if (!Number.isInteger(estadoId) || estadoId <= 0) {
      setMunicipioOptions([]);
      return;
    }

    void (async () => {
      const result = await obtenerMunicipios(estadoId);
      if (!result.success) {
        setMunicipioOptions([]);
        return;
      }
      const next = result.data?.data ?? [];
      setMunicipioOptions(next);
      if (!next.some((m) => String(m.id_municipio) === form.id_municipio)) {
        setForm((prev) => ({ ...prev, id_municipio: "" }));
      }
    })();
  }, [form.id_estado, form.id_municipio, isFormOpen]);

  const openCreate = () => {
    setIsEditing(false);
    setForm(emptyForm);
    setError("");
    setMessage("");
    setIsFormOpen(true);
  };

  const openEdit = async () => {
    if (!selectedUserId) return;
    setSaving(true);
    setError("");
    const result = await obtenerUsuarioById(selectedUserId);
    setSaving(false);
    if (!result.success || !result.data) {
      setError(result.message || "No se pudo cargar el detalle del usuario.");
      return;
    }
    setIsEditing(true);
    setForm(toForm(result.data));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setIsFormOpen(false);
    setForm(emptyForm);
    setIsEditing(false);
  };

  const onSubmit = async () => {
    setError("");
    setMessage("");
    if (Object.keys(fieldErrors).length > 0) {
      setError("Corrige los campos marcados antes de guardar.");
      return;
    }
    const { payload, error: formError } = buildPayloadFromForm(form);
    if (!payload) {
      setError(formError || "Revisa los datos del formulario.");
      return;
    }

    setSaving(true);
    if (isEditing && selectedUserId) {
      const result = await actualizarUsuario(selectedUserId, payload);
      setSaving(false);
      if (!result.success) {
        setError(result.message || "No se pudo actualizar el usuario.");
        return;
      }
      setMessage(result.message || "Usuario actualizado correctamente.");
    } else {
      const result = await crearUsuario(payload);
      setSaving(false);
      if (!result.success) {
        setError(result.message || "No se pudo crear el usuario.");
        return;
      }
      setMessage(result.message || "Usuario agregado correctamente.");
    }

    setIsFormOpen(false);
    setForm(emptyForm);
    setIsEditing(false);
    await reloadData();
  };

  const onDelete = async () => {
    if (!selectedUserId) return;
    const current = selectedUser;
    const label = current?.email || current?.telefono_personal || `ID ${selectedUserId}`;
    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert(
        "Eliminar usuario",
        `¿Seguro que deseas eliminar ${label}?`,
        [
          { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
          { text: "Eliminar", style: "destructive", onPress: () => resolve(true) },
        ],
        { cancelable: true },
      );
    });
    if (!confirmed) return;

    setSaving(true);
    setError("");
    setMessage("");
    const result = await eliminarUsuario(selectedUserId);
    setSaving(false);

    if (!result.success) {
      setError(result.message || "No se pudo eliminar el usuario.");
      return;
    }

    setSelectedUserId(null);
    setMessage(result.message || "Usuario eliminado correctamente.");
    await reloadData();
  };

  const setField = (key: keyof UserFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const tipoOptions: SelectOption[] = useMemo(
    () =>
      Object.entries(tiposUsuarioMap)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([id, label]) => ({ value: id, label })),
    [tiposUsuarioMap],
  );
  const generoOptions: SelectOption[] = useMemo(
    () =>
      Object.entries(generoMap)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([id, label]) => ({ value: id, label })),
    [generoMap],
  );
  const estatusUsuarioOptions: SelectOption[] = useMemo(
    () =>
      Object.entries(estatusMap)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([id, label]) => ({ value: id, label })),
    [estatusMap],
  );
  const estadoSelectOptions: SelectOption[] = useMemo(
    () =>
      estadoOptions.map((item) => ({
        value: String(item.id_estado),
        label: item.estado,
      })),
    [estadoOptions],
  );
  const municipioSelectOptions: SelectOption[] = useMemo(
    () =>
      municipioOptions.map((item) => ({
        value: String(item.id_municipio),
        label: item.municipio,
      })),
    [municipioOptions],
  );
  const estatusMaritalSelectOptions: SelectOption[] = useMemo(
    () =>
      estatusMaritalOptions.map((item) => ({
        value: String(item.id_estatusmarital),
        label: item.estatus_marital,
      })),
    [estatusMaritalOptions],
  );
  const categoriaViviendaSelectOptions: SelectOption[] = useMemo(
    () =>
      categoriaViviendaOptions.map((item) => ({
        value: String(item.id_categoriavivienda),
        label: item.categoria_vivienda,
      })),
    [categoriaViviendaOptions],
  );

  const fieldErrors = useMemo(() => {
    const errors: Partial<Record<keyof UserFormState, string>> = {};
    const emailError = validateEmail(form.email);
    if (emailError) errors.email = emailError;
    const telefonoPersonalError = validatePhone(form.telefono_personal);
    if (telefonoPersonalError) errors.telefono_personal = telefonoPersonalError;
    const telefonoContactoError = validatePhone(form.telefono_contacto);
    if (telefonoContactoError) errors.telefono_contacto = telefonoContactoError;
    const codigoPostalError = validatePostalCode(form.codigo_postal);
    if (codigoPostalError) errors.codigo_postal = codigoPostalError;
    if (normalizeText(form.fecha_nacimiento) && !isValidDateText(form.fecha_nacimiento)) {
      errors.fecha_nacimiento = "Formato inválido. Usa YYYY-MM-DD.";
    }
    return errors;
  }, [form]);

  const onBirthdateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowBirthdatePicker(false);
      return;
    }
    if (selectedDate) {
      setField("fecha_nacimiento", formatDate(selectedDate));
    }
    setShowBirthdatePicker(false);
  };

  return (
    <ScrollView
      style={authStyles.screen}
      contentContainerStyle={[authStyles.content, authStyles.dashboardContent]}
      keyboardShouldPersistTaps="handled"
    >
      <Card>
        <Text style={styles.title}>Gestión de usuarios</Text>
        <Text style={styles.subtitle}>
          CRUD interno (post-login) para administrar usuarios registrados en el sistema.
        </Text>

        <View style={styles.actionsRow}>
          <Button label="Agregar" onPress={openCreate} disabled={saving} />
          <Button
            label="Modificar"
            variant="secondary"
            onPress={() => {
              void openEdit();
            }}
            disabled={!selectedUserId || saving}
          />
          <Button label="Eliminar" variant="warning" onPress={() => void onDelete()} disabled={!selectedUserId || saving} />
        </View>

        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.colTipo]}>Tipo usuario</Text>
          <Text style={[styles.headerCell, styles.colTel]}>Teléfono personal</Text>
          <Text style={[styles.headerCell, styles.colEmail]}>Email</Text>
          <Text style={[styles.headerCell, styles.colGenero]}>Género</Text>
          <Text style={[styles.headerCell, styles.colEstatus]}>Estatus</Text>
        </View>

        {loading ? <Text style={styles.loadingText}>Cargando usuarios...</Text> : null}
        {!loading && users.length === 0 ? <Text style={styles.loadingText}>No hay usuarios registrados.</Text> : null}

        {!loading &&
          users.map((user) => {
            const selected = user.id_usuario === selectedUserId;
            const tipoUsuario = tiposUsuarioMap[user.id_tipousuario] ?? `ID ${user.id_tipousuario}`;
            const genero = generoMap[user.id_genero] ?? `ID ${user.id_genero}`;
            const estatus = estatusMap[user.id_estatus_usuario] ?? `ID ${user.id_estatus_usuario}`;
            return (
              <Pressable
                key={user.id_usuario}
                onPress={() => setSelectedUserId(user.id_usuario)}
                style={[styles.dataRow, selected ? styles.rowSelected : null]}
              >
                <Text style={[styles.cell, styles.colTipo]}>{tipoUsuario}</Text>
                <Text style={[styles.cell, styles.colTel]}>{user.telefono_personal}</Text>
                <Text style={[styles.cell, styles.colEmail]} numberOfLines={1}>
                  {user.email}
                </Text>
                <Text style={[styles.cell, styles.colGenero]}>{genero}</Text>
                <Text style={[styles.cell, styles.colEstatus]}>{estatus}</Text>
              </Pressable>
            );
          })}

        {error ? <Text style={[authStyles.message, authStyles.messageError]}>{error}</Text> : null}
        {message ? <Text style={[authStyles.message, authStyles.messageSuccess]}>{message}</Text> : null}
      </Card>

      {isFormOpen ? (
        <Card>
          <Text style={styles.title}>{isEditing ? "Modificar usuario" : "Agregar usuario"}</Text>
          <Text style={styles.formHint}>Todos los campos son editables excepto `id_usuario`.</Text>

          <View style={styles.formGrid}>
            <SelectField
              label="Tipo de usuario"
              value={form.id_tipousuario}
              options={tipoOptions}
              placeholder="Selecciona tipo de usuario"
              onChange={(v) => setField("id_tipousuario", v)}
            />
            <LabeledInput label="nombre" value={form.nombre} onChangeText={(v) => setField("nombre", v)} />
            <LabeledInput label="ap_paterno" value={form.ap_paterno} onChangeText={(v) => setField("ap_paterno", v)} />
            <LabeledInput label="ap_materno" value={form.ap_materno} onChangeText={(v) => setField("ap_materno", v)} />
            <DateField
              label="Fecha de nacimiento"
              value={form.fecha_nacimiento}
              error={fieldErrors.fecha_nacimiento}
              onOpenPicker={() => setShowBirthdatePicker(true)}
              onChangeText={(v) => setField("fecha_nacimiento", v)}
            />
            <PhoneInput
              label="telefono_personal"
              value={form.telefono_personal}
              onChangeText={(v) => setField("telefono_personal", v.replace(/\D/g, "").slice(0, 10))}
              error={fieldErrors.telefono_personal}
            />
            <PhoneInput
              label="telefono_contacto"
              value={form.telefono_contacto}
              onChangeText={(v) => setField("telefono_contacto", v.replace(/\D/g, "").slice(0, 10))}
              error={fieldErrors.telefono_contacto}
            />
            <LabeledInput
              label="email"
              value={form.email}
              onChangeText={(v) => setField("email", v)}
              keyboardType="email-address"
              error={fieldErrors.email}
            />
            <SelectField
              label="Estado"
              value={form.id_estado}
              options={estadoSelectOptions}
              placeholder="Selecciona estado"
              onChange={(v) => {
                setField("id_estado", v);
                setField("id_municipio", "");
              }}
            />
            <SelectField
              label="Municipio"
              value={form.id_municipio}
              options={municipioSelectOptions}
              placeholder={
                form.id_estado ? "Selecciona municipio" : "Primero selecciona estado"
              }
              disabled={!form.id_estado}
              onChange={(v) => setField("id_municipio", v)}
            />
            <LabeledInput label="colonia" value={form.colonia} onChangeText={(v) => setField("colonia", v)} />
            <LabeledInput label="calle" value={form.calle} onChangeText={(v) => setField("calle", v)} />
            <LabeledInput label="numero_int" value={form.numero_int} onChangeText={(v) => setField("numero_int", v)} />
            <LabeledInput label="numero_ext" value={form.numero_ext} onChangeText={(v) => setField("numero_ext", v)} />
            <LabeledInput
              label="codigo_postal"
              value={form.codigo_postal}
              onChangeText={(v) => setField("codigo_postal", v.replace(/\D/g, "").slice(0, 5))}
              keyboardType="number-pad"
              error={fieldErrors.codigo_postal}
            />
            <LabeledInput label="razon_social" value={form.razon_social} onChangeText={(v) => setField("razon_social", v)} />
            <LabeledInput label="rfc" value={form.rfc} onChangeText={(v) => setField("rfc", v)} />
            <SelectField
              label="Género"
              value={form.id_genero}
              options={generoOptions}
              placeholder="Selecciona género"
              onChange={(v) => setField("id_genero", v)}
            />
            <SelectField
              label="Estatus usuario"
              value={form.id_estatus_usuario}
              options={estatusUsuarioOptions}
              placeholder="Selecciona estatus de usuario"
              onChange={(v) => setField("id_estatus_usuario", v)}
            />
            <SelectField
              label="Estatus marital"
              value={form.id_estatus_marital}
              options={estatusMaritalSelectOptions}
              placeholder="Selecciona estatus marital"
              onChange={(v) => setField("id_estatus_marital", v)}
            />
            <SelectField
              label="Categoría de vivienda"
              value={form.id_categoria_vivienda}
              options={categoriaViviendaSelectOptions}
              placeholder="Selecciona categoría de vivienda"
              onChange={(v) => setField("id_categoria_vivienda", v)}
            />
          </View>

          <View style={styles.actionsRow}>
            <Button label={saving ? "Guardando..." : "Guardar"} onPress={() => void onSubmit()} disabled={saving} />
            <Button label="Cancelar" variant="warning" onPress={closeForm} disabled={saving} />
          </View>
          {showBirthdatePicker ? (
            <DateTimePicker
              mode="date"
              value={
                isValidDateText(form.fecha_nacimiento)
                  ? new Date(`${form.fecha_nacimiento}T00:00:00`)
                  : new Date()
              }
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onBirthdateChange}
              maximumDate={new Date()}
            />
          ) : null}
        </Card>
      ) : null}
    </ScrollView>
  );
}

type LabeledInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "number-pad" | "phone-pad" | "email-address";
  error?: string;
};

function LabeledInput({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  error,
}: LabeledInputProps) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={[styles.input, error ? styles.inputError : null]}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

type DateFieldProps = {
  label: string;
  value: string;
  error?: string;
  onOpenPicker: () => void;
  onChangeText: (value: string) => void;
};

function DateField({ label, value, error, onOpenPicker, onChangeText }: DateFieldProps) {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      {Platform.OS === "web" ? (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="YYYY-MM-DD"
          autoCapitalize="none"
          autoCorrect={false}
        />
      ) : (
        <Pressable
          onPress={onOpenPicker}
          style={[styles.input, styles.dateTrigger, error ? styles.inputError : null]}
        >
          <Text style={value ? styles.selectText : styles.selectPlaceholder}>
            {value || "Selecciona fecha"}
          </Text>
          <Text style={styles.selectChevron}>📅</Text>
        </Pressable>
      )}
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

type PhoneInputProps = {
  label: string;
  value: string;
  onChangeText: (digitsOnly: string) => void;
  error?: string;
};

function PhoneInput({ label, value, onChangeText, error }: PhoneInputProps) {
  const masked = formatPhoneMask(value);
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        value={masked}
        onChangeText={(text) => {
          const digits = text.replace(/\D/g, "").slice(0, 10);
          onChangeText(digits);
        }}
        keyboardType="phone-pad"
        style={[styles.input, error ? styles.inputError : null]}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="(555) 123-4567"
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function SelectField({
  label,
  value,
  options,
  placeholder,
  disabled = false,
  onChange,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label ?? "";

  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <Pressable
        onPress={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        style={[styles.input, styles.selectTrigger, disabled ? styles.selectDisabled : null]}
      >
        <Text style={selectedLabel ? styles.selectText : styles.selectPlaceholder}>
          {selectedLabel || placeholder}
        </Text>
        <Text style={styles.selectChevron}>{open ? "▲" : "▼"}</Text>
      </Pressable>
      {open ? (
        <View style={styles.selectOptionsBox}>
          <ScrollView style={styles.selectOptionsScroll} nestedScrollEnabled>
            {options.length === 0 ? (
              <Text style={styles.selectEmptyText}>Sin opciones disponibles</Text>
            ) : (
              options.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  style={styles.selectOption}
                >
                  <Text style={styles.selectOptionText}>{option.label}</Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: uiTokens.spacing.xs,
  },
  subtitle: {
    color: colors.muted,
    marginBottom: uiTokens.spacing.md,
  },
  formHint: {
    color: colors.muted,
    marginBottom: uiTokens.spacing.md,
  },
  actionsRow: {
    gap: uiTokens.spacing.sm,
    marginBottom: uiTokens.spacing.md,
    ...(Platform.OS === "web" ? { flexDirection: "row", flexWrap: "wrap" } : null),
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5FA",
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
    borderTopLeftRadius: uiTokens.radius.sm,
    borderTopRightRadius: uiTokens.radius.sm,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  headerCell: {
    fontWeight: "700",
    color: colors.primary,
    fontSize: 13,
  },
  dataRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.surface,
  },
  rowSelected: {
    backgroundColor: "#EAF1FF",
    borderColor: colors.primary,
  },
  cell: {
    color: colors.text,
    fontSize: 13,
  },
  colTipo: { flex: 1.2 },
  colTel: { flex: 1.2 },
  colEmail: { flex: 1.8 },
  colGenero: { flex: 1 },
  colEstatus: { flex: 1.2 },
  loadingText: {
    marginVertical: uiTokens.spacing.sm,
    color: colors.muted,
  },
  formGrid: {
    gap: uiTokens.spacing.sm,
  },
  formField: {
    gap: 6,
  },
  formLabel: {
    color: colors.text,
    fontWeight: "600",
  },
  input: {
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: uiTokens.radius.sm,
    minHeight: 44,
    paddingHorizontal: 10,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  fieldError: {
    color: colors.error,
    fontSize: 12,
    marginTop: 2,
  },
  dateTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectDisabled: {
    opacity: 0.6,
  },
  selectText: {
    color: colors.text,
  },
  selectPlaceholder: {
    color: colors.muted,
  },
  selectChevron: {
    color: colors.muted,
    marginLeft: 8,
  },
  selectOptionsBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: uiTokens.radius.sm,
    backgroundColor: colors.surface,
    maxHeight: 180,
    overflow: "hidden",
  },
  selectOptionsScroll: {
    maxHeight: 180,
  },
  selectOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectOptionText: {
    color: colors.text,
  },
  selectEmptyText: {
    color: colors.muted,
    padding: 12,
  },
});
