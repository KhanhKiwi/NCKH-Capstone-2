
interface MetricsProps {
  temperature: number;
  humidity: number;
  stage: string;
  month: number;
}

export function FermentationMetrics({ temperature, humidity, stage, month }: MetricsProps) {
  const metrics = [
    {
      emoji: '🌡️',
      label: 'Nhiệt độ',
      value: `${temperature}°C`,
      status: temperature >= 28 && temperature <= 32 ? 'optimal' : 'warning'
    },
    {
      emoji: '💧',
      label: 'Độ ẩm tương đối',
      value: `${humidity}%`,
      status: humidity >= 70 && humidity <= 85 ? 'optimal' : 'warning'
    },
    {
      emoji: '⏱️',
      label: 'Thời gian ủ',
      value: `Tháng ${month}/12`,
      status: 'neutral'
    },
    {
      emoji: '🧪',
      label: 'Giai đoạn lên men',
      value: stage,
      status: 'neutral'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg text-lg ${
              metric.status === 'optimal' ? 'bg-[#5f7c8a]/20' :
              metric.status === 'warning' ? 'bg-[#b87333]/20' :
              'bg-[#8b7355]/20'
            }`}>
              {metric.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs opacity-60 mb-1">{metric.label}</p>
              <p className="font-medium text-sm truncate">{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
