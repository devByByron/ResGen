import { ResumeData } from "@shared/schema";
import { formatBulletPoints } from "@/lib/resumeUtils";

interface MinimalistTemplateProps {
  data: ResumeData;
}

export default function MinimalistTemplate({ data }: MinimalistTemplateProps) {
  return (
    <div className="resume-minimalist p-8 font-arial bg-white">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="text-slate-600 text-sm space-y-1">
          {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
          {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
          {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
          {data.personalInfo.website && <p>{data.personalInfo.website}</p>}
        </div>
      </header>

      {data.personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {(data.skills.technical || data.skills.soft || data.skills.languages) && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">
            SKILLS
          </h2>
          <div className="text-sm text-slate-700 space-y-1">
            {data.skills.technical && (
              <p>
                <strong>Technical Skills:</strong> {data.skills.technical}
              </p>
            )}
            {data.skills.soft && (
              <p>
                <strong>Soft Skills:</strong> {data.skills.soft}
              </p>
            )}
            {data.skills.languages && (
              <p>
                <strong>Languages:</strong> {data.skills.languages}
              </p>
            )}
          </div>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-800">{exp.jobTitle}</h3>
                    <p className="text-slate-600 text-sm">{exp.company}</p>
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

      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">
            EDUCATION
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </h3>
                    <p className="text-slate-600 text-sm">{edu.school}</p>
                  </div>
                  <span className="text-slate-600 text-sm">{edu.graduationYear}</span>
                </div>
                {edu.gpa && (
                  <p className="text-sm text-slate-700 mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">
            CERTIFICATIONS
          </h2>
          <div className="text-sm text-slate-700 space-y-1">
            {data.certifications.map((cert, index) => (
              <p key={index}>
                <strong>{cert.name}</strong> | {cert.issuer}
                {cert.date && ` (${cert.date})`}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
