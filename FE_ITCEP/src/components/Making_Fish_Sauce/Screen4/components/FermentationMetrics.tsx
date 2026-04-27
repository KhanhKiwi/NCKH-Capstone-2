import { Thermometer, Droplets, Clock, Beaker } from 'lucide-react';

interface MetricsProps {
  temperature: number;
  humidity: number;
  stage: string;
  month: number;
}

export function FermentationMetrics({ temperature, humidity, stage, month }: MetricsProps) {
  const metrics = [
    {
      icon: Thermometer,
      label: 'Nhiệt độ',
      value: `${temperature}°C`,
      status: temperature >= 28 && temperature <= 32 ? 'optimal' : 'warning'
    },
    {
      icon: Droplets,
      label: 'Độ ẩm tương đối',
      value: `${humidity}%`,
      status: humidity >= 70 && humidity <= 85 ? 'optimal' : 'warning'
    },
    {
      icon: Clock,
      label: 'Thời gian ủ',
      value: `Tháng ${month}/12`,
      status: 'neutral'
    },
    {
      icon: Beaker,
      label: 'Giai đoạn lên men',
      value: stage,
      status: 'neutral'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={index}
            className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                metric.status === 'optimal' ? 'bg-[#5f7c8a]/20 text-[#5f7c8a]' :
                metric.status === 'warning' ? 'bg-[#b87333]/20 text-[#b87333]' :
                'bg-[#8b7355]/20 text-[#8b7355]'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs opacity-60 mb-1">{metric.label}</p>
                <p className="font-medium text-sm truncate">{metric.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
