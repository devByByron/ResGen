import { ResumeData } from "@shared/schema";
import { formatBulletPoints } from "@/lib/resumeUtils";

interface CreativeTemplateProps {
  data: ResumeData;
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
  return (
    <div className="resume-creative font-arial bg-white p-8">
      <header className="bg-purple-50 p-6 rounded-lg mb-6 text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
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
        <section className="bg-green-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-bold text-green-700 mb-3">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {(data.skills.technical || data.skills.soft || data.skills.languages) && (
        <section className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-bold text-blue-700 mb-3">
            SKILLS
          </h2>
          <div className="text-sm text-slate-700 space-y-2">
            {data.skills.technical && (
              <div className="bg-white p-3 rounded">
                <h3 className="font-semibold text-blue-600 mb-1">Technical Skills</h3>
                <p>{data.skills.technical}</p>
              </div>
            )}
            {data.skills.soft && (
              <div className="bg-white p-3 rounded">
                <h3 className="font-semibold text-blue-600 mb-1">Soft Skills</h3>
                <p>{data.skills.soft}</p>
              </div>
            )}
            {data.skills.languages && (
              <div className="bg-white p-3 rounded">
                <h3 className="font-semibold text-blue-600 mb-1">Languages</h3>
                <p>{data.skills.languages}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="bg-yellow-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-bold text-yellow-700 mb-3">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-800">{exp.jobTitle}</h3>
                    <p className="text-yellow-600 text-sm font-medium">{exp.company}</p>
                  </div>
                  <span className="text-slate-600 text-sm bg-yellow-100 px-2 py-1 rounded">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.achievements && (
                  <div 
                    className="text-sm text-slate-700 space-y-1"
                    dangerouslySetInnerHTML={{ __html: formatBulletPoints(exp.achievements) }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="bg-indigo-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-bold text-indigo-700 mb-3">
            EDUCATION
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="bg-white p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </h3>
                    <p className="text-indigo-600 text-sm">{edu.school}</p>
                  </div>
                  <span className="text-slate-600 text-sm bg-indigo-100 px-2 py-1 rounded">
                    {edu.graduationYear}
                  </span>
                </div>
                {edu.gpa && (
                  <p className="text-sm text-slate-700 mt-2">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.certifications.length > 0 && (
        <section className="bg-pink-50 p-4 rounded-lg">
          <h2 className="text-lg font-bold text-pink-700 mb-3">
            CERTIFICATIONS
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {data.certifications.map((cert, index) => (
              <div key={index} className="bg-white p-3 rounded-lg">
                <h3 className="font-semibold text-slate-800">{cert.name}</h3>
                <p className="text-pink-600 text-sm">{cert.issuer}</p>
                {cert.date && <p className="text-slate-500 text-xs">{cert.date}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
