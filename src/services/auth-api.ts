function resolveApiBaseUrl() {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const fallback = "https://amigo.dextrati.cloud/api/v1";

  if (raw) {
    const sanitized = raw.replace(/\/+$/, "");
    if (sanitized.endsWith("/api/v1")) return sanitized;
    if (sanitized.endsWith("/api")) return `${sanitized}/v1`;
    return `${sanitized}/api/v1`;
  }

  // Web en localhost: usar API local si no hay EXPO_PUBLIC_API_BASE_URL (puerto por defecto del backend).
  if (typeof window !== "undefined") {
    const host = window.location?.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      const localPort =
        process.env.EXPO_PUBLIC_API_LOCAL_PORT?.trim() || "5500";
      return `http://${host}:${localPort}/api/v1`;
    }
  }

  return fallback;
}

const API_BASE_URL = resolveApiBaseUrl();

type ApiResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

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
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      credentials: "omit",
    });
    const rawBody = await response.text();
    const json = rawBody ? (JSON.parse(rawBody) as ApiResult<T>) : null;
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
  } catch {
    return {
      success: false,
      message:
        "No fue posible conectar con el servidor. Verifique su red o URL del API.",
    };
  }
}

async function getJson<T>(path: string): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: buildAuthHeaders(),
      credentials: "include",
    });
    const rawBody = await response.text();
    const json = rawBody ? (JSON.parse(rawBody) as ApiResult<T>) : null;
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
  } catch {
    return {
      success: false,
      message:
        "No fue posible conectar con el servidor. Verifique su red o URL del API.",
    };
  }
}

async function postJson<T>(path: string, payload?: unknown): Promise<ApiResult<T>> {
  try {
    const hasPayload = payload !== undefined;
    const jsonHeaders = hasPayload ? { "Content-Type": "application/json" } : undefined;
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: buildAuthHeaders(jsonHeaders),
      body: hasPayload ? JSON.stringify(payload) : undefined,
      credentials: "include",
    });

    const rawBody = await response.text();
    const json = rawBody ? (JSON.parse(rawBody) as ApiResult<T>) : null;
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
  } catch {
    return {
      success: false,
      message:
        "No fue posible conectar con el servidor. Verifique su red o URL del API.",
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

export function guardarSesionActiva(data: InicioSesionData) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(data));
}

export function leerSesionActiva(): InicioSesionData | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InicioSesionData;
  } catch {
    return null;
  }
}

export function limpiarSesionActiva() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
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
