"use client";

import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { resetResume } from "@/store/slices/resumeSlice";

export default function ResumePreview() {
  const t = useTranslations("resume.preview");
  const dispatch = useAppDispatch();
  const { formData, paymentId } = useAppSelector(s => s.resume);

  if (!formData) return null;

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Action Bar - hidden on print */}
      <div className="print:hidden bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">{t("title")}</h2>
            {paymentId && <p className="text-xs text-gray-400">Payment ID: {paymentId}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrint}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
              🖨️ {t("print")}
            </button>
            <button onClick={() => dispatch(resetResume())}
              className="px-5 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-lg transition-colors">
              + {t("new")}
            </button>
          </div>
        </div>
      </div>

      {/* Resume Paper */}
      <div className="max-w-4xl mx-auto p-6 print:p-0">
        <div id="resume-paper" className="bg-white shadow-xl print:shadow-none"
          style={{ minHeight: "297mm", fontFamily: "Georgia, serif" }}>

          {/* Header */}
          <div className="flex items-center gap-6 p-10 pb-6 border-b-4 border-blue-600">
            {formData.photo && (
              <img src={formData.photo} alt={formData.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">{formData.name}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-gray-600">
                {formData.email && <span>📧 {formData.email}</span>}
                {formData.phone && <span>📞 {formData.phone}</span>}
                {formData.address && <span>📍 {formData.address}</span>}
              </div>
            </div>
          </div>

          <div className="p-10 space-y-7">

            {/* Objective */}
            {formData.objective && (
              <section>
                <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest border-b-2 border-blue-100 pb-1 mb-3">
                  Career Objective
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm">{formData.objective}</p>
              </section>
            )}

            {/* Education */}
            {formData.education.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest border-b-2 border-blue-100 pb-1 mb-3">
                  Education
                </h2>
                <div className="space-y-3">
                  {formData.education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500 flex-shrink-0 ml-4">
                        {edu.year && <p>{edu.year}</p>}
                        {edu.percentage && <p className="font-medium text-blue-600">{edu.percentage}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {formData.experience.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest border-b-2 border-blue-100 pb-1 mb-3">
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {formData.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{exp.role}</p>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                        </div>
                        {exp.duration && <p className="text-sm text-gray-500 flex-shrink-0 ml-4">{exp.duration}</p>}
                      </div>
                      {exp.description && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {formData.skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest border-b-2 border-blue-100 pb-1 mb-3">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {formData.certifications.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest border-b-2 border-blue-100 pb-1 mb-3">
                  Certifications
                </h2>
                <ul className="space-y-1">
                  {formData.certifications.map((cert, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">▸</span> {cert}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Print CSS */}
      <style jsx global>{`
        @media print {
          body { margin: 0; }
          .print\\:hidden { display: none !important; }
          #resume-paper { box-shadow: none; }
          @page { margin: 0; size: A4; }
        }
      `}</style>
    </div>
  );
}
