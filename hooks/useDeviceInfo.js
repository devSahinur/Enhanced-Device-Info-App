'use client';
// hooks/useDeviceInfo.js
import { useState, useEffect } from 'react';
import Bowser from 'bowser';

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const parsedResult = browser.getResult();

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
    };

    // Additional APIs
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        info["Battery Level"] = `${Math.round(battery.level * 100)}%`;
        info["Battery Charging"] = battery.charging ? 'Yes' : 'No';
        setDeviceInfo(info);
      }).catch(() => {
        setDeviceInfo(info);
      });
    } else {
      setDeviceInfo(info);
    }
  }, []);

  return deviceInfo;
};

export default useDeviceInfo;
