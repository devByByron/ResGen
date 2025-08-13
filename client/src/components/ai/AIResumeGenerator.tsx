import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Upload, FileText, Loader2 } from "lucide-react";
import { ResumeData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIResumeGeneratorProps {
  onResumeGenerated: (resumeData: ResumeData) => void;
  currentResumeData?: ResumeData;
}

export default function AIResumeGenerator({ onResumeGenerated, currentResumeData }: AIResumeGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"generate" | "upload">("generate");
  
  // Generation form state
  const [generationForm, setGenerationForm] = useState({
    jobTitle: "",
    industry: "",
    experienceLevel: "",
    skills: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    additionalInfo: ""
  });



  const handleGenerateResume = async () => {
    setIsGenerating(true);
    try {
      const request = {
        jobTitle: generationForm.jobTitle,
        industry: generationForm.industry,
        experienceLevel: generationForm.experienceLevel,
        skills: generationForm.skills,
        personalInfo: {
          fullName: generationForm.fullName,
          email: generationForm.email,
          phone: generationForm.phone,
          location: generationForm.location
        },
        additionalInfo: generationForm.additionalInfo
      };

      const response = await fetch("/.netlify/functions/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resumeData = await response.json();
      onResumeGenerated(resumeData);
      toast({
        title: "Resume Generated Successfully!",
        description: "Your AI-powered resume has been created. You can now edit it further or choose a different template.",
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate resume. Please check your inputs and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch("/.netlify/functions/parse-resume", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resumeData = await response.json();
      onResumeGenerated(resumeData);
      toast({
        title: "Resume Uploaded Successfully!",
        description: "Your resume has been parsed and loaded. You can now edit it further or choose a different template.",
      });
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to parse resume. Please ensure the file is a valid PDF or TXT file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };



  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-slate-900">
          <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
          AI Resume Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "generate"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-4 w-4 inline mr-1" />
            Generate
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === "upload"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Upload className="h-4 w-4 inline mr-1" />
            Upload
          </button>

        </div>

        {/* Generate Tab */}
        {activeTab === "generate" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobTitle" className="text-sm font-medium text-slate-700">
                  Target Job Title *
                </Label>
                <Input
                  id="jobTitle"
                  placeholder="Software Engineer"
                  value={generationForm.jobTitle}
                  onChange={(e) => setGenerationForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="industry" className="text-sm font-medium text-slate-700">
                  Industry
                </Label>
                <Select onValueChange={(value) => setGenerationForm(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="experienceLevel" className="text-sm font-medium text-slate-700">
                Experience Level
              </Label>
              <Select onValueChange={(value) => setGenerationForm(prev => ({ ...prev, experienceLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                  <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="skills" className="text-sm font-medium text-slate-700">
                Key Skills
              </Label>
              <Textarea
                id="skills"
                placeholder="JavaScript, React, Node.js, Python, SQL..."
                value={generationForm.skills}
                onChange={(e) => setGenerationForm(prev => ({ ...prev, skills: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={generationForm.fullName}
                  onChange={(e) => setGenerationForm(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={generationForm.email}
                  onChange={(e) => setGenerationForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="additionalInfo" className="text-sm font-medium text-slate-700">
                Additional Information
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any specific achievements, companies you've worked at, or other relevant information..."
                value={generationForm.additionalInfo}
                onChange={(e) => setGenerationForm(prev => ({ ...prev, additionalInfo: e.target.value }))}
                rows={3}
              />
            </div>

            <Button
              onClick={handleGenerateResume}
              disabled={isGenerating || !generationForm.jobTitle}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Resume with AI
                </>
              )}
            </Button>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Upload a PDF or TXT file and AI will extract and structure the information
                </p>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Button
                    variant="outline"
                    disabled={isUploading}
                    className="pointer-events-none"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </>
                    )}
                  </Button>
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Supported formats: PDF, TXT • Max size: 10MB
              </p>
            </div>
          </div>
        )}


      </CardContent>
    </Card>
  );
}