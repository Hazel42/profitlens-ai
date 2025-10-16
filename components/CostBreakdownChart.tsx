import React, { useEffect, useRef } from 'react';
import type { Chart } from 'chart.js';
import { formatRupiah } from '../utils/formatters';

interface CostBreakdownChartProps {
  cogs: number;
  operational: number;
  waste: number;
}

const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({ cogs, operational, waste }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const total = cogs + operational + waste;
        const hasData = total > 0;

        chartRef.current = new (window as any).Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Modal (HPP)', 'Operasional', 'Buangan'],
            datasets: [
              {
                label: 'Rincian Biaya',
                data: hasData ? [cogs, operational, waste] : [1],
                backgroundColor: hasData 
                    ? ['#02C39A', '#3B82F6', '#EF4444']
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
            cutout: '70%',
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
                    return `${label}: ${formatRupiah(value, {notation: 'compact', maximumFractionDigits: 1})} (${percentage}%)`;
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
  }, [cogs, operational, waste]);

  return (
    <div className="h-80 relative">
      <canvas ref={canvasRef}></canvas>
       {cogs + operational + waste === 0 && (
         <div className="absolute inset-0 flex items-center justify-center text-center text-gray-500">
            <p>Data biaya tidak tersedia.</p>
        </div>
       )}
    </div>
  );
};

export default CostBreakdownChart;
