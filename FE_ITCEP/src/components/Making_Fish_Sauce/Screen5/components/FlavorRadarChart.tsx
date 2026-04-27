import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface FlavorRadarChartProps {
  umami: number;
  saltiness: number;
  aroma: number;
  aftertaste: number;
  colorQuality: number;
}

export function FlavorRadarChart({ umami, saltiness, aroma, aftertaste, colorQuality }: FlavorRadarChartProps) {
  const data = [
    { attribute: 'Umami', value: umami },
    { attribute: 'Độ mặn', value: saltiness },
    { attribute: 'Hương thơm', value: aroma },
    { attribute: 'Hậu vị', value: aftertaste },
    { attribute: 'Màu sắc', value: colorQuality },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-amber-950/30 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-amber-700/30 p-6 flex flex-col">
      <h3 className="text-amber-100/90 text-center mb-4 tracking-wide">Biểu đồ Cảm quan</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#d97706" strokeOpacity={0.2} />
            <PolarAngleAxis
              dataKey="attribute"
              tick={{ fill: '#fef3c7', fontSize: 11 }}
              stroke="#d97706"
              strokeOpacity={0.3}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#fef3c7', fontSize: 10 }}
              stroke="#d97706"
              strokeOpacity={0.3}
            />
            <Radar
              name="Hồ sơ hương vị"
              dataKey="value"
              stroke="#fbbf24"
              fill="#f59e0b"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
