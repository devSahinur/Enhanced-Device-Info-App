import React from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/solid';

const InfoTable = ({ data, searchTerm = '' }) => {
  const highlightText = (text, search) => {
    if (!search || typeof text !== 'string') return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </span>
      ) : part
    );
  };

  const getStatusIcon = (value) => {
    if (typeof value !== 'string') return null;
    
    const lowerValue = value.toLowerCase();
    
    if (lowerValue.includes('yes') || lowerValue.includes('supported') || 
        lowerValue.includes('enabled') || lowerValue.includes('online') ||
        lowerValue === 'true') {
      return <CheckCircleIcon className="w-4 h-4 text-green-500 inline mr-1" />;
    }
    
    if (lowerValue.includes('no') || lowerValue.includes('not supported') || 
        lowerValue.includes('disabled') || lowerValue.includes('offline') ||
        lowerValue === 'false') {
      return <XCircleIcon className="w-4 h-4 text-red-500 inline mr-1" />;
    }
    
    if (lowerValue.includes('error') || lowerValue.includes('failed') ||
        lowerValue.includes('denied')) {
      return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500 inline mr-1" />;
    }
    
    return <InformationCircleIcon className="w-4 h-4 text-blue-500 inline mr-1" />;
  };

  const formatValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto max-w-md">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }
    
    const stringValue = String(value);
    
    if (stringValue.length > 100) {
      return (
        <div className="max-w-md">
          <details className="cursor-pointer">
            <summary className="text-blue-600 dark:text-blue-400 hover:underline">
              {stringValue.substring(0, 100)}... (click to expand)
            </summary>
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm break-all">
              {highlightText(stringValue, searchTerm)}
            </div>
          </details>
        </div>
      );
    }
    
    return (
      <span className="break-all">
        {getStatusIcon(stringValue)}
        {highlightText(stringValue, searchTerm)}
      </span>
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map(([key, value], index) => (
              <tr 
                key={`${key}-${index}`} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap bg-gray-50 dark:bg-gray-700/50 w-1/3">
                  <span className="flex items-center">
                    {highlightText(key, searchTerm)}
                  </span>
                </th>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 w-2/3">
                  {formatValue(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoTable;
