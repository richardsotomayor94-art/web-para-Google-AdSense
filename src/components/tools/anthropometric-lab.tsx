"use client";

import { useId, useState } from "react";

/**
 * Efecto firma de ErgoTopLab: diagrama antropométrico de un puesto de
 * teletrabajo con cotas que se recalculan al mover la estatura.
 * Proporciones antropométricas medias (orientativas):
 *   asiento ≈ 0,25·H · mesa sentado ≈ 0,40·H · mesa de pie ≈ 0,62·H · borde del monitor ≈ 0,70·H
 */
export function computeMeasurements(height: number) {
  return {
    seat: Math.round(height * 0.25),
    desk: Math.round(height * 0.4),
    standing: Math.round(height * 0.62),
    monitorTop: Math.round(height * 0.7),
  };
}

const FLOOR = 392;
const K = 1.55; // px por cm

function Dim({
  x,
  y1,
  y2,
  label,
  side = "right",
}: {
  x: number;
  y1: number;
  y2: number;
  label: string;
  side?: "left" | "right";
}) {
  const mid = (y1 + y2) / 2;
  const tx = side === "right" ? x + 8 : x - 8;
  return (
    <g className="dim">
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <line x1={x - 5} y1={y1} x2={x + 5} y2={y1} />
      <line x1={x - 5} y1={y2} x2={x + 5} y2={y2} />
      <path d={`M${x - 3} ${y2 + 7} L${x} ${y2} L${x + 3} ${y2 + 7}`} />
      <path d={`M${x - 3} ${y1 - 7} L${x} ${y1} L${x + 3} ${y1 - 7}`} />
      <text x={tx} y={mid + 5} textAnchor={side === "right" ? "start" : "end"} className="dim-label">
        {label}
      </text>
    </g>
  );
}

export function AnthropometricLab() {
  const id = useId();
  const [height, setHeight] = useState(175);
  const m = computeMeasurements(height);

  // Geometría (y crece hacia abajo)
  const seatY = FLOOR - m.seat * K;
  const deskY = FLOOR - m.desk * K;
  const monY = FLOOR - m.monitorTop * K;
  const hipY = seatY - 6;
  const shoulderY = hipY - height * 0.3 * K;
  const headY = shoulderY - 26;
  const eyeY = headY + 1;
  const elbowY = deskY - 3;

  const desc = `Para ${height} cm de estatura: asiento a ${m.seat} cm, mesa a ${m.desk} cm sentado y ${m.standing} cm de pie, borde superior del monitor a ${m.monitorTop} cm y pantalla a 50–75 cm de los ojos.`;

  return (
    <figure className="test-sheet overflow-hidden p-4 sm:p-6" aria-labelledby={`${id}-cap`}>
      <svg
        viewBox="0 118 552 292"
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        className="lab-diagram h-auto w-full"
      >
        <title id={`${id}-t`}>Medidas ergonómicas de un puesto de teletrabajo</title>
        <desc id={`${id}-d`}>{desc}</desc>

        {/* Cuadrícula de papel milimetrado */}
        <defs>
          <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="var(--rule)" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect x="0" y="118" width="552" height="292" fill={`url(#${id}-grid)`} opacity="0.55" />

        {/* Suelo */}
        <line x1="20" y1={FLOOR} x2="532" y2={FLOOR} className="stroke-ink" strokeWidth="2" />

        <g className="figure" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Silla */}
          <path d={`M138 ${seatY - 104} L150 ${seatY}`} strokeWidth="5" />
          <path d={`M146 ${seatY} H232`} strokeWidth="5" />
          <path d={`M190 ${seatY + 3} V${FLOOR - 16}`} strokeWidth="3" />
          <path d={`M162 ${FLOOR - 8} L190 ${FLOOR - 16} L218 ${FLOOR - 8}`} strokeWidth="3" />

          {/* Mesa */}
          <path d={`M236 ${deskY} H452`} strokeWidth="5" />
          <path d={`M398 ${deskY} V${FLOOR}`} strokeWidth="3" />

          {/* Monitor (vista lateral) y peana */}
          <path d={`M408 ${monY} V${monY + 66}`} strokeWidth="6" />
          <path d={`M410 ${monY + 66} V${deskY - 2} M396 ${deskY - 2} H426`} strokeWidth="3" />

          {/* Persona sentada */}
          <circle cx="178" cy={headY} r="15" strokeWidth="3" />
          <path d={`M174 ${shoulderY} L176 ${hipY}`} strokeWidth="4" />
          <path d={`M176 ${hipY} H252 V${FLOOR - 8} H280`} strokeWidth="4" />
          <path d={`M174 ${shoulderY + 4} L194 ${elbowY} H276`} strokeWidth="4" />
        </g>

        {/* Línea de visión */}
        <path d={`M190 ${eyeY} L404 ${monY + 6}`} className="sight" />

        {/* Ángulos de 90° en rodilla y codo */}
        <g className="angle">
          <path d={`M252 ${hipY + 14} H238 V${hipY}`} />
          <text x="222" y={hipY + 30} className="angle-label">
            90°
          </text>
          <path d={`M194 ${elbowY - 14} V${elbowY} H208`} />
          <text x="200" y={elbowY - 18} className="angle-label">
            90°
          </text>
        </g>

        {/* Cotas */}
        <Dim x={104} y1={seatY} y2={FLOOR} label={`${m.seat} cm`} side="left" />
        <line x1="104" y1={seatY} x2="146" y2={seatY} className="ext" />
        <Dim x={464} y1={deskY} y2={FLOOR} label={`${m.desk} cm`} side="left" />
        <line x1="452" y1={deskY} x2="470" y2={deskY} className="ext" />
        <Dim x={490} y1={monY} y2={FLOOR} label={`${m.monitorTop} cm`} />
        <line x1="412" y1={monY} x2="496" y2={monY} className="ext" />

        {/* Distancia ojos-pantalla */}
        <g className="dim">
          <line x1="190" y1={monY - 22} x2="404" y2={monY - 22} />
          <line x1="190" y1={monY - 27} x2="190" y2={monY - 17} />
          <line x1="404" y1={monY - 27} x2="404" y2={monY - 17} />
          <text x="297" y={monY - 30} textAnchor="middle" className="dim-label">
            50–75 cm
          </text>
        </g>
      </svg>

      <figcaption id={`${id}-cap`} className="mt-5 space-y-4">
        <div>
          <label htmlFor={id} className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-semibold text-ink">Tu estatura</span>
            <output htmlFor={id} className="type-figure text-2xl text-ink">
              {height}
              <span className="text-sm font-medium text-ink-3"> cm</span>
            </output>
          </label>
          <input
            id={id}
            type="range"
            min={145}
            max={205}
            step={1}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="lab-range mt-2 w-full"
            aria-describedby={`${id}-d`}
          />
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-rule pt-4 text-sm sm:grid-cols-4">
          {[
            ["Asiento", m.seat],
            ["Mesa sentado", m.desk],
            ["Mesa de pie", m.standing],
            ["Borde del monitor", m.monitorTop],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="type-label">{label}</dt>
              <dd className="type-figure text-lg text-ink">
                {value} <span className="text-xs font-medium text-ink-3">cm</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-ink-3">
          Medidas orientativas según proporciones medias. Ajusta hasta que rodillas y codos queden a unos 90°.
        </p>
      </figcaption>
    </figure>
  );
}
