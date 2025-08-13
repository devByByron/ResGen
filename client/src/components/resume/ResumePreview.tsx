import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Eye } from "lucide-react";
import { ResumeData } from "@shared/schema";
import MinimalistTemplate from "./templates/MinimalistTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";

interface ResumePreviewProps {
  data: ResumeData;
  template: "minimalist" | "modern" | "creative";
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function ResumePreview({ data, template, zoom, onZoomIn, onZoomOut }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} />;
      case "creative":
        return <CreativeTemplate data={data} />;
      default:
        return <MinimalistTemplate data={data} />;
    }
  };

  const handleFullScreen = () => {
    const element = document.getElementById('resume-preview-content');
    if (element) {
      element.requestFullscreen?.();
    }
  };

  return (
    <div className="sticky top-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                disabled={zoom <= 0.6}
                className="p-1 text-slate-500 hover:text-slate-700"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-600" id="zoom-level">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                disabled={zoom >= 1.2}
                className="p-1 text-slate-500 hover:text-slate-700"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullScreen}
              className="px-3 py-1 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Full Screen
            </Button>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-slate-100 p-4 rounded-lg">
          <div
            id="resume-preview"
            className="resume-preview bg-white shadow-lg max-w-2xl mx-auto transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          >
            <div id="resume-preview-content">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
