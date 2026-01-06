/**
 * Utility function to export dashboard content as PDF
 * Uses the browser's print functionality for better compatibility
 */

export const exportToPDF = (
  title: string,
  isDarkMode: boolean,
  elementId?: string
) => {
  // Create a hidden iframe for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Veuillez autoriser les popups pour exporter en PDF');
    return;
  }

  // Get the content to export
  const content = elementId 
    ? document.getElementById(elementId)?.innerHTML 
    : document.querySelector('main')?.innerHTML;

  if (!content) {
    alert('Impossible de trouver le contenu à exporter');
    printWindow.close();
    return;
  }

  // Create HTML document for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
            padding: 40px;
            background: ${isDarkMode ? '#000' : '#fff'};
            color: ${isDarkMode ? '#fff' : '#000'};
          }
          
          h1, h2, h3, h4, h5, h6 {
            margin-bottom: 16px;
            color: ${isDarkMode ? '#fff' : '#111'};
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid ${isDarkMode ? '#333' : '#e5e7eb'};
          }
          
          .header h1 {
            font-size: 32px;
            margin-bottom: 8px;
          }
          
          .header p {
            color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
            font-size: 14px;
          }
          
          .grid {
            display: grid;
            gap: 24px;
            margin-bottom: 24px;
          }
          
          .card {
            background: ${isDarkMode ? '#1f2937' : '#fff'};
            border: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
            border-radius: 12px;
            padding: 24px;
            break-inside: avoid;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
          }
          
          th {
            background: ${isDarkMode ? '#374151' : '#f9fafb'};
            font-weight: 600;
          }
          
          .stat-card {
            padding: 20px;
            background: ${isDarkMode ? '#1f2937' : '#f9fafb'};
            border-radius: 8px;
            margin-bottom: 16px;
          }
          
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 14px;
            color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
          }
          
          .chart-placeholder {
            background: ${isDarkMode ? '#111827' : '#f3f4f6'};
            border: 1px solid ${isDarkMode ? '#374151' : '#e5e7eb'};
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
            margin: 16px 0;
          }
          
          @media print {
            body {
              padding: 20px;
            }
            
            .no-print {
              display: none !important;
            }
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid ${isDarkMode ? '#333' : '#e5e7eb'};
            text-align: center;
            font-size: 12px;
            color: ${isDarkMode ? '#6b7280' : '#9ca3af'};
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Généré le ${new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        <div id="content">
          ${content}
        </div>
        
        <div class="footer">
          <p>ZOORA Admin Dashboard - Document confidentiel</p>
        </div>
      </body>
    </html>
  `;

  // Write content to the new window
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing or canceling
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 250);
  };
};

/**
 * Simple export function for data tables
 */
export const exportDataToCSV = (
  data: any[],
  filename: string,
  headers?: string[]
) => {
  if (!data || data.length === 0) {
    alert('Aucune donnée à exporter');
    return;
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = csvHeaders.join(',') + '\n';
  
  data.forEach(row => {
    const values = csvHeaders.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes
      return typeof value === 'string' && (value.includes(',') || value.includes('"'))
        ? `"${value.replace(/"/g, '""')}"`
        : value;
    });
    csvContent += values.join(',') + '\n';
  });

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
