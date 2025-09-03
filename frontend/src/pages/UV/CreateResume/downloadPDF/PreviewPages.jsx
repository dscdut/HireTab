const PreviewPages = ({
  pages,
  zoomLevel,
  A4_WIDTH,
  A4_HEIGHT,
  MARGIN,
  CONTENT_WIDTH,
  CONTENT_HEIGHT,
}) => {
  return (
    <div className="flex flex-col items-center space-y-8 py-8 bg-gray-100 min-h-full">
      {pages.map((pageImage, index) => (
        <div key={index} className="relative shadow-xl">
          <div 
            className="bg-white border border-gray-300 overflow-hidden"
            style={{
              width: A4_WIDTH * zoomLevel,
              height: A4_HEIGHT * zoomLevel,
            }}
          >
            <div
              style={{
                width: A4_WIDTH,
                height: A4_HEIGHT,
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                padding: `${MARGIN}px`,
                boxSizing: 'border-box',
              }}
            >
              <img 
                src={pageImage} 
                alt={`Page ${index + 1}`}
                className="w-full h-full object-contain"
                style={{ 
                  width: `${CONTENT_WIDTH}px`,
                  height: `${CONTENT_HEIGHT}px`,
                  imageRendering: 'crisp-edges',
                }}
              />
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium">
            Page {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewPages;