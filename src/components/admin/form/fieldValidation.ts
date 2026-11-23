// Menyamakan status "tidak valid" yang terlihat (:user-invalid) dengan aria-invalid, hanya setelah pengguna berinteraksi.
// Mengikuti panduan accessible-error-announcement dari modern-web-guidance:
// - aria-invalid="false" sejak awal, "true" hanya saat :user-invalid cocok;
// - pesan galat masuk ke aria-describedby hanya saat ditampilkan;
// - satu region aria-live polite mengumumkan galat yang muncul saat pengguna meninggalkan isian;
// - saat kirim gagal, browser memindahkan fokus ke isian pertama yang salah, jadi tidak diumumkan dua kali.
// Galat dari server (atribut data-server-error) dibersihkan begitu pengguna mengubah isiannya.

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const skippedInputTypes = new Set(["hidden", "button", "submit", "reset", "image", "file", "checkbox", "radio"]);

function isField(target: EventTarget | null): target is FieldElement {
  if (target instanceof HTMLInputElement) {
    return !skippedInputTypes.has(target.type);
  }
  return target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement;
}

function linkError(field: FieldElement, shown: boolean): void {
  const errorId = field.dataset.error;
  if (!errorId) {
    return;
  }
  const ids = (field.getAttribute("aria-describedby") ?? "").split(/\s+/).filter((id) => id && id !== errorId);
  if (shown) {
    ids.push(errorId);
  }
  if (ids.length > 0) {
    field.setAttribute("aria-describedby", ids.join(" "));
  } else {
    field.removeAttribute("aria-describedby");
  }
}

function spokenText(node: Element): string {
  const copy = node.cloneNode(true) as Element;
  copy.querySelectorAll('[aria-hidden="true"]').forEach((child) => child.remove());
  return (copy.textContent ?? "").replace(/\s+/g, " ").trim();
}

export function installFieldValidation(form: HTMLFormElement, announcer: HTMLElement): () => void {
  const supportsUserInvalid = CSS.supports("selector(:user-invalid)");
  const flagged = new WeakSet<Element>();
  const announced = new WeakSet<Element>();
  const interacted = new WeakSet<Element>();
  let announceTimer: number | undefined;
  let announcedField: Element | null = null;

  const isUserInvalid = (field: FieldElement): boolean => {
    if (supportsUserInvalid) {
      return field.matches(":user-invalid");
    }
    return interacted.has(field) && !field.validity.valid;
  };

  const announceError = (field: FieldElement): void => {
    const error = field.dataset.error ? document.getElementById(field.dataset.error) : null;
    if (!error) {
      return;
    }
    const label = field.labels?.[0] ? `${spokenText(field.labels[0])}: ` : "";
    window.clearTimeout(announceTimer);
    announcer.textContent = "";
    announcedField = field;
    // Tunggu pembaca layar selesai membacakan isian yang menerima fokus berikutnya.
    announceTimer = window.setTimeout(() => {
      announcer.textContent = label + spokenText(error);
    }, 500);
  };

  const clearServerError = (field: FieldElement): void => {
    if (!field.dataset.serverError) {
      return;
    }
    delete field.dataset.serverError;
    const error = field.dataset.error ? document.getElementById(field.dataset.error) : null;
    if (error) {
      error.removeAttribute("data-server");
      if (error.dataset.default) {
        error.textContent = error.dataset.default;
      }
    }
    field.setAttribute("aria-invalid", "false");
    linkError(field, false);
  };

  const sync = (field: FieldElement, announce = false): void => {
    if (field.dataset.serverError) {
      return;
    }
    const invalid = isUserInvalid(field);
    field.classList.toggle("user-invalid-fallback", !supportsUserInvalid && invalid);
    if (invalid) {
      if (announce && !announced.has(field)) {
        announceError(field);
        announced.add(field);
      }
      field.setAttribute("aria-invalid", "true");
      linkError(field, true);
      flagged.add(field);
    } else if (flagged.has(field) || field.getAttribute("aria-invalid") !== "true") {
      field.setAttribute("aria-invalid", "false");
      linkError(field, false);
      flagged.delete(field);
      announced.delete(field);
      if (announcedField === field) {
        window.clearTimeout(announceTimer);
        announcer.textContent = "";
      }
    }
  };

  const onBlur = (event: Event): void => {
    if (isField(event.target)) {
      interacted.add(event.target);
      sync(event.target, true);
    }
  };
  const onInput = (event: Event): void => {
    if (!isField(event.target)) {
      return;
    }
    clearServerError(event.target);
    if (event.target.hasAttribute("aria-invalid")) {
      sync(event.target);
    }
  };
  const onChange = (event: Event): void => {
    if (isField(event.target)) {
      interacted.add(event.target);
      clearServerError(event.target);
      sync(event.target, true);
    }
  };
  const onInvalid = (event: Event): void => {
    if (isField(event.target)) {
      interacted.add(event.target);
      announced.add(event.target);
      sync(event.target);
    }
  };
  const onReset = (): void => {
    window.setTimeout(() => {
      Array.from(form.elements).filter(isField).forEach((field) => sync(field));
    });
  };

  Array.from(form.elements).filter(isField).forEach((field) => sync(field));

  form.addEventListener("blur", onBlur, true);
  form.addEventListener("input", onInput);
  form.addEventListener("change", onChange, true);
  form.addEventListener("invalid", onInvalid, true);
  form.addEventListener("reset", onReset, true);

  return () => {
    window.clearTimeout(announceTimer);
    form.removeEventListener("blur", onBlur, true);
    form.removeEventListener("input", onInput);
    form.removeEventListener("change", onChange, true);
    form.removeEventListener("invalid", onInvalid, true);
    form.removeEventListener("reset", onReset, true);
  };
}
