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
    return <div className="text-red-500 text-xs italic">Format form bermasalah.</div>;
  }

  if (fields.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field) => (
        <div key={field.name} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex justify-between">
            {field.label}
            {field.required && <span className="text-rose-500">*</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              rows={3}
              placeholder={field.placeholder}
              required={field.required}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm shadow-inner"
              value={values[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
          ) : field.type === 'select' ? (
            <select
              required={field.required}
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm shadow-inner appearance-none"
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
              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm shadow-inner"
              value={values[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
