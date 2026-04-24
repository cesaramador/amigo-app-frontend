import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

type ApiResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

/** API en nube (mismo host que sirve la raíz JSON de bienvenida). */
const PRODUCTION_API_FALLBACK = "https://amigo.dextrati.cloud/api/v1";

function useLocalNodeApi(): boolean {
  const v = process.env.EXPO_PUBLIC_USE_LOCAL_API?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function isLoopbackHostname(host: string | undefined): boolean {
  if (!host) return false;
  const h = host.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "::1";
}

function isPrivateLanHostname(host: string | undefined): boolean {
  if (!host) return false;
  return (
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)
  );
}

/**
 * URL del API en tiempo de petición (no cachear en constante de módulo):
 * con Expo `web.output: "static"` o SSR, una constante global podía resolverse sin `window`
 * y apuntar a producción mientras la app corre en http://localhost:8081.
 */
export function getApiBaseUrl(): string {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const localPort = process.env.EXPO_PUBLIC_API_LOCAL_PORT?.trim() || "5500";

  if (raw) {
    const sanitized = raw.replace(/\/+$/, "");
    if (sanitized.endsWith("/api/v1")) return sanitized;
    if (sanitized.endsWith("/api")) return `${sanitized}/v1`;
    return `${sanitized}/api/v1`;
  }

  if (typeof window !== "undefined" && Platform.OS === "web") {
    const host = window.location?.hostname;
    // Por defecto el backend está en la nube; API local solo con EXPO_PUBLIC_USE_LOCAL_API=1
    // o con EXPO_PUBLIC_API_BASE_URL (arriba).
    if (isLoopbackHostname(host)) {
      if (useLocalNodeApi()) {
        return `http://127.0.0.1:${localPort}/api/v1`;
      }
      return PRODUCTION_API_FALLBACK;
    }
    // Expo web por IP de LAN: mismo criterio (nube por defecto).
    if (isPrivateLanHostname(host)) {
      if (useLocalNodeApi()) {
        return `http://${host}:${localPort}/api/v1`;
      }
      return PRODUCTION_API_FALLBACK;
    }
    // Sitio desplegado bajo dextrati.cloud → mismo origen /api/v1 (sin depender de constante de build).
    if (host && /\.dextrati\.cloud$/i.test(host)) {
      const { protocol, port } = window.location;
      const origin = `${protocol}//${host}${port ? `:${port}` : ""}`;
      return `${origin}/api/v1`;
    }
  }

  return PRODUCTION_API_FALLBACK;
}

/** Cabeceras base para `fetch` en React Native (OkHttp) y web. */
function buildDefaultFetchHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    Accept: "application/json",
    // En algunos Android + HTTPS, el manejo de compresión puede fallar; `identity` evita el error genérico de red.
    "Accept-Encoding": "identity",
    ...(extra || {}),
  };
}

function hintFalloRed(base: string): string {
  if (base.includes("127.0.0.1") || base.includes("localhost")) {
    return ` Verifique que el API local esté en marcha (puerto ${process.env.EXPO_PUBLIC_API_LOCAL_PORT?.trim() || "5500"}).`;
  }
  if (Platform.OS !== "web") {
    return " Verifique datos móviles o Wi‑Fi. Si prueba contra un API en su PC, defina EXPO_PUBLIC_API_BASE_URL con la IP de la máquina (desde el teléfono, localhost no funciona).";
  }
  return " Verifique su red o que el servicio en la nube esté disponible.";
}

function normalizeCatalogData<T>(body: ApiResult<T>): ApiResult<T> {
  const d = body.data as unknown;
  if (Array.isArray(d)) return body;
  if (d && typeof d === "object" && Array.isArray((d as { rows?: unknown }).rows)) {
    return { ...body, data: (d as { rows: T }).rows };
  }
  return body;
}

function safeParseApiResult<T>(rawBody: string): ApiResult<T> | null {
  if (!rawBody?.trim()) return null;
  try {
    return JSON.parse(rawBody) as ApiResult<T>;
  } catch {
    return null;
  }
}

