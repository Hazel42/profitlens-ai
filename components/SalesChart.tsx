
import React, { useEffect, useRef } from 'react';
import type { Chart } from 'chart.js';

interface SalesChartProps {
  chartData: {
    labels: string[];
    data: number[];
  };
  comparisonData?: number[];
}

const SalesChart: React.FC<SalesChartProps> = ({ chartData, comparisonData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Destroy previous chart instance if it exists
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(2, 195, 154, 0.6)');
        gradient.addColorStop(1, 'rgba(2, 195, 154, 0)');

        // FIX: Explicitly type `datasets` as `any[]` to allow for different properties on dataset objects, resolving the `borderDash` error.
        const datasets: any[] = [
            {
                label: 'Pendapatan',
                data: chartData.data,
                borderColor: '#02C39A',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#00A896',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#00A896',
                tension: 0.4,
                fill: true,
            },
        ];

        if (comparisonData) {
            datasets.push({
                label: 'Periode Sebelumnya',
                data: comparisonData,
                borderColor: '#6B7280', // gray-500
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointBackgroundColor: '#4B5563',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false,
            });
        }

        chartRef.current = new (window as any).Chart(ctx, {
          type: 'line',
          data: {
            labels: chartData.labels,
            datasets: datasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: '#1F2937',
                titleColor: '#fff',
                bodyColor: '#D1D5DB',
                borderColor: '#4B5563',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                  label: function (context: any) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(context.parsed.y);
                    }
                    return label;
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'transparent'
                },
                ticks: {
                  color: '#9CA3AF',
                   callback: function(value: any) {
                    return new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        notation: 'compact',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }).format(Number(value));
                   }
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#9CA3AF',
                   maxRotation: 0,
                   minRotation: 0,
                   callback: function(this: any, value: any, index: any) {
                       const label = this.getLabelForValue(value as number);
                       const date = new Date(label);
                       return `${date.getDate()}/${date.getMonth() + 1}`;
                   }
                },
              },
            },
          },
        });
      }
    }

    // Cleanup function to destroy chart on component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData, comparisonData]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-80">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default SalesChart;