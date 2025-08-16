'use client';
import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  InformationCircleIcon,
  CpuChipIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  CogIcon,
  ChartBarIcon,
  CloudIcon
} from '@heroicons/react/24/solid';

import useEnhancedDeviceInfo from '@/hooks/useEnhancedDeviceInfo';
import usePerformanceMonitor from '@/hooks/usePerformanceMonitor';
import CollapsibleSection from './CollapsibleSection';
import PerformanceMonitor from './PerformanceMonitor';
import DownloadManager from './DownloadManager';
import SecurityDashboard from './SecurityDashboard';
import InfoTable from './InfoTable';

const EnhancedDeviceInfo = () => {
  const { 
    deviceInfo, 
    readClipboard, 
    realtimeUpdates, 
    toggleRealtimeUpdates,
    refreshData 
  } = useEnhancedDeviceInfo();
  
  const { performanceData } = usePerformanceMonitor();
  const [searchTerm, setSearchTerm] = useState('');
  const [fontSize, setFontSize] = useState('base');

  const fontSizeClasses = {
    small: 'text-sm',
    base: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  if (!deviceInfo) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading comprehensive device information...</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Gathering system data and performance metrics</p>
        </div>
      </div>
    );
  }

  const categories = {
    'Basic Information': {
      icon: InformationCircleIcon,
      keys: ['User Agent', 'Platform', 'Language', 'Languages', 'Cookies Enabled', 'Java Enabled', 'Online Status', 'Do Not Track', 'PDF Viewer Enabled', 'Vibration Support'],
      color: 'text-blue-600 dark:text-blue-400'
    },
    'Hardware Information': {
      icon: CpuChipIcon,
      keys: ['Hardware Concurrency', 'Device Memory (GB)', 'Max Touch Points', 'Touch Support'],
      color: 'text-purple-600 dark:text-purple-400'
    },
    'Display & Screen': {
      icon: ComputerDesktopIcon,
      keys: ['Screen Resolution', 'Available Screen Size', 'Color Depth', 'Pixel Depth', 'Orientation', 'Viewport Size', 'Device Pixel Ratio', 'Zoom Level'],
      color: 'text-green-600 dark:text-green-400'
    },
    'Network Information': {
      icon: GlobeAltIcon,
      keys: ['Connection Type', 'Downlink', 'RTT', 'Save Data'],
      color: 'text-indigo-600 dark:text-indigo-400'
    },
    'Browser & Engine': {
      icon: CloudIcon,
      keys: ['Browser Name', 'Browser Version', 'Engine Name', 'Engine Version', 'OS Name', 'OS Version'],
      color: 'text-cyan-600 dark:text-cyan-400'
    },
    'Device Details': {
      icon: DevicePhoneMobileIcon,
      keys: ['Device Type', 'Manufacturer', 'Model'],
      color: 'text-orange-600 dark:text-orange-400'
    },
    'Location & Time': {
      icon: GlobeAltIcon,
      keys: ['Timezone', 'Timezone Offset', 'Locale', 'Geolocation'],
      color: 'text-teal-600 dark:text-teal-400'
    },
    'Storage & APIs': {
      icon: ShieldCheckIcon,
      keys: ['Local Storage', 'Session Storage', 'IndexedDB', 'WebSQL', 'WebRTC', 'WebSocket', 'Fetch API', 'Push API', 'Notification API', 'Service Worker'],
      color: 'text-red-600 dark:text-red-400'
    },
    'Media & Graphics': {
      icon: ChartBarIcon,
      keys: ['Media Capabilities', 'WebGL Info', 'Media Devices'],
      color: 'text-pink-600 dark:text-pink-400'
    },
    'Advanced Features': {
      icon: CogIcon,
      keys: ['WebAssembly', 'Sensor APIs', 'Battery Level', 'Battery Charging', 'Battery Charging Time', 'Battery Discharging Time', 'Clipboard Data'],
      color: 'text-yellow-600 dark:text-yellow-400'
    }
  };

  const filteredCategories = Object.entries(categories).filter(([category, config]) => {
    const filteredKeys = config.keys.filter((key) => {
      const value = deviceInfo[key];
      if (!value) return false;
      
      return (
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof value === 'object' && JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    return filteredKeys.length > 0;
  });

  return (
    <div className={`space-y-6 ${fontSizeClasses[fontSize]}`}>
      
      {/* Control Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search device information..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search device information"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Font Size Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Font:</span>
              <select 
                value={fontSize} 
                onChange={(e) => setFontSize(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                aria-label="Select font size"
              >
                <option value="small">Small</option>
                <option value="base">Normal</option>
                <option value="large">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>

            {/* Real-time Toggle */}
            <button
              onClick={toggleRealtimeUpdates}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-ring ${
                realtimeUpdates 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={realtimeUpdates ? 'Stop real-time updates' : 'Start real-time updates'}
            >
              {realtimeUpdates ? <PauseIcon className="w-4 h-4 mr-1" /> : <PlayIcon className="w-4 h-4 mr-1" />}
              {realtimeUpdates ? 'Live' : 'Static'}
            </button>

            {/* Refresh Button */}
            <button
              onClick={refreshData}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors focus-ring"
              title="Refresh all data"
            >
              <ArrowPathIcon className="w-4 h-4 mr-1" />
              Refresh
            </button>

            {/* Clipboard Button */}
            <button
              onClick={readClipboard}
              className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors focus-ring"
              title="Read clipboard data"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2" />
              </svg>
              Clipboard
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${realtimeUpdates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-gray-600 dark:text-gray-400">
              {realtimeUpdates ? 'Real-time monitoring active' : 'Static view'}
            </span>
          </div>
          <div className="flex items-center">
            <InformationCircleIcon className="w-4 h-4 mr-1 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">
              Last updated: {deviceInfo['Last Updated']}
            </span>
          </div>
          <div className="flex items-center">
            <ChartBarIcon className="w-4 h-4 mr-1 text-purple-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {Object.keys(deviceInfo).length} data points collected
            </span>
          </div>
        </div>
      </div>

      {/* Performance Monitor */}
      <CollapsibleSection 
        title="Real-time Performance Monitor" 
        icon={ChartBarIcon}
        defaultOpen={true}
        badge="Live Data"
        className="animate-fade-in"
      >
        <PerformanceMonitor />
      </CollapsibleSection>

      {/* Security Dashboard */}
      <CollapsibleSection 
        title="Security & Privacy" 
        icon={ShieldCheckIcon}
        defaultOpen={false}
        badge="Analysis"
        className="animate-fade-in"
      >
        <SecurityDashboard deviceInfo={deviceInfo} />
      </CollapsibleSection>

      {/* Download Manager */}
      <CollapsibleSection 
        title="Export & Download" 
        icon={CloudIcon}
        defaultOpen={false}
        className="animate-fade-in"
      >
        <DownloadManager deviceInfo={deviceInfo} performanceData={performanceData} />
      </CollapsibleSection>

      {/* Device Information Sections */}
      {filteredCategories.map(([category, config]) => {
        const filteredKeys = config.keys.filter((key) => {
          const value = deviceInfo[key];
          if (!value) return false;
          
          return (
            key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (typeof value === 'object' && JSON.stringify(value).toLowerCase().includes(searchTerm.toLowerCase()))
          );
        });

        return (
          <CollapsibleSection 
            key={category} 
            title={category}
            icon={config.icon}
            defaultOpen={category === 'Basic Information'}
            badge={`${filteredKeys.length} items`}
            className="animate-slide-in"
          >
            <InfoTable 
              data={filteredKeys.map(key => [key, deviceInfo[key]])} 
              searchTerm={searchTerm}
            />
          </CollapsibleSection>
        );
      })}

      {/* No Results Message */}
      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No device information matches "{searchTerm}". Try a different search term.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-4 btn btn-primary"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-start">
          <ShieldCheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Privacy & Security</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              All device information is processed locally in your browser. No data is transmitted to external servers. 
              Location and sensitive data require explicit permission and can be disabled at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDeviceInfo;