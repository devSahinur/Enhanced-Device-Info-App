export const sanitizeData = (data) => {
  if (typeof data === 'string') {
    return data
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[sanitizeData(key)] = sanitizeData(value);
    }
    return sanitized;
  }
  
  return data;
};

export const anonymizeIP = (ip) => {
  if (!ip || typeof ip !== 'string') return 'Hidden';
  
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  
  return 'Hidden';
};

export const anonymizeLocation = (location) => {
  if (!location || typeof location !== 'object') return location;
  
  const anonymized = { ...location };
  
  if (anonymized.latitude) {
    anonymized.latitude = parseFloat(anonymized.latitude).toFixed(1) + ' (±0.5)';
  }
  
  if (anonymized.longitude) {
    anonymized.longitude = parseFloat(anonymized.longitude).toFixed(1) + ' (±0.5)';
  }
  
  return anonymized;
};

export const hashSensitiveData = async (data) => {
  if (!data || typeof data !== 'string') return data;
  
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0, 8) + '...';
  } catch (error) {
    return 'hashed_data';
  }
};

export const isSecureContext = () => {
  return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

export const validatePermissions = (requiredPermissions) => {
  const permissions = {
    geolocation: 'geolocation' in navigator,
    camera: 'mediaDevices' in navigator,
    clipboard: 'clipboard' in navigator,
    battery: 'getBattery' in navigator,
    notifications: 'Notification' in window
  };
  
  return requiredPermissions.every(permission => permissions[permission]);
};

export const encryptData = async (data, password) => {
  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = encoder.encode(JSON.stringify(data));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encodedData
    );
    
    return {
      data: Array.from(new Uint8Array(encrypted)),
      salt: Array.from(salt),
      iv: Array.from(iv)
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

export const createSecurityReport = (deviceInfo) => {
  const securityFeatures = {
    secureContext: isSecureContext(),
    webCrypto: 'crypto' in window && 'subtle' in crypto,
    csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
    https: window.location.protocol === 'https:',
    cookieSecure: document.cookie.includes('Secure'),
    localStorage: typeof(Storage) !== 'undefined',
    webAssembly: typeof WebAssembly === 'object',
    serviceWorker: 'serviceWorker' in navigator
  };
  
  const privacyFeatures = {
    doNotTrack: navigator.doNotTrack === '1',
    thirdPartyCookies: !navigator.cookieEnabled,
    geolocationPrompt: 'geolocation' in navigator,
    cameraPrompt: 'mediaDevices' in navigator,
    notificationPrompt: 'Notification' in window
  };
  
  return {
    security: securityFeatures,
    privacy: privacyFeatures,
    recommendations: generateSecurityRecommendations(securityFeatures, privacyFeatures)
  };
};

const generateSecurityRecommendations = (security, privacy) => {
  const recommendations = [];
  
  if (!security.https) {
    recommendations.push('Use HTTPS for secure data transmission');
  }
  
  if (!security.secureContext) {
    recommendations.push('Access from a secure context for full API availability');
  }
  
  if (!privacy.doNotTrack) {
    recommendations.push('Consider enabling Do Not Track in browser settings');
  }
  
  if (!security.csp) {
    recommendations.push('Implement Content Security Policy for XSS protection');
  }
  
  return recommendations;
};