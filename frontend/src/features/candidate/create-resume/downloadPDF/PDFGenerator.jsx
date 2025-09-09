import { Download } from "lucide-react";

const PDFGenerator = ({
  resumeRef,
  currentResumeData,
  pages,
  isPreviewMode,
  isGeneratingPreview,
  A4_WIDTH,
  A4_HEIGHT,
  MARGIN,
  CONTENT_WIDTH,
  CONTENT_HEIGHT,
}) => {
  // Optimize image for PDF with smart compression
  const optimizeImageForPDF = (canvas, quality = 0.92) => {
    // Create a new canvas with better rendering
    const optimizedCanvas = document.createElement('canvas');
    const ctx = optimizedCanvas.getContext('2d');
    
    // Set canvas size
    optimizedCanvas.width = canvas.width;
    optimizedCanvas.height = canvas.height;
    
    // Enable better image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, optimizedCanvas.width, optimizedCanvas.height);
    
    // Draw the original canvas
    ctx.drawImage(canvas, 0, 0);
    
    // Return JPEG with high quality
    return optimizedCanvas.toDataURL('image/jpeg', quality);
  };

  const downloadPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).jsPDF;
      const html2canvas = (await import("html2canvas")).default;

      if (isPreviewMode && pages.length > 0) {
        // Use existing preview pages for PDF generation
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
          compress: true,
          precision: 2,
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;

        for (let i = 0; i < pages.length; i++) {
          if (i > 0) {
            pdf.addPage();
          }

          // Convert PNG to optimized JPEG for smaller file size
          const img = new Image();
          img.src = pages[i];
          
          await new Promise((resolve) => {
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
              
              // Fill white background
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Draw image
              ctx.drawImage(img, 0, 0);
              
              // Get optimized image
              const optimizedImage = optimizeImageForPDF(canvas, 0.9);
              
              pdf.addImage(
                optimizedImage,
                "JPEG",
                margin,
                margin,
                pageWidth - margin * 2,
                pageHeight - margin * 2,
                undefined,
                "MEDIUM"
              );
              
              resolve();
            };
          });
        }

        const fileName = `${currentResumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`;
        pdf.save(fileName);
        return;
      }

      // Generate PDF directly from DOM element
      const elementToCapture = resumeRef.current;

      // Disable animations during capture
      const style = document.createElement("style");
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      `;
      document.head.appendChild(style);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
        compress: true,
        precision: 2,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // Create high-quality canvas with optimal settings
      const canvas = await html2canvas(elementToCapture, {
        scale: 2.5, // High quality scale
        useCORS: true,
        backgroundColor: "#ffffff",
        width: CONTENT_WIDTH,
        height: elementToCapture.scrollHeight,
        logging: false,
        allowTaint: false,
        foreignObjectRendering: false,
        removeContainer: false,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Ensure fonts are loaded in cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              text-rendering: optimizeLegibility;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let currentHeight = 0;

      while (currentHeight < imgHeight) {
        if (currentHeight > 0) {
          pdf.addPage();
        }

        const remainingHeight = imgHeight - currentHeight;
        const pageContentHeight = Math.min(remainingHeight, pageHeight - margin * 2);

        // Create page canvas with high quality
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = (pageContentHeight * canvas.width) / imgWidth;

        const pageCtx = pageCanvas.getContext("2d");
        
        // Enable high quality rendering
        pageCtx.imageSmoothingEnabled = true;
        pageCtx.imageSmoothingQuality = 'high';

        pageCtx.drawImage(
          canvas,
          0,
          (currentHeight * canvas.width) / imgWidth,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );

        // Optimize the page image
        const optimizedPageImage = optimizeImageForPDF(pageCanvas, 0.9);
        
        pdf.addImage(
          optimizedPageImage,
          "JPEG",
          margin,
          margin,
          imgWidth,
          pageContentHeight,
          undefined,
          "MEDIUM"
        );

        currentHeight += pageContentHeight;
      }

      document.head.removeChild(style);

      const fileName = `${currentResumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <button
      onClick={downloadPDF}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-md"
      disabled={isGeneratingPreview}
    >
      <Download className="w-4 h-4" />
      Download PDF
    </button>
  );
};

export default PDFGenerator;