import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, CheckCircle } from "lucide-react";
import { ResumeData } from "@shared/schema";

interface ResumeFormProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
  selectedTemplate: "minimalist" | "modern" | "creative";
  onTemplateChange: (template: "minimalist" | "modern" | "creative") => void;
}

export default function ResumeForm({ data, onDataChange, selectedTemplate, onTemplateChange }: ResumeFormProps) {
  const [activeTab, setActiveTab] = useState<"personal" | "experience" | "education" | "skills">("personal");

  const updatePersonalInfo = (field: string, value: string) => {
    onDataChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  const addExperience = () => {
    onDataChange({
      ...data,
      experience: [
        ...data.experience,
        {
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          achievements: "",
        },
      ],
    });
  };

  const updateExperience = (index: number, field: string, value: string | boolean) => {
    const updatedExperience = [...data.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    onDataChange({ ...data, experience: updatedExperience });
  };

  const addEducation = () => {
    onDataChange({
      ...data,
      education: [
        ...data.education,
        {
          degree: "",
          fieldOfStudy: "",
          school: "",
          location: "",
          graduationYear: "",
          gpa: "",
        },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...data.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    onDataChange({ ...data, education: updatedEducation });
  };

  const updateSkills = (field: string, value: string) => {
    onDataChange({
      ...data,
      skills: {
        ...data.skills,
        [field]: value,
      },
    });
  };

  const addCertification = () => {
    onDataChange({
      ...data,
      certifications: [
        ...data.certifications,
        {
          name: "",
          issuer: "",
          date: "",
          url: "",
        },
      ],
    });
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const updatedCertifications = [...data.certifications];
    updatedCertifications[index] = { ...updatedCertifications[index], [field]: value };
    onDataChange({ ...data, certifications: updatedCertifications });
  };

  // Calculate ATS score based on filled fields
  const calculateATSScore = () => {
    let score = 0;
    const maxScore = 100;
    
    // Personal info (30 points)
    if (data.personalInfo.fullName) score += 10;
    if (data.personalInfo.email) score += 10;
    if (data.personalInfo.phone) score += 10;
    
    // Summary (20 points)
    if (data.personalInfo.summary && data.personalInfo.summary.length > 50) score += 20;
    
    // Experience (30 points)
    if (data.experience.length > 0) score += 15;
    if (data.experience.some(exp => exp.achievements)) score += 15;
    
    // Skills (10 points)
    if (data.skills.technical || data.skills.soft) score += 10;
    
    // Education (10 points)
    if (data.education.length > 0) score += 10;
    
    return Math.min(score, maxScore);
  };

  const atsScore = calculateATSScore();

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Choose Template</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onTemplateChange("minimalist")}
              className={`template-card p-3 border-2 rounded-lg transition-colors ${
                selectedTemplate === "minimalist"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="w-full h-16 bg-white border border-slate-300 rounded mb-2 relative overflow-hidden">
                <div className="h-2 bg-slate-800 mb-1"></div>
                <div className="h-1 bg-slate-400 mb-1 mx-1"></div>
                <div className="h-1 bg-slate-400 mb-1 mx-1 w-3/4"></div>
                <div className="h-1 bg-slate-300 mx-1 w-1/2"></div>
              </div>
              <span className="text-xs font-medium text-slate-700">Minimalist</span>
            </button>
            
            <button
              onClick={() => onTemplateChange("modern")}
              className={`template-card p-3 border-2 rounded-lg transition-colors ${
                selectedTemplate === "modern"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="w-full h-16 bg-white border border-slate-300 rounded mb-2 relative overflow-hidden flex">
                <div className="w-1/3 bg-blue-100 h-full"></div>
                <div className="flex-1 p-1">
                  <div className="h-2 bg-blue-600 mb-1"></div>
                  <div className="h-1 bg-slate-400 mb-1"></div>
                  <div className="h-1 bg-slate-300 w-2/3"></div>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-700">Modern</span>
            </button>

            <button
              onClick={() => onTemplateChange("creative")}
              className={`template-card p-3 border-2 rounded-lg transition-colors ${
                selectedTemplate === "creative"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="w-full h-16 bg-white border border-slate-300 rounded mb-2 relative overflow-hidden">
                <div className="h-2 bg-purple-600 mb-1"></div>
                <div className="bg-purple-50 p-1 mb-1">
                  <div className="h-1 bg-purple-400 mb-1"></div>
                  <div className="h-1 bg-slate-400 w-3/4"></div>
                </div>
                <div className="bg-green-50 p-1">
                  <div className="h-1 bg-slate-300"></div>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-700">Creative</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Form Tabs */}
      <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: "personal", label: "Personal Info" },
              { id: "experience", label: "Experience" },
              { id: "education", label: "Education" },
              { id: "skills", label: "Skills" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <CardContent className="p-6">
          {/* Personal Info Tab */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={data.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={data.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={data.personalInfo.location || ""}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <Label htmlFor="linkedin" className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="linkedin.com/in/johndoe"
                  value={data.personalInfo.linkedin || ""}
                  onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <Label htmlFor="summary" className="block text-sm font-medium text-slate-700 mb-2">
                  Professional Summary
                </Label>
                <Textarea
                  id="summary"
                  rows={4}
                  placeholder="Experienced software developer with 5+ years of expertise in full-stack development..."
                  value={data.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-slate-900">Work Experience</h3>
                <Button
                  onClick={addExperience}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Position
                </Button>
              </div>
              
              {data.experience.map((exp, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-2">Job Title</Label>
                      <Input
                        placeholder="Senior Software Engineer"
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-2">Company</Label>
                      <Input
                        placeholder="Tech Corp"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-2">Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-2">End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex items-center mt-2">
                        <Checkbox
                          checked={exp.current}
                          onCheckedChange={(checked) => updateExperience(index, "current", !!checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-slate-600">Current position</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-slate-700 mb-2">Key Achievements</Label>
                    <Textarea
                      rows={4}
                      placeholder="• Led development of microservices architecture serving 1M+ users&#10;• Improved application performance by 40% through code optimization&#10;• Mentored 3 junior developers and established code review processes"
                      value={exp.achievements}
                      onChange={(e) => updateExperience(index, "achievements", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
              
              {data.experience.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No work experience added yet.</p>
                  <Button
                    onClick={addExperience}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Your First Position
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-slate-900">Education</h3>
                <Button
                  onClick={addEducation}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Education
                </Button>
              </div>
              
              {data.education.map((edu, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-2">Degree</Label>
                      <Input
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-2">Field of Study</Label>
                      <Input
                        placeholder="Computer Science"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-2">School</Label>
                      <Input
                        placeholder="University of California"
                        value={edu.school}
                        onChange={(e) => updateEducation(index, "school", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-slate-700 mb-2">Graduation Year</Label>
                      <Input
                        type="number"
                        placeholder="2018"
                        value={edu.graduationYear}
                        onChange={(e) => updateEducation(index, "graduationYear", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-slate-700 mb-2">GPA (Optional)</Label>
                    <Input
                      placeholder="3.8/4.0"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-slate-900">Certifications</h4>
                  <Button
                    onClick={addCertification}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Certification
                  </Button>
                </div>
                
                {data.certifications.map((cert, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-sm font-medium text-slate-700 mb-2">Certification Name</Label>
                        <Input
                          placeholder="AWS Solutions Architect"
                          value={cert.name}
                          onChange={(e) => updateCertification(index, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium text-slate-700 mb-2">Issuing Organization</Label>
                        <Input
                          placeholder="Amazon Web Services"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="technical" className="block text-sm font-medium text-slate-700 mb-2">
                  Technical Skills
                </Label>
                <Textarea
                  id="technical"
                  rows={3}
                  placeholder="JavaScript, Python, React, Node.js, AWS, Docker, PostgreSQL"
                  value={data.skills.technical}
                  onChange={(e) => updateSkills("technical", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Separate skills with commas</p>
              </div>
              
              <div>
                <Label htmlFor="soft" className="block text-sm font-medium text-slate-700 mb-2">
                  Soft Skills
                </Label>
                <Textarea
                  id="soft"
                  rows={3}
                  placeholder="Leadership, Communication, Problem Solving, Team Collaboration"
                  value={data.skills.soft}
                  onChange={(e) => updateSkills("soft", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <Label htmlFor="languages" className="block text-sm font-medium text-slate-700 mb-2">
                  Languages
                </Label>
                <Textarea
                  id="languages"
                  rows={2}
                  placeholder="English (Native), Spanish (Conversational)"
                  value={data.skills.languages}
                  onChange={(e) => updateSkills("languages", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ATS Optimization Panel */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center mb-2">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-sm font-medium text-green-800">ATS Optimization Score</h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 bg-green-200 rounded-full h-2 mr-3">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${atsScore}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-green-800">{atsScore}%</span>
        </div>
        <p className="text-xs text-green-700 mt-2">
          {atsScore >= 80 ? "Great! Your resume is well-optimized for ATS systems." : 
           atsScore >= 60 ? "Good progress! Add more details to improve your ATS score." :
           "Keep adding information to make your resume more ATS-friendly."}
        </p>
      </div>
    </div>
  );
}
