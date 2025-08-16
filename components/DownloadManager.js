'use client';
import React, { useState } from 'react';
import { 
  DocumentArrowDownIcon, 
  DocumentTextIcon,
  TableCellsIcon,
  DocumentIcon 
} from '@heroicons/react/24/solid';

const DownloadManager = ({ deviceInfo, performanceData }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const generateCSV = (data) => {
    const headers = ['Property', 'Value'];
    const rows = [headers];
    
    Object.entries(data).forEach(([key, value]) => {
      let formattedValue = value;
      if (typeof value === 'object' && value !== null) {
        formattedValue = JSON.stringify(value);
      }
      rows.push([key, formattedValue]);
    });
    
    return rows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };

  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = async () => {
    setIsDownloading(true);
    try {
      const exportData = {
        deviceInfo,
        performanceData,
        exportTime: new Date().toISOString(),
        version: '2.0'
      };
      
      const content = JSON.stringify(exportData, null, 2);
      downloadFile(content, `device-info-${Date.now()}.json`, 'application/json');
    } catch (error) {
      console.error('JSON download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    try {
      const csvContent = generateCSV(deviceInfo);
      downloadFile(csvContent, `device-info-${Date.now()}.csv`, 'text/csv');
    } catch (error) {
      console.error('CSV download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      let yPosition = 20;

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Device Information Report', 105, yPosition, { align: 'center' });
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleString()}`, 105, yPosition, { align: 'center' });
      yPosition += 20;

      const categories = {
        'Basic Information': ['User Agent', 'Platform', 'Language', 'Languages', 'Cookies Enabled', 'Java Enabled'],
        'Hardware Information': ['Hardware Concurrency', 'Device Memory (GB)', 'Number of Logical Processors', 'Device Memory'],
        'Screen Information': ['Screen Resolution', 'Available Screen Size', 'Color Depth', 'Pixel Depth', 'Viewport Size', 'Device Pixel Ratio'],
        'Network Information': ['Connection Type', 'Downlink'],
        'Browser Details': ['Browser Name', 'Browser Version', 'OS Name', 'OS Version', 'Device Type', 'Manufacturer', 'Model'],
        'Additional Information': ['Timezone', 'Locale', 'Touch Support', 'Do Not Track', 'Media Capabilities', 'Geolocation', 'WebGL Info', 'Battery Level', 'Battery Charging']
      };

      Object.entries(categories).forEach(([category, keys]) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(category, 20, yPosition);
        yPosition += 10;

        const tableData = keys
          .filter(key => deviceInfo[key] !== undefined)
          .map(key => [
            key,
            typeof deviceInfo[key] === 'object' 
              ? JSON.stringify(deviceInfo[key]) 
              : String(deviceInfo[key])
          ]);

        if (tableData.length > 0) {
          doc.autoTable({
            startY: yPosition,
            head: [['Property', 'Value']],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [59, 130, 246] },
            columnStyles: {
              0: { cellWidth: 60 },
              1: { cellWidth: 120 }
            },
            margin: { left: 20, right: 20 }
          });
          
          yPosition = doc.lastAutoTable.finalY + 15;
        }
      });

      if (performanceData) {
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Performance Data', 20, yPosition);
        yPosition += 10;

        const perfData = [
          ['CPU Usage', `${performanceData.cpuUsage}%`],
          ['Frame Rate', `${performanceData.frameRate} FPS`],
          ['Network Speed', `${performanceData.networkSpeed} Kbps`],
          ['Throttling', performanceData.throttling ? 'Yes' : 'No']
        ];

        if (performanceData.memoryUsage) {
          perfData.push(['Memory Usage', `${performanceData.memoryUsage.percentage}%`]);
        }

        if (performanceData.storageInfo) {
          perfData.push(['Storage Usage', `${performanceData.storageInfo.percentage}%`]);
        }

        doc.autoTable({
          startY: yPosition,
          head: [['Metric', 'Value']],
          body: perfData,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [16, 185, 129] },
          margin: { left: 20, right: 20 }
        });
      }

      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text('Generated by Enhanced Device Info App', 105, 285, { align: 'center' });

      doc.save(`device-info-report-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadTXT = async () => {
    setIsDownloading(true);
    try {
      let content = `DEVICE INFORMATION REPORT\n`;
      content += `Generated: ${new Date().toLocaleString()}\n`;
      content += `${'='.repeat(50)}\n\n`;

      Object.entries(deviceInfo).forEach(([key, value]) => {
        let formattedValue = value;
        if (typeof value === 'object' && value !== null) {
          formattedValue = JSON.stringify(value, null, 2);
        }
        content += `${key}: ${formattedValue}\n`;
      });

      if (performanceData) {
        content += `\n${'='.repeat(50)}\n`;
        content += `PERFORMANCE DATA\n`;
        content += `${'='.repeat(50)}\n\n`;
        content += `CPU Usage: ${performanceData.cpuUsage}%\n`;
        content += `Frame Rate: ${performanceData.frameRate} FPS\n`;
        content += `Network Speed: ${performanceData.networkSpeed} Kbps\n`;
        content += `Throttling: ${performanceData.throttling ? 'Yes' : 'No'}\n`;
        
        if (performanceData.memoryUsage) {
          content += `Memory Usage: ${performanceData.memoryUsage.percentage}%\n`;
        }
        
        if (performanceData.storageInfo) {
          content += `Storage Usage: ${performanceData.storageInfo.percentage}%\n`;
        }
      }

      downloadFile(content, `device-info-${Date.now()}.txt`, 'text/plain');
    } catch (error) {
      console.error('TXT download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadOptions = [
    {
      label: 'JSON',
      icon: DocumentTextIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      handler: handleDownloadJSON,
      description: 'Structured data format'
    },
    {
      label: 'CSV',
      icon: TableCellsIcon,
      color: 'bg-green-600 hover:bg-green-700',
      handler: handleDownloadCSV,
      description: 'Spreadsheet compatible'
    },
    {
      label: 'PDF',
      icon: DocumentIcon,
      color: 'bg-red-600 hover:bg-red-700',
      handler: handleDownloadPDF,
      description: 'Formatted report'
    },
    {
      label: 'TXT',
      icon: DocumentArrowDownIcon,
      color: 'bg-gray-600 hover:bg-gray-700',
      handler: handleDownloadTXT,
      description: 'Plain text format'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <DocumentArrowDownIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Export Data</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
        Download your device information and performance data in various formats
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {downloadOptions.map((option) => (
          <button
            key={option.label}
            onClick={option.handler}
            disabled={isDownloading}
            className={`${option.color} text-white p-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:scale-105 focus-ring group`}
            title={option.description}
          >
            <option.icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-medium">{option.label}</div>
            <div className="text-xs opacity-80 mt-1">{option.description}</div>
          </button>
        ))}
      </div>

      {isDownloading && (
        <div className="mt-4 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          <span className="text-sm">Preparing download...</span>
        </div>
      )}
    </div>
  );
};

export default DownloadManager;