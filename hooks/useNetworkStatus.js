'use client';
import { useState, useEffect } from 'react';

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');
  const [effectiveType, setEffectiveType] = useState('4g');
  const [downlink, setDownlink] = useState(10);
  const [rtt, setRtt] = useState(50);
  const [saveData, setSaveData] = useState(false);
  const [networkHistory, setNetworkHistory] = useState([]);

  useEffect(() => {
    // Initialize network status
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
      
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
          setConnectionType(connection.type || 'unknown');
          setEffectiveType(connection.effectiveType || '4g');
          setDownlink(connection.downlink || 10);
          setRtt(connection.rtt || 50);
          setSaveData(connection.saveData || false);
        }
      }
    };

    // Log network changes
    const logNetworkChange = (status, timestamp = Date.now()) => {
      setNetworkHistory(prev => {
        const newEntry = {
          status,
          timestamp,
          connectionType: navigator.connection?.type || 'unknown',
          effectiveType: navigator.connection?.effectiveType || '4g',
          downlink: navigator.connection?.downlink || 10,
          rtt: navigator.connection?.rtt || 50
        };
        
        // Keep only last 50 entries
        return [newEntry, ...prev.slice(0, 49)];
      });
    };

    // Event listeners
    const handleOnline = () => {
      setIsOnline(true);
      updateNetworkStatus();
      logNetworkChange('online');
      
      // Send message to service worker
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'NETWORK_STATUS_CHANGE',
          isOnline: true,
          timestamp: Date.now()
        });
      }
      
      console.log('[Network] Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      logNetworkChange('offline');
      
      // Send message to service worker
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'NETWORK_STATUS_CHANGE',
          isOnline: false,
          timestamp: Date.now()
        });
      }
      
      console.log('[Network] Connection lost');
    };

    const handleConnectionChange = () => {
      updateNetworkStatus();
      logNetworkChange('change');
      console.log('[Network] Connection properties changed');
    };

    // Initial status
    updateNetworkStatus();
    logNetworkChange(navigator.onLine ? 'online' : 'offline');

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        connection.addEventListener('change', handleConnectionChange);
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          connection.removeEventListener('change', handleConnectionChange);
        }
      }
    };
  }, []);

  // Network quality assessment
  const getNetworkQuality = () => {
    if (!isOnline) return 'offline';
    
    if (effectiveType === 'slow-2g' || downlink < 0.5) return 'poor';
    if (effectiveType === '2g' || downlink < 1.5) return 'slow';
    if (effectiveType === '3g' || downlink < 5) return 'good';
    return 'excellent';
  };

  // Network speed test
  const testNetworkSpeed = async () => {
    if (!isOnline) return null;

    try {
      const startTime = performance.now();
      const response = await fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const endTime = performance.now();
      
      const latency = Math.round(endTime - startTime);
      
      return {
        latency,
        timestamp: Date.now(),
        success: response.ok
      };
    } catch (error) {
      console.error('[Network] Speed test failed:', error);
      return {
        latency: null,
        timestamp: Date.now(),
        success: false,
        error: error.message
      };
    }
  };

  // Retry mechanism for failed requests
  const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        const backoffDelay = delay * Math.pow(2, i);
        console.log(`[Network] Retry ${i + 1}/${maxRetries} in ${backoffDelay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  };

  // Get network statistics
  const getNetworkStats = () => {
    const onlineTime = networkHistory.filter(entry => entry.status === 'online').length;
    const offlineTime = networkHistory.filter(entry => entry.status === 'offline').length;
    const totalEntries = networkHistory.length;
    
    return {
      totalEntries,
      onlineTime,
      offlineTime,
      uptime: totalEntries > 0 ? (onlineTime / totalEntries) * 100 : 100,
      lastChange: networkHistory[0]?.timestamp || Date.now(),
      averageDownlink: networkHistory.length > 0 
        ? networkHistory.reduce((sum, entry) => sum + (entry.downlink || 0), 0) / networkHistory.length
        : downlink,
      averageRtt: networkHistory.length > 0
        ? networkHistory.reduce((sum, entry) => sum + (entry.rtt || 0), 0) / networkHistory.length
        : rtt
    };
  };

  return {
    // Current status
    isOnline,
    connectionType,
    effectiveType,
    downlink,
    rtt,
    saveData,
    
    // Derived data
    networkQuality: getNetworkQuality(),
    networkHistory,
    networkStats: getNetworkStats(),
    
    // Methods
    testNetworkSpeed,
    retryWithBackoff,
    
    // Utility
    isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1,
    isFastConnection: effectiveType === '4g' && downlink > 5,
    isMobileConnection: connectionType === 'cellular',
    isWifiConnection: connectionType === 'wifi',
    hasLimitedData: saveData || connectionType === 'cellular'
  };
};

export default useNetworkStatus;