'use client';

import React from 'react';

interface FieldSchema {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface DynamicFormProps {
  schema: string; // JSON string
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
}

export default function DynamicForm({ schema, values, onChange }: DynamicFormProps) {
  let fields: FieldSchema[] = [];
  try {
    fields = JSON.parse(schema || '[]');
  } catch (e) {
    console.error("Failed to parse formSchema", e);
    return (
      <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-center gap-3">
         <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shrink-0">!</div>
         <p className="text-xs text-rose-600 font-bold italic">Format konfigurasi form bermasalah. Hubungi IT.</p>
      </div>
    );
  }

  if (fields.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {fields.map((field) => (
        <div key={field.name} className={`space-y-2 group ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 flex justify-between group-focus-within:text-emerald-600 transition-colors">
            {field.label}
            {field.required && <span className="text-rose-500 font-black">*</span>}
          </label>

          <div className="relative">
            {field.type === 'textarea' ? (
              <textarea
                rows={3}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-6 py-6 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm shadow-inner resize-none"
                value={values[field.name] || ''}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
            ) : field.type === 'select' ? (
              <select
                required={field.required}
                className="w-full px-6 py-6 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm shadow-inner appearance-none cursor-pointer"
                value={values[field.name] || ''}
                onChange={(e) => onChange(field.name, e.target.value)}
              >
                <option value="">-- Pilih {field.label} --</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-6 py-6 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm shadow-inner"
                value={values[field.name] || ''}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
