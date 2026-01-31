import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { siteConfig } from './branding';

export const exportToCSV = (data: any[], filename: string, headers: { key: string; label: string }[]) => {
    const csvContent = [
        headers.map(h => h.label).join(','),
        ...data.map(row => headers.map(h => {
            const val = row[h.key];
            // Handle dates or specific formatting if needed, otherwise just stringify
            return `"${val === undefined || val === null ? '' : val}"`;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const exportToPDF = async (elementId: string, filename: string, title: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Improve quality
            backgroundColor: '#ffffff',
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Branding Header
        pdf.setFillColor(243, 244, 246); // bg-gray-100
        pdf.rect(0, 0, pdfWidth, 20, 'F');

        pdf.setTextColor(234, 88, 12); // text-orange-600
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(siteConfig.logoText, 10, 13);

        pdf.setTextColor(107, 114, 128); // text-gray-500
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(new Date().toLocaleDateString(), pdfWidth - 10, 13, { align: 'right' });

        // Content Title
        pdf.setTextColor(17, 24, 39); // text-gray-900
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, 10, 30);

        // Image
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * (pdfWidth - 20)) / imgProps.width;

        // Check if image height exceeds page
        // Check if image height exceeds page
        if (imgHeight > (pdfHeight - 40)) {
            // Scale to fit page height minus margins (40mm total vertical margin)
            const scaleFactor = (pdfHeight - 40) / imgHeight;
            const scaledWidth = (pdfWidth - 20) * scaleFactor;
            const scaledHeight = imgHeight * scaleFactor;
            // Center horizontally if scaled down
            const xPos = 10 + ((pdfWidth - 20) - scaledWidth) / 2;
            pdf.addImage(imgData, 'PNG', xPos, 35, scaledWidth, scaledHeight);
        } else {
            pdf.addImage(imgData, 'PNG', 10, 35, pdfWidth - 20, imgHeight);
        }

        // Branding Footer
        pdf.setTextColor(156, 163, 175); // text-gray-400
        pdf.setFontSize(8);
        pdf.text(siteConfig.footerText, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
        pdf.text(siteConfig.url, pdfWidth / 2, pdfHeight - 6, { align: 'center' });

        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
