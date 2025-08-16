'use client';
import React, { useEffect, useState } from 'react';
import PWAInstallPrompt from './PWAInstallPrompt';
import useNetworkStatus from '@/hooks/useNetworkStatus';

const PWAManager = ({ children }) => {
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const { isOnline, networkQuality } = useNetworkStatus();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      console.log('[PWA] Registering service worker...');
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[PWA] Service worker registered successfully');
      setIsServiceWorkerReady(true);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        console.log('[PWA] New service worker version found');
        const newWorker = registration.installing;
        
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New content available');
            setUpdateAvailable(true);
            setShowUpdatePrompt(true);
          }
        });
      });

      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Service worker controller changed');
        window.location.reload();
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('[PWA] Message from service worker:', event.data);
        
        if (event.data.type === 'SYNC_DEVICE_INFO') {
          // Trigger device info refresh
          window.dispatchEvent(new CustomEvent('refreshDeviceInfo'));
        }
      });

      // Request persistent storage
      if ('storage' in navigator && 'persist' in navigator.storage) {
        const isPersistent = await navigator.storage.persist();
        console.log('[PWA] Persistent storage:', isPersistent);
      }

    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const waitingWorker = registration?.waiting;
      
      if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        setShowUpdatePrompt(false);
      }
    } catch (error) {
      console.error('[PWA] Update failed:', error);
    }
  };

  const dismissUpdate = () => {
    setShowUpdatePrompt(false);
    setTimeout(() => setUpdateAvailable(false), 300);
  };

  return (
    <>
      {children}
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-sm font-medium z-50">
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            You're offline - Some features may be limited
          </div>
        </div>
      )}
      
      {/* Network Quality Indicator */}
      {isOnline && networkQuality === 'poor' && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 text-sm font-medium z-50">
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Slow connection detected - Performance may be affected
          </div>
        </div>
      )}
      
      {/* Update Available Prompt */}
      {showUpdatePrompt && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Update Available
                </h4>
              </div>
              <button
                onClick={dismissUpdate}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              A new version of the app is available with improvements and bug fixes.
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={dismissUpdate}
                className="flex-1 px-3 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Later
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                Update Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Service Worker Status (Debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-black bg-opacity-75 text-white text-xs px-3 py-2 rounded-lg">
            <div>SW: {isServiceWorkerReady ? '✅' : '❌'}</div>
            <div>Online: {isOnline ? '✅' : '❌'}</div>
            <div>Quality: {networkQuality}</div>
            {updateAvailable && <div>Update: ⬆️</div>}
          </div>
        </div>
      )}
    </>
  );
};

export default PWAManager;