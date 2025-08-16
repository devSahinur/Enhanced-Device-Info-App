'use client';
import { useState, useEffect, useCallback } from 'react';
import Bowser from 'bowser';

const useEnhancedDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [realtimeUpdates, setRealtimeUpdates] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(null);

  const collectDeviceInfo = useCallback(async () => {
    try {
      const browser = Bowser.getParser(window.navigator.userAgent);
      const parsedResult = browser.getResult();

      const getMediaCapabilities = () => {
        const video = document.createElement('video');
        const audio = document.createElement('audio');
        
        return {
          'MP4 Support': video.canPlayType('video/mp4') || 'No',
          'WebM Support': video.canPlayType('video/webm') || 'No',
          'Ogg Support': video.canPlayType('video/ogg') || 'No',
          'H.264 Support': video.canPlayType('video/mp4; codecs="avc1.42E01E"') || 'No',
          'H.265 Support': video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"') || 'No',
          'VP9 Support': video.canPlayType('video/webm; codecs="vp9"') || 'No',
          'AV1 Support': video.canPlayType('video/mp4; codecs="av01.0.05M.08"') || 'No',
          'AAC Support': audio.canPlayType('audio/aac') || 'No',
          'MP3 Support': audio.canPlayType('audio/mpeg') || 'No',
          'Opus Support': audio.canPlayType('audio/ogg; codecs="opus"') || 'No',
          'FLAC Support': audio.canPlayType('audio/flac') || 'No'
        };
      };

      const getWebGLInfo = () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const gl2 = canvas.getContext('webgl2');
        
        if (!gl) return { status: 'WebGL not supported' };

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const extensions = gl.getSupportedExtensions();
        
        return {
          vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
          renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
          version: gl.getParameter(gl.VERSION),
          shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
          webgl2Support: gl2 ? 'Yes' : 'No',
          maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
          maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
          extensionsCount: extensions ? extensions.length : 0,
          extensions: extensions?.slice(0, 10).join(', ') + (extensions?.length > 10 ? '...' : '')
        };
      };

      const getGeolocation = () => {
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            resolve({ status: 'Geolocation not supported' });
          } else {
            const options = {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 600000
            };
            
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  latitude: position.coords.latitude.toFixed(6),
                  longitude: position.coords.longitude.toFixed(6),
                  accuracy: `${position.coords.accuracy} meters`,
                  altitude: position.coords.altitude ? `${position.coords.altitude} meters` : 'Not available',
                  heading: position.coords.heading ? `${position.coords.heading}°` : 'Not available',
                  speed: position.coords.speed ? `${position.coords.speed} m/s` : 'Not available',
                  timestamp: new Date(position.timestamp).toLocaleString()
                });
              },
              (error) => {
                resolve({ 
                  status: `Geolocation error: ${error.message}`,
                  code: error.code 
                });
              },
              options
            );
          }
        });
      };

      const getCameraInfo = async () => {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            return { status: 'Media devices not supported' };
          }
          
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter(device => device.kind === 'videoinput');
          const audioInputs = devices.filter(device => device.kind === 'audioinput');
          const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
          
          return {
            videoDevices: videoInputs.length,
            audioInputDevices: audioInputs.length,
            audioOutputDevices: audioOutputs.length,
            totalDevices: devices.length
          };
        } catch (error) {
          return { status: 'Permission denied or error accessing media devices' };
        }
      };

      const getSensorInfo = () => {
        const sensors = {};
        
        if ('DeviceMotionEvent' in window) {
          sensors.deviceMotion = 'Supported';
        }
        
        if ('DeviceOrientationEvent' in window) {
          sensors.deviceOrientation = 'Supported';
        }
        
        if ('AmbientLightSensor' in window) {
          sensors.ambientLight = 'Supported';
        } else {
          sensors.ambientLight = 'Not supported';
        }
        
        if ('Accelerometer' in window) {
          sensors.accelerometer = 'Supported';
        } else {
          sensors.accelerometer = 'Not supported';
        }
        
        if ('Gyroscope' in window) {
          sensors.gyroscope = 'Supported';
        } else {
          sensors.gyroscope = 'Not supported';
        }
        
        return sensors;
      };

      const getServiceWorkerInfo = () => {
        if ('serviceWorker' in navigator) {
          return {
            supported: 'Yes',
            controller: navigator.serviceWorker.controller ? 'Active' : 'None',
            ready: 'Available'
          };
        }
        return { supported: 'No' };
      };

      const getWebAssemblyInfo = () => {
        if (typeof WebAssembly === 'object') {
          return {
            supported: 'Yes',
            streaming: typeof WebAssembly.instantiateStreaming === 'function' ? 'Yes' : 'No',
            threads: typeof SharedArrayBuffer !== 'undefined' ? 'Likely supported' : 'Not supported'
          };
        }
        return { supported: 'No' };
      };

      const info = {
        'User Agent': window.navigator.userAgent,
        'Platform': window.navigator.platform,
        'Language': window.navigator.language,
        'Languages': window.navigator.languages?.join(', ') || 'Not available',
        'Cookies Enabled': window.navigator.cookieEnabled ? 'Yes' : 'No',
        'Java Enabled': window.navigator.javaEnabled() ? 'Yes' : 'No',
        'Online Status': window.navigator.onLine ? 'Online' : 'Offline',
        'Hardware Concurrency': window.navigator.hardwareConcurrency || 'Not Available',
        'Device Memory (GB)': window.navigator.deviceMemory || 'Not Available',
        'Max Touch Points': window.navigator.maxTouchPoints || 'Not Available',
        
        'Screen Resolution': `${window.screen.width}x${window.screen.height}`,
        'Available Screen Size': `${window.screen.availWidth}x${window.screen.availHeight}`,
        'Color Depth': `${window.screen.colorDepth} bits`,
        'Pixel Depth': `${window.screen.pixelDepth} bits`,
        'Orientation': window.screen.orientation ? window.screen.orientation.type : 'Not available',
        
        'Viewport Size': `${window.innerWidth}x${window.innerHeight}`,
        'Device Pixel Ratio': window.devicePixelRatio,
        'Zoom Level': `${Math.round(window.devicePixelRatio * 100)}%`,
        
        'Connection Type': window.navigator.connection?.effectiveType || 'Not Available',
        'Downlink': window.navigator.connection ? `${window.navigator.connection.downlink} Mbps` : 'Not Available',
        'RTT': window.navigator.connection ? `${window.navigator.connection.rtt} ms` : 'Not Available',
        'Save Data': window.navigator.connection?.saveData ? 'Enabled' : 'Disabled',
        
        'Browser Name': parsedResult.browser.name || 'Not Available',
        'Browser Version': parsedResult.browser.version || 'Not Available',
        'OS Name': parsedResult.os.name || 'Not Available',
        'OS Version': parsedResult.os.version || 'Not Available',
        'Device Type': parsedResult.platform.type || 'Not Available',
        'Manufacturer': parsedResult.device?.vendor || 'Not Available',
        'Model': parsedResult.device?.model || 'Not Available',
        'Engine Name': parsedResult.engine.name || 'Not Available',
        'Engine Version': parsedResult.engine.version || 'Not Available',
        
        'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone || 'Not Available',
        'Timezone Offset': `UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)}`,
        'Locale': navigator.language || 'Not Available',
        'Touch Support': ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? 'Yes' : 'No',
        'Do Not Track': navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack || 'Not Set',
        'PDF Viewer Enabled': navigator.pdfViewerEnabled ? 'Yes' : 'No',
        'Vibration Support': 'vibrate' in navigator ? 'Yes' : 'No',
        
        'Local Storage': typeof(Storage) !== 'undefined' ? 'Supported' : 'Not supported',
        'Session Storage': typeof(Storage) !== 'undefined' ? 'Supported' : 'Not supported',
        'IndexedDB': 'indexedDB' in window ? 'Supported' : 'Not supported',
        'WebSQL': 'openDatabase' in window ? 'Supported' : 'Not supported',
        
        'WebRTC': 'RTCPeerConnection' in window ? 'Supported' : 'Not supported',
        'WebSocket': 'WebSocket' in window ? 'Supported' : 'Not supported',
        'Fetch API': 'fetch' in window ? 'Supported' : 'Not supported',
        'Push API': 'PushManager' in window ? 'Supported' : 'Not supported',
        'Notification API': 'Notification' in window ? 'Supported' : 'Not supported',
        
        'Media Capabilities': getMediaCapabilities(),
        'WebGL Info': getWebGLInfo(),
        'Service Worker': getServiceWorkerInfo(),
        'WebAssembly': getWebAssemblyInfo(),
        'Sensor APIs': getSensorInfo(),
        'Media Devices': await getCameraInfo(),
        'Geolocation': await getGeolocation(),
        
        'Clipboard Data': 'Not Available',
        'Battery Level': 'Not Available',
        'Battery Charging': 'Not Available',
        'Last Updated': new Date().toLocaleString()
      };

      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          info['Battery Level'] = `${Math.round(battery.level * 100)}%`;
          info['Battery Charging'] = battery.charging ? 'Yes' : 'No';
          info['Battery Charging Time'] = battery.chargingTime === Infinity ? 'N/A' : `${Math.round(battery.chargingTime / 60)} minutes`;
          info['Battery Discharging Time'] = battery.dischargingTime === Infinity ? 'N/A' : `${Math.round(battery.dischargingTime / 60)} minutes`;
        } catch (error) {
          console.log('Battery API error:', error);
        }
      }

      setDeviceInfo(info);
    } catch (error) {
      console.error('Device info collection error:', error);
    }
  }, []);

  const readClipboard = async () => {
    if (!navigator.clipboard) {
      alert('Clipboard API not supported in your browser.');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      setDeviceInfo((prevInfo) => ({
        ...prevInfo,
        'Clipboard Data': text || 'No data in clipboard',
      }));
    } catch (err) {
      alert('Failed to read clipboard contents: ' + err);
      setDeviceInfo((prevInfo) => ({
        ...prevInfo,
        'Clipboard Data': 'Permission denied or no data available',
      }));
    }
  };

  const toggleRealtimeUpdates = useCallback(() => {
    setRealtimeUpdates(prev => {
      const newState = !prev;
      
      if (newState) {
        const interval = setInterval(() => {
          collectDeviceInfo();
        }, 5000);
        setUpdateInterval(interval);
      } else {
        if (updateInterval) {
          clearInterval(updateInterval);
          setUpdateInterval(null);
        }
      }
      
      return newState;
    });
  }, [updateInterval, collectDeviceInfo]);

  useEffect(() => {
    collectDeviceInfo();
    
    const handleOnlineStatus = () => {
      setDeviceInfo(prev => prev ? {
        ...prev,
        'Online Status': window.navigator.onLine ? 'Online' : 'Offline',
        'Last Updated': new Date().toLocaleString()
      } : null);
    };

    const handleResize = () => {
      setDeviceInfo(prev => prev ? {
        ...prev,
        'Viewport Size': `${window.innerWidth}x${window.innerHeight}`,
        'Last Updated': new Date().toLocaleString()
      } : null);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener('resize', handleResize);
      
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [collectDeviceInfo, updateInterval]);

  return { 
    deviceInfo, 
    readClipboard, 
    realtimeUpdates, 
    toggleRealtimeUpdates,
    refreshData: collectDeviceInfo 
  };
};

export default useEnhancedDeviceInfo;