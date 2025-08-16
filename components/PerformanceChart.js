'use client';
import React, { useState, useEffect } from 'react';

const PerformanceChart = ({ data, title, color = '#3b82f6', unit = '%' }) => {
  const [chartData, setChartData] = useState([]);
  const maxDataPoints = 20;

  useEffect(() => {
    setChartData(prev => {
      const newData = [...prev, data];
      return newData.slice(-maxDataPoints);
    });
  }, [data]);

  const maxValue = Math.max(...chartData, 100);
  const minValue = Math.min(...chartData, 0);
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        <span className="text-2xl font-bold" style={{ color }}>
          {data}{unit}
        </span>
      </div>
      
      <div className="relative h-32 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 128">
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {chartData.length > 1 && (
            <>
              <path
                d={`M 0 ${128 - ((chartData[0] - minValue) / range) * 128} ${chartData
                  .map((value, index) => {
                    const x = (index / (maxDataPoints - 1)) * 400;
                    const y = 128 - ((value - minValue) / range) * 128;
                    return `L ${x} ${y}`;
                  })
                  .join(' ')} L 400 128 L 0 128 Z`}
                fill={`url(#gradient-${title})`}
                stroke="none"
              />
              
              <polyline
                points={chartData
                  .map((value, index) => {
                    const x = (index / (maxDataPoints - 1)) * 400;
                    const y = 128 - ((value - minValue) / range) * 128;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>
        
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400">
          Min: {Math.min(...chartData).toFixed(1)}{unit}
        </div>
        <div className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400">
          Max: {Math.max(...chartData).toFixed(1)}{unit}
        </div>
      </div>
      
      <div className="mt-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Last {chartData.length} readings</span>
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: color }}
          ></div>
          <span>Real-time</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;