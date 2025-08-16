'use client';
import { useState, useEffect, useRef } from 'react';

const usePerformanceMonitor = () => {
  const [performanceData, setPerformanceData] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    storageInfo: null,
    networkSpeed: 0,
    frameRate: 0,
    gpuInfo: null,
    temperature: null,
    throttling: false
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const intervalRef = useRef(null);

  const calculateCPUUsage = () => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const iterations = 100000;
      
      setTimeout(() => {
        let result = 0;
        for (let i = 0; i < iterations; i++) {
          result += Math.random();
        }
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        const cpuUsage = Math.min(100, Math.max(0, (executionTime / 10) * 100));
        resolve(cpuUsage);
      }, 0);
    });
  };

  const getMemoryUsage = () => {
    if ('memory' in performance) {
      const memory = performance.memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576),
        percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      };
    }
    return null;
  };

  const getStorageInfo = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          quota: Math.round(estimate.quota / 1073741824),
          usage: Math.round(estimate.usage / 1073741824),
          percentage: Math.round((estimate.usage / estimate.quota) * 100)
        };
      } catch (error) {
        console.error('Storage estimation failed:', error);
        return null;
      }
    }
    return null;
  };

  const measureNetworkSpeed = () => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const imageAddr = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      const downloadSize = 1024;
      
      const download = new Image();
      download.onload = () => {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = downloadSize * 8;
        const speedBps = bitsLoaded / duration;
        const speedKbps = speedBps / 1024;
        resolve(Math.round(speedKbps));
      };
      download.onerror = () => resolve(0);
      download.src = imageAddr + '?t=' + Math.random();
    });
  };

  const calculateFrameRate = () => {
    const now = performance.now();
    frameCountRef.current++;
    
    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
      return fps;
    }
    return null;
  };

  const getGPUInfo = () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return null;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    };
  };

  const detectThrottling = () => {
    const startTime = performance.now();
    const testDuration = 100;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const actualDuration = performance.now() - startTime;
        const isThrottled = actualDuration > testDuration * 1.5;
        resolve(isThrottled);
      }, testDuration);
    });
  };

  useEffect(() => {
    const updatePerformanceData = async () => {
      try {
        const [cpuUsage, storageInfo, networkSpeed, throttling] = await Promise.all([
          calculateCPUUsage(),
          getStorageInfo(),
          measureNetworkSpeed(),
          detectThrottling()
        ]);

        const memoryUsage = getMemoryUsage();
        const gpuInfo = getGPUInfo();
        const frameRate = calculateFrameRate();

        setPerformanceData(prev => ({
          ...prev,
          cpuUsage: Math.round(cpuUsage),
          memoryUsage,
          storageInfo,
          networkSpeed,
          gpuInfo,
          throttling,
          ...(frameRate !== null && { frameRate })
        }));
      } catch (error) {
        console.error('Performance monitoring error:', error);
      }
    };

    updatePerformanceData();
    intervalRef.current = setInterval(updatePerformanceData, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { performanceData };
};

export default usePerformanceMonitor;