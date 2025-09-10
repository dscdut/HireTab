
import React, { useState } from 'react';
import { FileText, Briefcase, Minimize, Star, Download, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { path } from "@/core/constants/path";
import Header from "@/shared/layout/candidate-layout/Header";

const TemplateGallery = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const navigate = useNavigate();

  const templates = [
    {
      id: "modern",
      name: "Modern Professional",
      category: "Professional",
      description: "Modern two-column layout with sidebar for contact and skills, ideal for corporate roles and tech positions",
      features: ["Two-column layout", "Professional sidebar", "Clean typography", "ATS-optimized"],
      popularity: "Most Popular",
      backgroundImage: "url('https://s3.resume.io/uploads/local_template_image/image/3367/persistent-resource/toronto-resume-templates.jpg?v=1655380978')",
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      id: "minimalist",
      name: "Minimalist Clean",
      category: "Creative",
      description: "Clean two-column design with photo placeholder and minimal styling, perfect for analytical and creative roles",
      features: ["Photo section", "Minimal design", "Two-column layout", "Modern typography"],
      popularity: "Trending",
      backgroundImage: "url('https://s3.resume.io/uploads/local_template_image/image/481/persistent-resource/london-resume-templates.jpg?v=1732202182')",
      icon: <Minimize className="w-5 h-5" />
    },
    {
      id: "classic",
      name: "Classic Traditional",
      category: "Traditional",
      description: "Traditional one-column layout with serif fonts, suitable for formal industries like law, finance, and academia",
      features: ["One-column layout", "Serif typography", "Traditional format", "Professional styling"],
      popularity: "Trusted Choice",
      backgroundImage: "url('https://s3.resume.io/uploads/local_template_image/image/370/persistent-resource/stockholm-resume-templates.jpg?v=1656506913')",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: "traditional",
      name: "Traditional",
      category: "Traditional",
      description: "Traditional one-column layout with serif fonts, suitable for formal industries like law, finance, and academia",
      features: ["One-column layout", "Serif typography", "Traditional format", "Professional styling"],
      popularity: "Trusted Choice",
      backgroundImage: "url('https://s3.resume.io/uploads/local_template_image/image/383/persistent-resource/santiago-resume-templates.jpg?v=1656070649')",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: "prime-ats",
      name: "Prime ATS",
      category: "ATS-Optimized",
      description: "Prime ATS-optimized template with clean structure and excellent readability for applicant tracking systems",
      features: ["ATS-friendly", "Clean structure", "Professional layout", "High readability"],
      popularity: "Trusted Choice",
      backgroundImage: "url('https://resume.io/assets/templates/helsinki-4dd16bc5e017b8969055dc9dc02348c331d673da6140a0a8a69eaf2befd7b4ba.jpg')",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: "pure-ats",
      name: "Pure ATS",
      category: "ATS-Optimized",
      description: "Pure black-and-white ATS template with simple structure optimized for maximum compatibility",
      features: ["Maximum ATS compatibility", "Simple structure", "Black & white design", "Universal format"],
      popularity: "Trusted Choice",
      backgroundImage: "url('https://resume.io/assets/templates/seoul-f6e799b14048602d802de73b05f37b8b9348e6ee5367f905c94bd4a3c5c2c250.jpg')",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: "elegant",
      name: "Elegant",
      category: "Creative",
      description: "Elegant design with sophisticated styling, suitable for creative professionals and design roles",
      features: ["Elegant styling", "Creative layout", "Photo section", "Professional appearance"],
      popularity: "Trusted Choice",
      backgroundImage: "url('https://s3.resume.io/uploads/local_template_image/image/513/persistent-resource/barcelona-resume-templates.jpg?v=1656070899')",
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: "header-ats",
      name: "Header ATS",
      category: "ATS-Optimized",
      description: "ATS-friendly template with prominent header section and clean formatting for maximum system compatibility",
      features: ["Prominent header", "ATS-friendly", "Clean formatting", "Professional structure"],
      popularity: "Trusted Choice",
      backgroundImage: "url('https://s3.resume.io/uploads/local_template_image/image/8223/persistent-resource/shanghai-resume-templates.jpg?v=1732630221')",
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const handleUseTemplate = (templateId) => {
    console.log("Navigating to CreateResume with template:", templateId);
    console.log("Navigation path:", `${path.candidate.create_resume}?template=${templateId}`);

    try {
      navigate(`${path.candidate.create_resume}?template=${templateId}`, { replace: true });
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = `${path.candidate.create_resume}?template=${templateId}`;
    }
  };

  const PreviewCard = ({ template }) => {
    const isSelected = selectedTemplate === template.id;
    const isHovered = hoveredTemplate === template.id;

    return (
      <div
        className={`relative cursor-pointer transition-all duration-300 transform ${isHovered ? 'scale-105' : 'scale-100'}`}
        onMouseEnter={() => setHoveredTemplate(template.id)}
        onMouseLeave={() => setHoveredTemplate(null)}
        onClick={() => setSelectedTemplate(template.id)}
      >
        <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden border-2 ${isSelected ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}`}>
          <div
            className="h-96 relative overflow-hidden bg-gray-100"
            style={{
              backgroundImage: template.backgroundImage,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
          >
            {isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template.id);
                  }}
                  className="bg-white bg-opacity-95 text-gray-800 px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-white transition-all duration-200 font-medium shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Use This Template</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-900">{template.name}</h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {template.category}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {template.description}
            </p>

            <div className="space-y-2">
              <div className="text-xs text-gray-500 font-medium">KEY FEATURES:</div>
              <div className="flex flex-wrap gap-1">
                {template.features.map((feature, i) => (
                  <span key={i} className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 pt-20">
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Resume Template
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Select from our collection of professionally designed, ATS-optimized resume templates.
            Each template is crafted to help you stand out while ensuring compatibility with applicant tracking systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {templates.map((template) => (
            <PreviewCard key={template.id} template={template} />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Selected Template: {templates.find(t => t.id === selectedTemplate)?.name}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {templates.find(t => t.id === selectedTemplate)?.description}
            </p>

            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-md"
                onClick={() => handleUseTemplate(selectedTemplate)}
              >
                <Download className="w-5 h-5" />
                <span>Use This Template</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 text-white rounded-full p-2 flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-2">ATS-Optimized Design</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                All our templates are designed to pass Applicant Tracking Systems (ATS) with clean formatting,
                standard fonts, and proper section headers. Your resume will be readable by both humans and machines.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Easy Customization</h4>
              <p className="text-gray-600 text-sm">Easily edit colors, fonts, and layouts to match your personal brand</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="text-center">
              <div className="bg-green-100 text-green-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Multiple Formats</h4>
              <p className="text-gray-600 text-sm">Download as PDF, Word document, or print directly from your browser</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="text-center">
              <div className="bg-yellow-100 text-yellow-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Professional Quality</h4>
              <p className="text-gray-600 text-sm">Designed by experts to help you make the best first impression</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
