import React, { useState } from "react";

interface PieChartItem {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartItem[];
  title?: string;
  subtitle?: string;
  centerLabel?: string;
  centerValue?: string;
}

export default function PieChart({
  data,
  title,
  subtitle,
  centerLabel = "Total",
  centerValue,
}: PieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter out 0 value items to avoid visual glitches
  const filteredData = data.filter((item) => item.value > 0);
  const total = filteredData.reduce((sum, item) => sum + item.value, 0);

  // Calculate coordinates for SVG paths
  const cx = 100;
  const cy = 100;
  const r = 75;
  const innerR = 45; // For Donut style

  let currentAngle = 0;

  const getCoordinatesForAngle = (angle: number, radius: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(radians),
      y: cy + radius * Math.sin(radians),
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between transition-all hover:border-slate-300">
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h3>}
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs italic">
          Nenhum dado disponível
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto">
          {/* SVG Pie Container */}
          <div className="relative w-40 h-40 shrink-0">
            <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
              {filteredData.length === 1 ? (
                // Single item: render complete circles
                <g>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={filteredData[0].color}
                    className="transition-all duration-300 cursor-pointer"
                    style={{
                      transform: hoveredIndex === 0 ? "scale(1.04)" : "scale(1)",
                      transformOrigin: "center",
                    }}
                    onMouseEnter={() => setHoveredIndex(0)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  <circle cx={cx} cy={cy} r={innerR} fill="#ffffff" />
                </g>
              ) : (
                // Multiple items: calculate paths
                filteredData.map((item, index) => {
                  const percentage = total > 0 ? item.value / total : 0;
                  const angleSweep = percentage * 360;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + angleSweep;
                  currentAngle = endAngle;

                  const isHovered = hoveredIndex === index;

                  // Coordinates for outer arc
                  const startOuter = getCoordinatesForAngle(startAngle, r);
                  const endOuter = getCoordinatesForAngle(endAngle, r);

                  // Coordinates for inner arc
                  const startInner = getCoordinatesForAngle(startAngle, innerR);
                  const endInner = getCoordinatesForAngle(endAngle, innerR);

                  const largeArcFlag = angleSweep > 180 ? 1 : 0;

                  // Draw donut slice path
                  // M [startOuter] A [r] [r] 0 [largeArc] 1 [endOuter] L [endInner] A [innerR] [innerR] 0 [largeArc] 0 [startInner] Z
                  const pathData = `
                    M ${startOuter.x} ${startOuter.y}
                    A ${r} ${r} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}
                    L ${endInner.x} ${endInner.y}
                    A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}
                    Z
                  `;

                  // Calculate middle angle for slight hover pop-out translation
                  const midAngle = startAngle + angleSweep / 2;
                  const midRad = ((midAngle - 90) * Math.PI) / 180;
                  const hoverOffset = 4;
                  const tx = isHovered ? hoverOffset * Math.cos(midRad) : 0;
                  const ty = isHovered ? hoverOffset * Math.sin(midRad) : 0;

                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={item.color}
                      className="transition-all duration-300 cursor-pointer stroke-white stroke-[1.5px]"
                      style={{
                        transform: `translate(${tx}px, ${ty}px)`,
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                })
              )}
            </svg>

            {/* Central Label Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              {hoveredIndex !== null && filteredData[hoveredIndex] ? (
                <>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider max-w-[80px] truncate">
                    {filteredData[hoveredIndex].label}
                  </span>
                  <span className="text-sm font-black text-slate-800">
                    {filteredData[hoveredIndex].value}
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold">
                    {total > 0 ? ((filteredData[hoveredIndex].value / total) * 100).toFixed(0) : 0}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {centerLabel}
                  </span>
                  <span className="text-base font-black text-slate-800">
                    {centerValue !== undefined ? centerValue : total}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Legends */}
          <div className="flex-1 w-full space-y-2">
            {filteredData.map((item, index) => {
              const pct = total > 0 ? (item.value / total) * 100 : 0;
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isHovered ? "bg-slate-50" : "hover:bg-slate-50/50"
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-md shrink-0 transition-transform"
                      style={{
                        backgroundColor: item.color,
                        transform: isHovered ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                    <span className="text-[11px] font-bold text-slate-600 truncate">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0 ml-2">
                    {pct.toFixed(0)}% ({item.value})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
