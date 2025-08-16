'use client';
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  ShieldExclamationIcon,
  LockClosedIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/solid';
import { createSecurityReport } from '@/utils/security';

const SecurityDashboard = ({ deviceInfo }) => {
  const [securityReport, setSecurityReport] = useState(null);

  useEffect(() => {
    if (deviceInfo) {
      const report = createSecurityReport(deviceInfo);
      setSecurityReport(report);
    }
  }, [deviceInfo]);

  if (!securityReport) {
    return <div className="text-gray-500">Generating security report...</div>;
  }

  const SecurityItem = ({ label, status, description }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center">
        {status ? (
          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
        ) : (
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-3" />
        )}
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{label}</div>
          {description && (
            <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
          )}
        </div>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded ${
        status 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}>
        {status ? 'Secure' : 'At Risk'}
      </span>
    </div>
  );

  const calculateSecurityScore = () => {
    const totalFeatures = Object.keys(securityReport.security).length + Object.keys(securityReport.privacy).length;
    const secureFeatures = Object.values(securityReport.security).filter(Boolean).length + 
                          Object.values(securityReport.privacy).filter(Boolean).length;
    return Math.round((secureFeatures / totalFeatures) * 100);
  };

  const securityScore = calculateSecurityScore();

  return (
    <div className="space-y-6">
      
      {/* Security Score */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Security Score</h3>
            <div className="text-3xl font-bold">{securityScore}%</div>
            <p className="text-blue-100 text-sm">
              {securityScore >= 80 ? 'Excellent security posture' :
               securityScore >= 60 ? 'Good security, some improvements needed' :
               'Security needs attention'}
            </p>
          </div>
          <div className="text-right">
            {securityScore >= 80 ? (
              <ShieldCheckIcon className="w-16 h-16 text-green-300" />
            ) : (
              <ShieldExclamationIcon className="w-16 h-16 text-yellow-300" />
            )}
          </div>
        </div>
        
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${securityScore}%` }}
          />
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <LockClosedIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Security Features</h3>
        </div>
        
        <div className="space-y-3">
          <SecurityItem 
            label="Secure Context (HTTPS)"
            status={securityReport.security.secureContext}
            description="Enables secure APIs and encrypted communication"
          />
          <SecurityItem 
            label="Web Crypto API"
            status={securityReport.security.webCrypto}
            description="Supports cryptographic operations"
          />
          <SecurityItem 
            label="Content Security Policy"
            status={securityReport.security.csp}
            description="Protects against XSS attacks"
          />
          <SecurityItem 
            label="Secure Cookies"
            status={securityReport.security.cookieSecure}
            description="Cookies transmitted over HTTPS only"
          />
          <SecurityItem 
            label="Service Worker Support"
            status={securityReport.security.serviceWorker}
            description="Enables offline functionality and caching"
          />
        </div>
      </div>

      {/* Privacy Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <EyeSlashIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Privacy Controls</h3>
        </div>
        
        <div className="space-y-3">
          <SecurityItem 
            label="Do Not Track"
            status={securityReport.privacy.doNotTrack}
            description="Signals preference not to be tracked"
          />
          <SecurityItem 
            label="Geolocation Permission"
            status={securityReport.privacy.geolocationPrompt}
            description="Location access requires user permission"
          />
          <SecurityItem 
            label="Camera/Microphone Permission"
            status={securityReport.privacy.cameraPrompt}
            description="Media device access requires user permission"
          />
          <SecurityItem 
            label="Notification Permission"
            status={securityReport.privacy.notificationPrompt}
            description="Notifications require user permission"
          />
        </div>
      </div>

      {/* Recommendations */}
      {securityReport.recommendations.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Security Recommendations</h3>
          </div>
          
          <ul className="space-y-2">
            {securityReport.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-yellow-800 dark:text-yellow-200 text-sm">
                  {recommendation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Protection Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-start">
          <ShieldCheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Data Protection</h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>✓ All data processing occurs locally in your browser</p>
              <p>✓ No personal information is transmitted to external servers</p>
              <p>✓ Sensitive data can be anonymized or encrypted before export</p>
              <p>✓ Location data is approximated to protect precise coordinates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;