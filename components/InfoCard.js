// components/InfoCard.js

import React from 'react';

const InfoCard = ({ icon: Icon, title, children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
      <div className="flex items-center mb-2 sm:mb-4">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mr-2" />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default InfoCard;
