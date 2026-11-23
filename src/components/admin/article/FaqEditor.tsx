"use client";

import { useRef, useState } from "react";
import { hintClass, labelClass, secondaryButtonClass } from "@/components/admin/adminStyles";
import type { FaqItem } from "@/domain/faq";

interface FaqEditorProps {
  initialFaqs: FaqItem[];
  error?: string;
  onChange: () => void;
}

interface FaqRow {
  key: number;
  question: string;
  answer: string;
}

const maxFaqs = 12;

export function FaqEditor({ initialFaqs, error, onChange }: FaqEditorProps) {
  const nextKey = useRef(initialFaqs.length);
  const [rows, setRows] = useState<FaqRow[]>(() =>
    initialFaqs.map((faq, index) => ({ key: index, question: faq.question, answer: faq.answer })),
  );
  const [focusKey, setFocusKey] = useState<number | null>(null);

  const addRow = () => {
    const key = nextKey.current;
    nextKey.current += 1;
    setRows((current) => [...current, { key, question: "", answer: "" }]);
    setFocusKey(key);
    onChange();
  };

  const removeRow = (key: number) => {
    setRows((current) => current.filter((row) => row.key !== key));
    onChange();
  };

  return (
    <div id="faqs" className="field-group" tabIndex={-1}>
      {rows.length === 0 ? <p className="text-base text-nila/80">Belum ada tanya jawab.</p> : null}
      <ol className="space-y-5">
        {rows.map((row, index) => (
          <li key={row.key} className="rounded-2xl border border-nila/15 bg-kapas p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-base font-extrabold">Tanya jawab {index + 1}</p>
              <button
                type="button"
                onClick={() => removeRow(row.key)}
                className="min-h-11 rounded-full px-4 font-display text-base font-bold text-galat underline underline-offset-4 hover:bg-galat/10"
              >
                Hapus<span className="sr-only"> tanya jawab {index + 1}</span>
              </button>
            </div>
            <div className="mt-3">
              <label htmlFor={`faq-q-${row.key}`} className={labelClass}>
                Pertanyaan
              </label>
              <input
                id={`faq-q-${row.key}`}
                name="faqQuestion"
                type="text"
                maxLength={300}
                defaultValue={row.question}
                autoFocus={focusKey === row.key}
                className="field-control mt-1.5"
              />
            </div>
            <div className="mt-3">
              <label htmlFor={`faq-a-${row.key}`} className={labelClass}>
                Jawaban
              </label>
              <textarea
                id={`faq-a-${row.key}`}
                name="faqAnswer"
                rows={4}
                maxLength={3000}
                defaultValue={row.answer}
                className="field-control mt-1.5"
              />
            </div>
          </li>
        ))}
      </ol>
      {rows.length < maxFaqs ? (
        <button type="button" onClick={addRow} className={`${secondaryButtonClass} mt-4`}>
          Tambah pertanyaan
        </button>
      ) : (
        <p className={hintClass}>Maksimal {maxFaqs} tanya jawab.</p>
      )}
      <span className="field-error" data-server={error ? "" : undefined}>
        {error}
      </span>
    </div>
  );
}
