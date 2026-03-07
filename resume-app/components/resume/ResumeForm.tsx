"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/hooks/redux";
import { setFormData, setStep } from "@/store/slices/resumeSlice";
import type { ResumeFormData, Education, Experience } from "@/types";

export default function ResumeForm() {
  const t = useTranslations("resume.form");
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState("");
  const [objective, setObjective] = useState("");
  const [skills, setSkills] = useState<string[]>([""]);
  const [certifications, setCertifications] = useState<string[]>([""]);
  const [education, setEducation] = useState<Education[]>([{ degree: "", institution: "", year: "", percentage: "" }]);
  const [experience, setExperience] = useState<Experience[]>([{ company: "", role: "", duration: "", description: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t("required");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required";
    if (!phone.trim()) e.phone = t("required");
    if (!objective.trim()) e.objective = t("required");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const data: ResumeFormData = {
      name, email, phone, address, photo, objective,
      education: education.filter(e => e.degree || e.institution),
      experience: experience.filter(e => e.company || e.role),
      skills: skills.filter(s => s.trim()),
      certifications: certifications.filter(c => c.trim()),
    };
    dispatch(setFormData(data));
    dispatch(setStep("otp"));
  };

  const inputCls = (field?: string) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${errors[field ?? ""] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="text-center">
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">⭐ Premium — ₹50</span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-3">{useTranslations("resume")("title")}</h1>
        <p className="text-gray-500 mt-2">{useTranslations("resume")("subtitle")}</p>
      </div>

      {/* Personal Info */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">👤 {t("personal")}</h2>

        {/* Photo */}
        <div className="flex items-center gap-5 mb-5">
          <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {photo ? <img src={photo} alt="Photo" className="w-full h-full object-cover" /> : <span className="text-3xl">📷</span>}
          </div>
          <div>
            <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              {t("photo")}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
            <p className="text-xs text-gray-400 mt-1">{t("photoHint")}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("name")} *</label>
            <input value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
              placeholder="Arya Singh" className={inputCls("name")} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")} *</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
              placeholder="arya@email.com" className={inputCls("email")} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("phone")} *</label>
            <input value={phone} onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: "" })); }}
              placeholder="+91 9876543210" className={inputCls("phone")} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("address")}</label>
            <input value={address} onChange={e => setAddress(e.target.value)}
              placeholder="Bhopal, Madhya Pradesh" className={inputCls()} />
          </div>
        </div>
      </section>

      {/* Objective */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">🎯 {t("objective")}</h2>
        <textarea value={objective} onChange={e => { setObjective(e.target.value); setErrors(p => ({ ...p, objective: "" })); }}
          rows={3} placeholder="A motivated student seeking internship opportunities..."
          className={inputCls("objective")} />
        {errors.objective && <p className="text-xs text-red-500 mt-1">{errors.objective}</p>}
      </section>

      {/* Education */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">🎓 {t("education")}</h2>
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t("degree")}</label>
                  <input value={edu.degree} onChange={e => { const a = [...education]; a[i].degree = e.target.value; setEducation(a); }}
                    placeholder="B.Tech Computer Science" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t("institution")}</label>
                  <input value={edu.institution} onChange={e => { const a = [...education]; a[i].institution = e.target.value; setEducation(a); }}
                    placeholder="ABC University" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t("year")}</label>
                  <input value={edu.year} onChange={e => { const a = [...education]; a[i].year = e.target.value; setEducation(a); }}
                    placeholder="2024" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t("percentage")}</label>
                  <input value={edu.percentage} onChange={e => { const a = [...education]; a[i].percentage = e.target.value; setEducation(a); }}
                    placeholder="8.5 CGPA / 85%" className={inputCls()} />
                </div>
              </div>
              {education.length > 1 && (
                <button onClick={() => setEducation(education.filter((_, j) => j !== i))}
                  className="text-xs text-red-500 hover:text-red-700">✕ Remove</button>
              )}
            </div>
          ))}
          <button onClick={() => setEducation([...education, { degree: "", institution: "", year: "", percentage: "" }])}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            + {t("addEducation")}
          </button>
        </div>
      </section>

      {/* Experience */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">💼 {t("experience")}</h2>
        <div className="space-y-4">
          {experience.map((exp, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t("company")}</label>
                  <input value={exp.company} onChange={e => { const a = [...experience]; a[i].company = e.target.value; setExperience(a); }}
                    placeholder="XYZ Company" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t("role")}</label>
                  <input value={exp.role} onChange={e => { const a = [...experience]; a[i].role = e.target.value; setExperience(a); }}
                    placeholder="Software Intern" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t("duration")}</label>
                  <input value={exp.duration} onChange={e => { const a = [...experience]; a[i].duration = e.target.value; setExperience(a); }}
                    placeholder="Jun 2023 – Aug 2023" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{t("description")}</label>
                  <input value={exp.description} onChange={e => { const a = [...experience]; a[i].description = e.target.value; setExperience(a); }}
                    placeholder="Worked on React frontend..." className={inputCls()} />
                </div>
              </div>
              {experience.length > 1 && (
                <button onClick={() => setExperience(experience.filter((_, j) => j !== i))}
                  className="text-xs text-red-500 hover:text-red-700">✕ Remove</button>
              )}
            </div>
          ))}
          <button onClick={() => setExperience([...experience, { company: "", role: "", duration: "", description: "" }])}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            + {t("addExperience")}
          </button>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">⚡ {t("skills")}</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
              <input value={skill} onChange={e => { const a = [...skills]; a[i] = e.target.value; setSkills(a); }}
                placeholder={t("skillPlaceholder")} className="bg-transparent text-sm text-blue-700 outline-none w-28" />
              {skills.length > 1 && (
                <button onClick={() => setSkills(skills.filter((_, j) => j !== i))} className="text-blue-400 hover:text-red-500 ml-1">✕</button>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setSkills([...skills, ""])}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ {t("addSkill")}</button>
      </section>

      {/* Certifications */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">📜 {t("certifications")}</h2>
        <div className="space-y-2">
          {certifications.map((cert, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={cert} onChange={e => { const a = [...certifications]; a[i] = e.target.value; setCertifications(a); }}
                placeholder="AWS Certified Cloud Practitioner (2024)" className={`${inputCls()} flex-1`} />
              {certifications.length > 1 && (
                <button onClick={() => setCertifications(certifications.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-600 font-bold text-lg">✕</button>
              )}
            </div>
          ))}
          <button onClick={() => setCertifications([...certifications, ""])}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ {t("addCertification")}</button>
        </div>
      </section>

      {/* Submit */}
      <button onClick={handleSubmit}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all hover:shadow-xl">
        {t("next")}
      </button>
    </div>
  );
}
