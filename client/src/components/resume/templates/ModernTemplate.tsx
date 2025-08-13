import { ResumeData } from "@shared/schema";
import { formatBulletPoints } from "@/lib/resumeUtils";

interface ModernTemplateProps {
  data: ResumeData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="resume-modern font-arial bg-white flex">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-blue-50 p-6 border-r border-blue-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700 mb-1">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <div className="text-slate-600 text-sm space-y-1 mt-4">
            {data.personalInfo.email && (
              <p className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                {data.personalInfo.email}
              </p>
            )}
            {data.personalInfo.phone && (
              <p className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                {data.personalInfo.phone}
              </p>
            )}
            {data.personalInfo.location && (
              <p className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                {data.personalInfo.location}
              </p>
            )}
            {data.personalInfo.linkedin && (
              <p className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                {data.personalInfo.linkedin}
              </p>
            )}
            {data.personalInfo.website && (
              <p className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                {data.personalInfo.website}
              </p>
            )}
          </div>
        </div>

        {(data.skills.technical || data.skills.soft || data.skills.languages) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
              SKILLS
            </h2>
            <div className="text-sm text-slate-700 space-y-2">
              {data.skills.technical && (
                <div>
                  <h3 className="font-semibold text-blue-600">Technical</h3>
                  <p className="text-xs">{data.skills.technical}</p>
                </div>
              )}
              {data.skills.soft && (
                <div>
                  <h3 className="font-semibold text-blue-600">Soft Skills</h3>
                  <p className="text-xs">{data.skills.soft}</p>
                </div>
              )}
              {data.skills.languages && (
                <div>
                  <h3 className="font-semibold text-blue-600">Languages</h3>
                  <p className="text-xs">{data.skills.languages}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
              EDUCATION
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index} className="text-sm">
                  <h3 className="font-semibold text-slate-800 text-xs">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </h3>
                  <p className="text-slate-600 text-xs">{edu.school}</p>
                  <p className="text-slate-500 text-xs">{edu.graduationYear}</p>
                  {edu.gpa && <p className="text-xs text-slate-700">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
              CERTIFICATIONS
            </h2>
            <div className="text-xs text-slate-700 space-y-2">
              {data.certifications.map((cert, index) => (
                <div key={index}>
                  <p className="font-semibold">{cert.name}</p>
                  <p className="text-slate-600">{cert.issuer}</p>
                  {cert.date && <p className="text-slate-500">{cert.date}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6">
        {data.personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
              WORK EXPERIENCE
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-800">{exp.jobTitle}</h3>
                      <p className="text-blue-600 text-sm font-medium">{exp.company}</p>
                    </div>
                    <span className="text-slate-600 text-sm">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.achievements && (
                    <div 
                      className="text-sm text-slate-700 space-y-1 ml-4"
                      dangerouslySetInnerHTML={{ __html: formatBulletPoints(exp.achievements) }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
