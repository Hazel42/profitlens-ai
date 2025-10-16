
import React, { useEffect, useRef } from 'react';
import type { Chart } from 'chart.js';
import { formatRupiah } from '../utils/formatters';

interface WasteBreakdownChartProps {
  data: number[];
  labels: string[];
}

const WasteBreakdownChart: React.FC<WasteBreakdownChartProps> = ({ data, labels }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const total = data.reduce((sum, val) => sum + val, 0);
        const hasData = total > 0;

        chartRef.current = new (window as any).Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Kerugian',
                data: hasData ? data : [1],
                backgroundColor: hasData 
                    ? ['#EF4444', '#FBBF24', '#8B5CF6', '#3B82F6'] // Red, Yellow, Purple, Blue
                    : ['#374151'], // gray-700
                borderColor: '#1F2937', // gray-800
                borderWidth: 4,
                hoverOffset: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: '#D1D5DB', // gray-300
                  padding: 20,
                  font: {
                    size: 14,
                  },
                },
              },
              tooltip: {
                enabled: hasData,
                backgroundColor: '#111827',
                titleColor: '#fff',
                bodyColor: '#D1D5DB',
                borderColor: '#4B5563',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                  label: function (context) {
                    const label = context.label || '';
                    const value = context.parsed;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return `${label}: ${formatRupiah(value)} (${percentage}%)`;
                  },
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, labels]);

  return (
    <div className="h-64 relative">
      <canvas ref={canvasRef}></canvas>
       {data.reduce((sum, val) => sum + val, 0) === 0 && (
         <div className="absolute inset-0 flex items-center justify-center text-center text-gray-500">
            <p>Belum ada data buangan.</p>
        </div>
       )}
    </div>
  );
};

export default WasteBreakdownChart;
