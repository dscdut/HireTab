"use client"

import { useRef, useState, useEffect } from "react"
import { Eye, FileText, ZoomIn, ZoomOut } from "lucide-react"
import ModernTemplate from "../templates/ModernTemplate"
import MinimalistTemplate from "../templates/MinimalistTemplate"
import ClassicTemplate from "../templates/ClassicTemplate"
import PDFGenerator from "../downloadPDF/PDFGenerator"
import PreviewPages from "../downloadPDF/PreviewPages"
import ResumeOptimizer from "../downloadPDF/ResumeOptimizer"

export default function ResumePreview({
  resumeData,
  template = "modern",
  colorScheme = "gray",
  onEditPersonalInfo,
  onEditExperience,
  onEditEducation,
  onEditSkills,
  onEditCertifications,
  onEditProjects,
}) {
  const resumeRef = useRef(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [pages, setPages] = useState([])
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [optimizedResumeData, setOptimizedResumeData] = useState(null)

  // A4 dimensions in pixels (at 96 DPI)
  const A4_WIDTH = 794
  const A4_HEIGHT = 1123
  const MARGIN = 40
  const CONTENT_WIDTH = A4_WIDTH - (MARGIN * 2)
  const CONTENT_HEIGHT = A4_HEIGHT - (MARGIN * 2)

  // Get the resume data to display (optimized if available, otherwise original)
  const currentResumeData = optimizedResumeData || resumeData;

  const generatePreview = async () => {
    if (!resumeRef.current) return;

    setIsGeneratingPreview(true);

    try {
      const html2canvas = (await import("html2canvas")).default;

      // Create temporary container with exact A4 content dimensions
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: ${CONTENT_WIDTH}px;
        background-color: white;
        font-family: inherit;
        line-height: inherit;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      `;

      // Clone the resume content
      const resumeContent = resumeRef.current.cloneNode(true);
      tempContainer.appendChild(resumeContent);
      document.body.appendChild(tempContainer);

      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 200));

      // Get total height of content
      const totalHeight = tempContainer.scrollHeight;
      const pageContentHeight = CONTENT_HEIGHT;

      // Calculate how many pages we need
      const numPages = Math.ceil(totalHeight / pageContentHeight);

      const generatedPages = [];

      // Generate each page with high quality settings
      for (let pageIndex = 0; pageIndex < numPages; pageIndex++) {
        const currentPageTop = pageIndex * pageContentHeight;

        // Create a page container
        const pageContainer = document.createElement('div');
        pageContainer.style.cssText = `
          position: relative;
          width: ${CONTENT_WIDTH}px;
          height: ${pageContentHeight}px;
          background-color: white;
          overflow: hidden;
          padding: 0;
          margin: 0;
          box-sizing: border-box;
        `;

        // Clone content for this page with offset
        const pageContent = tempContainer.cloneNode(true);
        pageContent.style.cssText = `
          position: absolute;
          top: -${currentPageTop}px;
          left: 0;
          width: ${CONTENT_WIDTH}px;
          margin: 0;
          padding: 0;
        `;

        pageContainer.appendChild(pageContent);
        document.body.appendChild(pageContainer);

        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 100));

        // Capture the page with optimized settings for quality
        const pageCanvas = await html2canvas(pageContainer, {
          scale: 2, // High resolution for quality
          useCORS: true,
          backgroundColor: "#ffffff",
          width: CONTENT_WIDTH,
          height: pageContentHeight,
          x: 0,
          y: 0,
          logging: false,
          allowTaint: false,
          removeContainer: false,
          foreignObjectRendering: false,
        });

        // Use PNG for preview (better quality display)
        const pageDataUrl = pageCanvas.toDataURL('image/png');
        generatedPages.push(pageDataUrl);

        // Clean up
        document.body.removeChild(pageContainer);
      }

      setPages(generatedPages);
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const togglePreview = async () => {
    if (!isPreviewMode) {
      await generatePreview();
    }
    setIsPreviewMode(!isPreviewMode);
  };

  const getTemplateStyles = () => {
    const colorSchemes = {
      gray: { primary: "#374151", secondary: "#4B5563", accent: "#111827" },
      blue: { primary: "#2563EB", secondary: "#3B82F6", accent: "#111827" },
      black: { primary: "#111827", secondary: "#374151", accent: "#4B5563" },
      navy: { primary: "#1E3A8A", secondary: "#2563EB", accent: "#111827" },
    }

    const colors = colorSchemes[colorScheme] || colorSchemes.gray

    const baseStyles = {
      headerColor: colors.primary,
      textColor: colors.secondary,
      accentColor: colors.accent,
    }

    switch (template) {
      case "modern":
        return {
          ...baseStyles,
          fontFamily: "font-sans",
          headerStyle: "text-2xl font-bold uppercase tracking-wide",
          sectionStyle: "text-xl font-bold uppercase tracking-wide border-b-2 pb-2",
          layoutClass: "grid grid-cols-3 gap-0",
          sidebarClass: "col-span-1 p-6",
          mainClass: "col-span-2",
        }
      case "minimalist":
        return {
          ...baseStyles,
          fontFamily: "font-sans",
          headerStyle: "text-3xl font-bold",
          sectionStyle: "text-sm font-medium uppercase tracking-wider text-gray-500",
          layoutClass: "space-y-0",
          sidebarClass: "bg-gray-100",
          mainClass: "bg-white",
        }
      case "classic":
        return {
          ...baseStyles,
          fontFamily: "font-serif",
          headerStyle: "text-4xl font-bold text-center",
          sectionStyle: "text-lg font-bold capitalize border-b border-gray-300 pb-1",
          layoutClass: "space-y-8",
          sidebarClass: "",
          mainClass: "",
        }
      default:
        return {
          ...baseStyles,
          fontFamily: "font-sans",
          headerStyle: "text-2xl font-bold uppercase tracking-wide",
          sectionStyle: "text-xl font-bold uppercase tracking-wide border-b-2 pb-2",
          layoutClass: "grid grid-cols-3 gap-0",
          sidebarClass: "col-span-1 p-6",
          mainClass: "col-span-2",
        }
    }
  }

  const styles = getTemplateStyles()

  const renderTemplate = () => {
    const templateProps = {
      resumeData: currentResumeData,
      styles,
      onEditPersonalInfo,
      onEditExperience,
      onEditEducation,
      onEditSkills,
      onEditCertifications,
      onEditProjects,
    }

    switch (template) {
      case "modern":
        return <ModernTemplate {...templateProps} />
      case "minimalist":
        return <MinimalistTemplate {...templateProps} />
      case "classic":
        return <ClassicTemplate {...templateProps} />
      default:
        return <ModernTemplate {...templateProps} />
    }
  }

  return (
    <div className="bg-white h-full flex flex-col shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-6 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {isPreviewMode ? "PDF Preview" : "ATS-Optimized Resume"}
          </h1>
          {optimizedResumeData && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
              AI Optimized
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isPreviewMode && (
            <div className="text-sm text-gray-600">
              Template: {template.charAt(0).toUpperCase() + template.slice(1)}
            </div>
          )}

          {isPreviewMode && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Zoom:</span>
              <button
                onClick={() => setZoomLevel(Math.max(0.25, zoomLevel - 0.25))}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={zoomLevel <= 0.25}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700 min-w-[60px] text-center font-medium">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={zoomLevel >= 2}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* AI Optimization Component */}
          <ResumeOptimizer
            currentResumeData={currentResumeData}
            optimizedResumeData={optimizedResumeData}
            setOptimizedResumeData={setOptimizedResumeData}
            isPreviewMode={isPreviewMode}
            generatePreview={generatePreview}
            isGeneratingPreview={isGeneratingPreview}
          />

          <button
            onClick={togglePreview}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${isPreviewMode
                ? "bg-gray-600 text-white hover:bg-gray-700 shadow-md"
                : "bg-green-600 text-white hover:bg-green-700 shadow-md"
              }`}
            disabled={isGeneratingPreview}
          >
            {isGeneratingPreview ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : isPreviewMode ? (
              <>
                <FileText className="w-4 h-4" />
                Edit Resume
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview PDF
              </>
            )}
          </button>

          {/* PDF Generator Component */}
          <PDFGenerator
            resumeRef={resumeRef}
            currentResumeData={currentResumeData}
            pages={pages}
            isPreviewMode={isPreviewMode}
            isGeneratingPreview={isGeneratingPreview}
            A4_WIDTH={A4_WIDTH}
            A4_HEIGHT={A4_HEIGHT}
            MARGIN={MARGIN}
            CONTENT_WIDTH={CONTENT_WIDTH}
            CONTENT_HEIGHT={CONTENT_HEIGHT}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isPreviewMode ? (
          pages.length > 0 && (
            <PreviewPages
              pages={pages}
              zoomLevel={zoomLevel}
              A4_WIDTH={A4_WIDTH}
              A4_HEIGHT={A4_HEIGHT}
              MARGIN={MARGIN}
              CONTENT_WIDTH={CONTENT_WIDTH}
              CONTENT_HEIGHT={CONTENT_HEIGHT}
            />
          )
        ) : (
          <div className="p-8 bg-gray-50">
            <div
              ref={resumeRef}
              className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
              style={{
                width: `${CONTENT_WIDTH}px`,
                minHeight: `${CONTENT_HEIGHT}px`,
                padding: `${MARGIN}px`,
              }}
            >
              <div className="resume-content">
                {renderTemplate()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer info for preview mode */}
      {isPreviewMode && pages.length > 0 && (
        <div className="border-t bg-gray-50 py-3 px-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium">Total: {pages.length} page{pages.length > 1 ? 's' : ''}</span>
            <div className="flex items-center gap-4">
              {optimizedResumeData && (
                <span className="text-green-600 font-medium">✓ AI Optimized for Better Page Layout</span>
              )}
              <span>Size: A4 (210 × 297 mm)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}