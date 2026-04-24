import type { DashboardModuleAccent } from "../styles/theme";

export type DashboardModule = {
  key: string;
  title: string;
  description: string;
  accent: DashboardModuleAccent;
};

export const dashboardModules: DashboardModule[] = [
  {
    key: "administracion",
    title: "Administracion",
    description: "Control general del sistema, catalogos y parametros operativos.",
    accent: "blue",
  },
  {
    key: "encuestas",
    title: "Encuestas",
    description: "Gestion y seguimiento de encuestas aplicadas a usuarios.",
    accent: "yellow",
  },
  {
    key: "proveedor",
    title: "Proveedor",
    description: "Procesos relacionados con proveedores, servicios y contratos.",
    accent: "green",
  },
  {
    key: "cursos",
    title: "Cursos",
    description: "Organizacion de contenidos formativos y progreso de aprendizaje.",
    accent: "lavender",
  },
  {
    key: "personal",
    title: "Personal",
    description: "Operacion interna de equipo, roles de trabajo y actividades.",
    accent: "green",
  },
  {
    key: "usuarios",
    title: "Usuarios",
    description: "Alta, consulta y administracion de cuentas y perfiles.",
    accent: "blue",
  },
  {
    key: "proximos-procesos",
    title: "Proximos procesos",
    description: "Espacio para nuevas secciones que se integraran mas adelante.",
    accent: "yellow",
  },
];
