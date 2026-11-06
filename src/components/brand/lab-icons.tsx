/**
 * Iconos propios de ErgoTopLab: trazo de 1,7 px y un único punto azul que
 * marca el punto de medición (la cota que comprobamos en el laboratorio).
 */
import { cn } from "@/lib/utils";

type IconProps = { className?: string; title?: string };

function Base({ className, title, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-8 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

const Dot = ({ cx, cy }: { cx: number; cy: number }) => (
  <circle cx={cx} cy={cy} r={2.1} fill="var(--measure)" stroke="none" />
);

/** Silla: punto en el apoyo lumbar */
export function IconChair(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10 4.5h11l-1.2 11.5h-8.6z" />
      <path d="M8 19h16M16 19v6M10.5 28l5.5-3 5.5 3M7 14.5v4.5M25 14.5v4.5" />
      <Dot cx={16} cy={12.5} />
    </Base>
  );
}

/** Escritorio elevable: punto en la columna telescópica */
export function IconDesk(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 10.5h24M4 13h24" />
      <path d="M9 13v14M23 13v14M6 27h6M20 27h6" />
      <path d="M9 18.5h0M23 18.5h0" />
      <Dot cx={23} cy={19} />
    </Base>
  );
}

/** Monitor con brazo: punto en el borde superior (altura de los ojos) */
export function IconMonitor(props: IconProps) {
  return (
    <Base {...props}>
      <rect x={5} y={5} width={22} height={14} rx={1.5} />
      <path d="M16 19v5M11 27h10" />
      <Dot cx={16} cy={5} />
    </Base>
  );
}

/** Ratón vertical: punto en la muñeca neutra */
export function IconMouse(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M14 5c6-1 10 3.5 10 11 0 6.5-3.3 11-7.5 11S10 23.7 10 18.5C10 11 11 6 14 5z" />
      <path d="M14.5 5.5 17 13" />
      <Dot cx={10.5} cy={21} />
    </Base>
  );
}

/** Reposapiés: punto en el ángulo del tobillo */
export function IconFootrest(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 19.5 27 15l1 4L6 23.5z" />
      <path d="M11 22.5 9 28M23 19.5l2 8.5M7 28h5M22 28h6" />
      <Dot cx={16} cy={17.5} />
    </Base>
  );
}

/** Ángulo (protocolo / medición) */
export function IconAngle(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 26h20M6 26 18 8" />
      <path d="M13 26a7 7 0 0 0-3-5.8" />
      <Dot cx={6} cy={26} />
    </Base>
  );
}

/** Cronómetro: semanas de uso real */
export function IconTimer(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx={16} cy={18} r={9.5} />
      <path d="M13 4h6M16 4v4.5M16 18l4-4" />
      <Dot cx={16} cy={18} />
    </Base>
  );
}

/** Lista de selección */
export function IconShortlist(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M13 9h13M13 16h13M13 23h9" />
      <path d="M5.5 9l1.5 1.5L10 7.5M5.5 16l1.5 1.5L10 14.5" />
      <Dot cx={7.5} cy={23} />
    </Base>
  );
}

/** Nota editorial */
export function IconScore(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 24h22M5 24V8" />
      <path d="M9 20v-4M14 20v-7M19 20v-9M24 20v-12" />
      <Dot cx={24} cy={8} />
    </Base>
  );
}

export const categoryIcon: Record<string, (props: IconProps) => React.ReactElement> = {
  armchair: IconChair,
  table: IconDesk,
  monitor: IconMonitor,
  mouse: IconMouse,
  footprints: IconFootrest,
};