export type UsuarioSesion = {
  id_usuario: number;
  nombre: string;
  ap_paterno?: string | null;
  ap_materno?: string | null;
  telefono_personal: string;
  email?: string | null;
};

export type InicioSesionData = {
  token: string;
  idSession: string;
  userSession: string;
  user: UsuarioSesion;
};

export type TipoUsuarioOption = {
  id_tipousuario: number;
  tipo_usuario: string;
};

export type EstadoOption = {
  id_estado: number;
  estado: string;
};

export type MunicipioOption = {
  id_municipio?: number;
  id_estado?: number;
  num_municipio: number;
  municipio: string;
};

export type GeneroOption = {
  id_genero: number;
  genero: string;
};

export type EstatusUsuarioOption = {
  id_estatususuario: number;
  estatus_usuario: string;
};

export type EstatusMaritalOption = {
  id_estatusmarital: number;
  estatus_marital: string;
};

export type CategoriaViviendaOption = {
  id_categoriavivienda: number;
  categoria_vivienda: string;
};

/**
 * GET sin cookies ni Authorization: catálogos públicos y registro desde cualquier red / WebView.
 */
async function getJsonPublic<T>(path: string): Promise<ApiResult<T>> {
  const base = getApiBaseUrl();
  try {
    const response = await fetch(`${base}${path}`, {
      headers: buildDefaultFetchHeaders(),
      credentials: "omit",
    });
    const rawBody = await response.text();
    const parsed = safeParseApiResult<T>(rawBody);
    if (!parsed && rawBody.trim()) {
      return {
        success: false,
        message: `Respuesta no JSON (${response.status}) en ${path}. ¿El backend está en ${base}?`,
      };
    }
    const json = parsed
      ? normalizeCatalogData(parsed)
      : ({
          success: false,
          message: "Respuesta vacía del servidor.",
        } as ApiResult<T>);
    if (!response.ok) {
      return {
        success: false,
        message:
          json.message ||
          `Error ${response.status} al consultar catálogo (${path}).`,
      };
    }
    return json;
  } catch (err) {
    const dev = __DEV__ && err instanceof Error ? ` Detalle: ${err.message}` : "";
    return {
      success: false,
      message: `No fue posible conectar con el servidor (${base}).${hintFalloRed(base)}${dev}`,
    };
  }
}

async function getJson<T>(path: string): Promise<ApiResult<T>> {
  const base = getApiBaseUrl();
  try {
    const response = await fetch(`${base}${path}`, {
      headers: buildDefaultFetchHeaders({ ...(buildAuthHeaders() || {}) }),
      credentials: "omit",
    });
    const rawBody = await response.text();
    const json = safeParseApiResult<T>(rawBody);
    if (!response.ok) {
      return {
        success: false,
        message:
          json?.message ||
          `Error ${response.status} al consultar catálogo (${path}).`,
      };
    }
    return (
      json ?? {
        success: false,
        message: "Respuesta vacía del servidor.",
      }
    );
  } catch (err) {
    const dev = __DEV__ && err instanceof Error ? ` Detalle: ${err.message}` : "";
    return {
      success: false,
      message: `No fue posible conectar con el servidor (${base}).${hintFalloRed(base)}${dev}`,
    };
  }
}

async function postJson<T>(path: string, payload?: unknown): Promise<ApiResult<T>> {
  const base = getApiBaseUrl();
  try {
    const hasPayload = payload !== undefined;
    const jsonHeaders = hasPayload ? { "Content-Type": "application/json" } : undefined;
    const response = await fetch(`${base}${path}`, {
      method: "POST",
      headers: buildDefaultFetchHeaders({ ...(buildAuthHeaders(jsonHeaders) || {}) }),
      body: hasPayload ? JSON.stringify(payload) : undefined,
      credentials: "omit",
    });

    const rawBody = await response.text();
    const json = safeParseApiResult<T>(rawBody);
    if (!response.ok) {
      return {
        success: false,
        message:
          json?.message ||
          `Error ${response.status} al procesar la solicitud (${path}).`,
      };
    }

    return (
      json ?? {
        success: false,
        message: "Respuesta vacía del servidor.",
      }
    );
  } catch (err) {
    const dev = __DEV__ && err instanceof Error ? ` Detalle: ${err.message}` : "";
    return {
      success: false,
      message: `No fue posible conectar con el servidor (${base}).${hintFalloRed(base)}${dev}`,
    };
  }
}

