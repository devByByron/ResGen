import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, Save } from "lucide-react";
import ResumeForm from "@/components/resume/ResumeForm";
import ResumePreview from "@/components/resume/ResumePreview";
import AIResumeGenerator from "@/components/ai/AIResumeGenerator";
import APIKeyPrompt from "@/components/setup/APIKeyPrompt";
import { ResumeData } from "@shared/schema";

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: {
    technical: "",
    soft: "",
    languages: "",
  },
  certifications: [],
  projects: [],
};

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<"minimalist" | "modern" | "creative">("minimalist");
  const [zoom, setZoom] = useState(0.8);
  const [showAPIPrompt, setShowAPIPrompt] = useState(false);

  const handleDataChange = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleAIResumeGenerated = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleTemplateChange = (template: "minimalist" | "modern" | "creative") => {
    setSelectedTemplate(template);
  };

  const handleZoomIn = () => {
    if (zoom < 1.2) {
      setZoom(zoom + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.6) {
      setZoom(zoom - 0.1);
    }
  };

  const handleExportPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('resume-preview-content');
    
    if (element) {
      const opt = {
        margin: 0.5,
        filename: `${resumeData.personalInfo.fullName || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      try {
        await html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    }
  };

  const handleSaveDraft = () => {
    // Save to localStorage for now
    localStorage.setItem('resume-draft', JSON.stringify({
      data: resumeData,
      template: selectedTemplate
    }));
    alert('Draft saved successfully!');
  };

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('resume-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setResumeData(draft.data);
        setSelectedTemplate(draft.template);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-slate-900">Resume Builder Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleSaveDraft}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handleExportPDF}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {showAPIPrompt && (
              <APIKeyPrompt onKeyProvided={() => setShowAPIPrompt(false)} />
            )}
            <AIResumeGenerator
              onResumeGenerated={handleAIResumeGenerated}
              currentResumeData={resumeData}
            />
            
            {/* Manual Edit Form Label */}
            <div className="mb-4 mt-8">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Edit Your Resume
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Manually edit your resume information below. Changes will appear in real-time in the preview.
              </p>
            </div>
            
            <ResumeForm
              data={resumeData}
              onDataChange={handleDataChange}
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-3">
            <ResumePreview
              data={resumeData}
              template={selectedTemplate}
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
