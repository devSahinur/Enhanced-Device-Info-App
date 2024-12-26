// components/InfoTable.js

import React from 'react';

const InfoTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody>
          {data.map(([key, value]) => (
            <tr key={key} className="hover:bg-gray-50">
              <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                {key}
              </th>
              <td className="px-2 sm:px-4 py-2 text-sm sm:text-base text-gray-600">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InfoTable;