export function iniciarSesion(telefono_personal: string, codigo: string) {
  return postJson<InicioSesionData>("/auth/iniciar", { telefono_personal, codigo });
}

export function recuperarCodigo(telefono_personal: string, email: string) {
  return postJson("/auth/recuperar-codigo", { telefono_personal, email });
}

export function abandonarSesion() {
  return postJson("/auth/abandonar");
}

const AUTH_SESSION_KEY = "amigo.auth.session";

/** En iOS/Android no hay `sessionStorage` fiable; memoria + AsyncStorage. */
let sesionNativaMem: InicioSesionData | null = null;

/** Llamar al iniciar la app nativa antes de leer rutas protegidas. */
export async function hydrateSesionDesdeAsyncStorage(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    const raw = await AsyncStorage.getItem(AUTH_SESSION_KEY);
    sesionNativaMem = raw ? (JSON.parse(raw) as InicioSesionData) : null;
  } catch {
    sesionNativaMem = null;
  }
}

export function guardarSesionActiva(data: InicioSesionData): void {
  const raw = JSON.stringify(data);
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.sessionStorage.setItem(AUTH_SESSION_KEY, raw);
    return;
  }
  if (Platform.OS === "web") return;
  sesionNativaMem = data;
  void AsyncStorage.setItem(AUTH_SESSION_KEY, raw).catch(() => {});
}

export function leerSesionActiva(): InicioSesionData | null {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as InicioSesionData;
    } catch {
      return null;
    }
  }
  if (Platform.OS === "web") return null;
  return sesionNativaMem;
}

export function limpiarSesionActiva(): void {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  if (Platform.OS === "web") return;
  sesionNativaMem = null;
  void AsyncStorage.removeItem(AUTH_SESSION_KEY).catch(() => {});
}

function buildAuthHeaders(baseHeaders?: Record<string, string>) {
  const session = leerSesionActiva();
  if (!session?.token) return baseHeaders;
  return {
    ...(baseHeaders || {}),
    Authorization: `Bearer ${session.token}`,
  };
}

export type RegistroPublicoPayload = {
  id_tipousuario: number;
  nombre: string;
  ap_paterno: string;
  ap_materno: string;
  fecha_nacimiento: string;
  telefono_personal: string;
  telefono_contacto: string;
  email: string;
  id_estado: number;
  id_municipio: number;
  colonia: string;
  calle: string;
  numero_int: string;
  numero_ext: string;
  codigo_postal: string;
  razon_social: string;
  rfc: string;
  id_genero: number;
  id_estatus_usuario: number;
  id_estatus_marital: number;
  id_categoria_vivienda: number;
};

export function registrarPublico(payload: RegistroPublicoPayload) {
  return postJson("/registro-publico", payload);
}

export function obtenerTiposUsuariosPublicos() {
  return getJsonPublic<TipoUsuarioOption[]>("/auth/tipos-usuarios");
}

export function obtenerEstadosPublicos() {
  return getJsonPublic<EstadoOption[]>("/auth/estados");
}

export function obtenerMunicipiosPorEstado(idEstado: string) {
  const id = encodeURIComponent(String(idEstado).trim());
  return getJsonPublic<MunicipioOption[]>(`/auth/municipios/${id}`);
}

export function obtenerGenerosPublicos() {
  return getJsonPublic<GeneroOption[]>("/auth/generos");
}

export function obtenerEstatusMaritalesPublicos() {
  return getJsonPublic<EstatusMaritalOption[]>(
    "/auth/estatus-maritales",
  );
}

export function obtenerEstatusUsuariosPublicos() {
  return getJsonPublic<EstatusUsuarioOption[]>("/auth/estatus-usuarios");
}

export function obtenerCategoriasViviendasPublicas() {
  return getJsonPublic<CategoriaViviendaOption[]>(
    "/auth/categorias-viviendas",
  );
}
