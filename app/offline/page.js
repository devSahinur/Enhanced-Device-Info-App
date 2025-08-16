'use client';
import React, { useEffect, useState } from 'react';
import { 
  WifiIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/solid';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      window.location.href = '/';
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    
    if (navigator.onLine) {
      window.location.href = '/';
    } else {
      setTimeout(() => {
        if (navigator.onLine) {
          window.location.href = '/';
        }
      }, 1000);
    }
  };

  const offlineFeatures = [
    { name: 'View cached device information', available: true },
    { name: 'Access previously loaded data', available: true },
    { name: 'Use basic navigation', available: true },
    { name: 'Real-time performance monitoring', available: false },
    { name: 'Download new data', available: false },
    { name: 'Security analysis updates', available: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-200 dark:border-gray-700">
          
          {/* Status Icon */}
          <div className="mb-6">
            {isOnline ? (
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
                <WifiIcon className="w-10 h-10 text-orange-600 dark:text-orange-400" />
              </div>
            )}
          </div>

          {/* Title and Description */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isOnline ? 'Connection Restored!' : 'You\'re Offline'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isOnline 
              ? 'Your internet connection has been restored. Redirecting...'
              : 'No internet connection detected. Some features are limited, but you can still access cached content.'
            }
          </p>

          {/* Retry Button */}
          <button
            onClick={handleRetry}
            disabled={isOnline}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mb-6"
          >
            {isOnline ? (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-5 h-5" />
                <span>Try Again {retryCount > 0 && `(${retryCount})`}</span>
              </>
            )}
          </button>

          {/* Offline Features */}
          {!isOnline && (
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Available Features
              </h3>
              
              <div className="space-y-3">
                {offlineFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {feature.available ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      feature.available 
                        ? 'text-gray-700 dark:text-gray-300' 
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tips Card */}
        {!isOnline && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
              💡 Offline Tips
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Check your Wi-Fi or mobile data connection</li>
              <li>• Move to an area with better signal</li>
              <li>• Cached data will load automatically when online</li>
              <li>• The app will auto-reconnect when internet returns</li>
            </ul>
          </div>
        )}

        {/* Auto-retry indicator */}
        {!isOnline && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Checking connection every 30 seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}