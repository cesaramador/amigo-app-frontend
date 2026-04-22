function resolveApiBaseUrl() {
  const raw = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const fallback = "https://amigo.dextrati.cloud/api/v1";

  if (!raw) return fallback;

  const sanitized = raw.replace(/\/+$/, "");
  if (sanitized.endsWith("/api/v1")) return sanitized;
  if (sanitized.endsWith("/api")) return `${sanitized}/v1`;
  return `${sanitized}/api/v1`;
}

const API_BASE_URL = resolveApiBaseUrl();

type ApiResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
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
  id_municipio: number;
  id_estado: number;
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

async function getJson<T>(path: string): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`);
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

async function postJson<T>(path: string, payload: unknown): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
  return postJson("/auth/iniciar", { telefono_personal, codigo });
}

export function recuperarCodigo(telefono_personal: string, email: string) {
  return postJson("/auth/recuperar-codigo", { telefono_personal, email });
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
  return getJson<TipoUsuarioOption[]>("/tiposusuarios?limit=50&sort=id_tipousuario:asc");
}

export function obtenerEstadosPublicos() {
  return getJson<EstadoOption[]>("/estados?limit=100&sort=id_estado:asc");
}

export function obtenerMunicipiosPorEstado(idEstado: string) {
  return getJson<MunicipioOption[]>(`/municipios?limit=3000&sort=id_municipio:asc`).then(
    (result) => {
      if (!result.success || !result.data) return result;
      const filtered = result.data.filter(
        (municipio) => String(municipio.id_estado) === String(idEstado)
      );
      return {
        ...result,
        data: filtered,
      };
    }
  );
}

export function obtenerGenerosPublicos() {
  return getJson<GeneroOption[]>("/generos?limit=50&sort=id_genero:asc");
}

export function obtenerEstatusMaritalesPublicos() {
  return getJson<EstatusMaritalOption[]>("/estatusmaritales?limit=50&sort=id_estatusmarital:asc");
}

export function obtenerCategoriasViviendasPublicas() {
  return getJson<CategoriaViviendaOption[]>(
    "/categoriasviviendas?limit=50&sort=id_categoriavivienda:asc"
  );
}
