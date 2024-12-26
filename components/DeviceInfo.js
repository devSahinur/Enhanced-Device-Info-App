'use client';
// components/DeviceInfo.js

import React from 'react';
import useDeviceInfo from '../hooks/useDeviceInfo';

const DeviceInfo = () => {
  const deviceInfo = useDeviceInfo();

  if (!deviceInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading device information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Your Device Information</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <tbody>
            {Object.entries(deviceInfo).map(([key, value]) => (
              <tr key={key} className="border-b">
                <th className="text-left px-4 py-2 font-medium text-gray-700">{key}</th>
                <td className="px-4 py-2 text-gray-600">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceInfo;
