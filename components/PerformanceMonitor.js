'use client';
import React from 'react';
import { 
  CpuChipIcon, 
  CircleStackIcon, 
  ServerStackIcon,
  SignalIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/solid';
import PerformanceChart from './PerformanceChart';
import usePerformanceMonitor from '@/hooks/usePerformanceMonitor';

const PerformanceBar = ({ value, label, color, unit = '%' }) => {
  const getColorClass = (val) => {
    if (val < 30) return 'performance-low';
    if (val < 70) return 'performance-medium';
    return 'performance-high';
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {value}{unit}
        </span>
      </div>
      <div className="performance-bar">
        <div 
          className={`performance-bar-fill ${getColorClass(value)}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
};

const PerformanceMonitor = () => {
  const { performanceData } = usePerformanceMonitor();

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PerformanceChart 
          data={performanceData.cpuUsage} 
          title="CPU Usage" 
          color="#ef4444"
          unit="%"
        />
        
        <PerformanceChart 
          data={performanceData.frameRate} 
          title="Frame Rate" 
          color="#10b981"
          unit=" FPS"
        />
        
        <PerformanceChart 
          data={performanceData.networkSpeed} 
          title="Network Speed" 
          color="#3b82f6"
          unit=" Kbps"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <CircleStackIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Memory Usage</h3>
          </div>
          
          {performanceData.memoryUsage ? (
            <div className="space-y-4">
              <PerformanceBar 
                value={performanceData.memoryUsage.percentage}
                label="Heap Usage"
                unit="%"
              />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Used</div>
                  <div className="font-semibold">{performanceData.memoryUsage.used} MB</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Total</div>
                  <div className="font-semibold">{performanceData.memoryUsage.total} MB</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Limit</div>
                  <div className="font-semibold">{performanceData.memoryUsage.limit} MB</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">Memory information not available</div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <ServerStackIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Storage Info</h3>
          </div>
          
          {performanceData.storageInfo ? (
            <div className="space-y-4">
              <PerformanceBar 
                value={performanceData.storageInfo.percentage}
                label="Storage Usage"
                unit="%"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Used</div>
                  <div className="font-semibold">{performanceData.storageInfo.usage} GB</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 dark:text-gray-400">Total</div>
                  <div className="font-semibold">{performanceData.storageInfo.quota} GB</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">Storage information not available</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <CpuChipIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">GPU Information</h3>
          </div>
          
          {performanceData.gpuInfo ? (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Vendor:</span>
                <span className="ml-2 font-medium">{performanceData.gpuInfo.vendor}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Renderer:</span>
                <span className="ml-2 font-medium text-sm break-all">{performanceData.gpuInfo.renderer}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Version:</span>
                <span className="ml-2 font-medium text-sm">{performanceData.gpuInfo.version}</span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">GPU information not available</div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <SignalIcon className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">System Status</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Throttling Status</span>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  performanceData.throttling ? 'bg-red-500' : 'bg-green-500'
                }`} />
                <span className={`text-sm font-medium ${
                  performanceData.throttling ? 'text-red-600' : 'text-green-600'
                }`}>
                  {performanceData.throttling ? 'Throttled' : 'Normal'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Frame Rate</span>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  performanceData.frameRate > 30 ? 'bg-green-500' : 
                  performanceData.frameRate > 15 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">
                  {performanceData.frameRate} FPS
                </span>
              </div>
            </div>
            
            {performanceData.throttling && (
              <div className="flex items-start bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Performance Throttling Detected
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    The system may be reducing performance to manage resources or temperature.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;