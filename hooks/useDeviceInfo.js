// hooks/useDeviceInfo.js

'use client';
import { useState, useEffect } from 'react';
import Bowser from 'bowser';

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [clipboardData, setClipboardData] = useState(null);

  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const parsedResult = browser.getResult();

    const getMediaCapabilities = () => {
      const video = document.createElement('video');
      const audio = document.createElement('audio');
      
      return {
        'MP4 Support': video.canPlayType('video/mp4') || 'No',
        'WebM Support': video.canPlayType('video/webm') || 'No',
        'Ogg Support': video.canPlayType('video/ogg') || 'No',
        'AAC Support': audio.canPlayType('audio/aac') || 'No',
        'MP3 Support': audio.canPlayType('audio/mpeg') || 'No',
        'Opus Support': audio.canPlayType('audio/ogg; codecs="opus"') || 'No',
      };
    };

    const getWebGLInfo = () => {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        return 'WebGL not supported';
      }
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
      return { Vendor: vendor, Renderer: renderer };
    };

    const getGeolocation = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          resolve('Geolocation not supported');
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                Latitude: position.coords.latitude,
                Longitude: position.coords.longitude,
                Accuracy: `${position.coords.accuracy} meters`,
              });
            },
            (error) => {
              resolve(`Geolocation error: ${error.message}`);
            }
          );
        }
      });
    };

    const info = {
      /** Basic Navigator Info **/
      "User Agent": window.navigator.userAgent,
      "Platform": window.navigator.platform,
      "Language": window.navigator.language,
      "Languages": window.navigator.languages.join(', '),
      "Cookies Enabled": window.navigator.cookieEnabled ? 'Yes' : 'No',
      "Java Enabled": window.navigator.javaEnabled() ? 'Yes' : 'No',
      "Hardware Concurrency": window.navigator.hardwareConcurrency || 'Not Available',
      "Device Memory (GB)": window.navigator.deviceMemory || 'Not Available',

      /** Screen Information **/
      "Screen Resolution": `${window.screen.width}x${window.screen.height}`,
      "Available Screen Size": `${window.screen.availWidth}x${window.screen.availHeight}`,
      "Color Depth": `${window.screen.colorDepth} bits`,
      "Pixel Depth": `${window.screen.pixelDepth} bits`,

      /** Window Information **/
      "Viewport Size": `${window.innerWidth}x${window.innerHeight}`,
      "Device Pixel Ratio": window.devicePixelRatio,

      /** Performance **/
      "Number of Logical Processors": window.navigator.hardwareConcurrency || 'Not Available',
      "Device Memory": window.navigator.deviceMemory || 'Not Available',

      /** Network Information **/
      "Connection Type": window.navigator.connection ? window.navigator.connection.effectiveType : 'Not Available',
      "Downlink": window.navigator.connection ? `${window.navigator.connection.downlink} Mbps` : 'Not Available',

      /** Browser Details (Using Bowser) **/
      "Browser Name": parsedResult.browser.name || 'Not Available',
      "Browser Version": parsedResult.browser.versionName || 'Not Available',
      "OS Name": parsedResult.os.name || 'Not Available',
      "OS Version": parsedResult.os.versionName || 'Not Available',
      "Device Type": parsedResult.platform.type || 'Not Available',
      "Manufacturer": parsedResult.device?.vendor || 'Not Available',
      "Model": parsedResult.device?.model || 'Not Available',

      /** Timezone and Locale **/
      "Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone || 'Not Available',
      "Locale": navigator.language || 'Not Available',

      /** Touch Support **/
      "Touch Support": ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? 'Yes' : 'No',

      /** Do Not Track **/
      "Do Not Track": navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack || 'Not Available',

      /** Media Capabilities **/
      "Media Capabilities": getMediaCapabilities(),
      
      /** Geolocation **/
      "Geolocation": 'Not Available', // Will be updated after permission

      /** WebGL Information **/
      "WebGL Info": getWebGLInfo(),
      
      /** Clipboard Data **/
      "Clipboard Data": 'Not Available', // Will be updated upon user request
    };

    // Fetch Geolocation
    getGeolocation().then((geoInfo) => {
      info["Geolocation"] = geoInfo;
      setDeviceInfo(info);
    }).catch(() => {
      setDeviceInfo(info);
    });

    // Battery Status API with event listeners
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        const updateBatteryInfo = () => {
          setDeviceInfo((prevInfo) => ({
            ...prevInfo,
            "Battery Level": `${Math.round(battery.level * 100)}%`,
            "Battery Charging": battery.charging ? 'Yes' : 'No',
          }));
        };

        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);

        // Initial battery info
        updateBatteryInfo();

        // Cleanup listeners on unmount
        return () => {
          battery.removeEventListener('levelchange', updateBatteryInfo);
          battery.removeEventListener('chargingchange', updateBatteryInfo);
        };
      }).catch(() => {
        setDeviceInfo(info);
      });
    } else {
      setDeviceInfo(info);
    }
  }, []);

  // Function to read clipboard data
  const readClipboard = async () => {
    if (!navigator.clipboard) {
      alert('Clipboard API not supported in your browser.');
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      setClipboardData(text);
      setDeviceInfo((prevInfo) => ({
        ...prevInfo,
        "Clipboard Data": text || 'No data in clipboard',
      }));
    } catch (err) {
      alert('Failed to read clipboard contents: ' + err);
      setDeviceInfo((prevInfo) => ({
        ...prevInfo,
        "Clipboard Data": 'Permission denied or no data available',
      }));
    }
  };

  return { deviceInfo, readClipboard, clipboardData };
};

export default useDeviceInfo;
