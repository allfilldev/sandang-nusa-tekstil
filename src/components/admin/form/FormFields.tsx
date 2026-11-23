"use client";

import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { hintClass, labelClass } from "@/components/admin/adminStyles";
import { countWords } from "@/lib/text";

export interface FieldCounter {
  unit: "karakter" | "kata";
  min?: number;
  max: number;
}

interface FieldBaseProps {
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  // Galat dari server untuk isian ini.
  error?: string;
  required?: boolean;
  // Teks galat bawaan saat isian tidak lolos aturan browser (kosong, terlalu pendek, format salah).
  errorText?: string;
  counter?: FieldCounter;
  className?: string;
  defaultValue?: string;
  // Diisi kalau isian dikendalikan induknya (misalnya alamat artikel yang mengikuti judul).
  value?: string;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  readOnly?: boolean;
  onValueChange?: (value: string) => void;
}

interface TextFieldProps extends FieldBaseProps {
  type?: "text" | "email" | "url";
  autoComplete?: string;
  inputMode?: "text" | "email" | "url" | "numeric";
  pattern?: string;
  spellCheck?: boolean;
}

interface TextAreaFieldProps extends FieldBaseProps {
  rows?: number;
  monospace?: boolean;
}

function measure(value: string, counter: FieldCounter): number {
  return counter.unit === "kata" ? countWords(value) : value.length;
}

function CounterText({ value, counter }: { value: string; counter: FieldCounter }) {
  const amount = measure(value, counter);
  const inRange = amount <= counter.max && (counter.min === undefined || amount >= counter.min);
  const target = counter.min === undefined ? `maksimal ${counter.max}` : `${counter.min} sampai ${counter.max}`;

  return (
    <span className={`mt-1 block text-[0.9375rem] tabular-nums ${inRange || amount === 0 ? "text-nila/75" : "font-bold text-galat"}`}>
      {amount} {counter.unit} (target {target})
    </span>
  );
}

function describedBy(hintId: string | null, errorId: string, hasServerError: boolean): string | undefined {
  const ids = [hintId, hasServerError ? errorId : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

function useCounter(
  defaultValue: string | undefined,
  controlledValue: string | undefined,
  onValueChange?: (value: string) => void,
) {
  const [innerValue, setInnerValue] = useState(defaultValue ?? "");
  const value = controlledValue ?? innerValue;
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInnerValue(event.currentTarget.value);
    onValueChange?.(event.currentTarget.value);
  };
  return { value, handleChange };
}

export function TextField({
  name,
  label,
  hint,
  error,
  required = false,
  errorText = "Isian ini belum sesuai.",
  counter,
  className = "",
  defaultValue,
  value: controlledValue,
  maxLength,
  minLength,
  placeholder,
  readOnly,
  onValueChange,
  type = "text",
  autoComplete,
  inputMode,
  pattern,
  spellCheck,
}: TextFieldProps) {
  const { value, handleChange } = useCounter(defaultValue, controlledValue, onValueChange);
  const hintId = hint ? `${name}-hint` : null;
  const errorId = `${name}-error`;

  return (
    <div className={`field-group ${className}`}>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-galat">
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <span id={hintId ?? undefined} className={hintClass}>
          {hint}
        </span>
      ) : null}
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        {...(controlledValue === undefined ? { defaultValue } : { value: controlledValue })}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        readOnly={readOnly}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        spellCheck={spellCheck}
        autoCapitalize={type === "email" || type === "url" ? "none" : undefined}
        autoCorrect={type === "email" || type === "url" ? "off" : undefined}
        onChange={handleChange}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy(hintId, errorId, Boolean(error))}
        data-error={errorId}
        data-server-error={error ? "" : undefined}
        className="field-control mt-1.5"
      />
      {counter ? <CounterText value={value} counter={counter} /> : null}
      <span id={errorId} className="field-error" data-default={errorText} data-server={error ? "" : undefined}>
        {error ?? errorText}
      </span>
    </div>
  );
}

export function TextAreaField({
  name,
  label,
  hint,
  error,
  required = false,
  errorText = "Isian ini belum sesuai.",
  counter,
  className = "",
  defaultValue,
  value: controlledValue,
  maxLength,
  minLength,
  placeholder,
  readOnly,
  onValueChange,
  rows = 5,
  monospace = false,
}: TextAreaFieldProps) {
  const { value, handleChange } = useCounter(defaultValue, controlledValue, onValueChange);
  const hintId = hint ? `${name}-hint` : null;
  const errorId = `${name}-error`;

  return (
    <div className={`field-group ${className}`}>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-galat">
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <span id={hintId ?? undefined} className={hintClass}>
          {hint}
        </span>
      ) : null}
      <textarea
        id={name}
        name={name}
        required={required}
        {...(controlledValue === undefined ? { defaultValue } : { value: controlledValue })}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        onChange={handleChange}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy(hintId, errorId, Boolean(error))}
        data-error={errorId}
        data-server-error={error ? "" : undefined}
        className={`field-control mt-1.5 ${monospace ? "font-mono text-[0.9375rem] leading-relaxed" : ""}`}
      />
      {counter ? <CounterText value={value} counter={counter} /> : null}
      <span id={errorId} className="field-error" data-default={errorText} data-server={error ? "" : undefined}>
        {error ?? errorText}
      </span>
    </div>
  );
}

interface PasswordFieldProps {
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
  error?: string;
  hint?: ReactNode;
  minLength?: number;
  errorText?: string;
  className?: string;
}

export function PasswordField({
  name,
  label,
  autoComplete,
  error,
  hint,
  minLength,
  errorText = "Isi kata sandi.",
  className = "",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const hintId = hint ? `${name}-hint` : null;
  const errorId = `${name}-error`;
  const warningId = `${name}-warning`;

  return (
    <div className={`field-group ${className}`}>
      <label htmlFor={name} className={labelClass}>
        {label}
        <span aria-hidden="true" className="ml-1 text-galat">
          *
        </span>
      </label>
      {hint ? (
        <span id={hintId ?? undefined} className={hintClass}>
          {hint}
        </span>
      ) : null}
      <div className="mt-1.5 flex items-stretch gap-2">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy(hintId, errorId, Boolean(error))}
          data-error={errorId}
          data-server-error={error ? "" : undefined}
          className="field-control min-w-0 flex-1"
        />
        <button
          type="button"
          aria-pressed={visible}
          aria-describedby={warningId}
          onClick={() => setVisible((current) => !current)}
          className="min-h-12 shrink-0 rounded-2xl border-2 border-nila px-4 font-display text-base font-bold text-nila hover:bg-nila hover:text-benang"
        >
          {visible ? "Sembunyikan" : "Tampilkan"}
        </button>
      </div>
      <span id={warningId} className="sr-only">
        Peringatan: tombol ini menampilkan kata sandi di layar.
      </span>
      <span id={errorId} className="field-error" data-default={errorText} data-server={error ? "" : undefined}>
        {error ?? errorText}
      </span>
    </div>
  );
}
