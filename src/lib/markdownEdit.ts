// Perubahan teks untuk tombol toolbar editor Markdown. Fungsi murni: menerima teks dan pilihan,
// mengembalikan bagian yang diganti beserta pilihan baru. Penerapannya ke textarea ada di MarkdownEditor.

export interface TextEdit {
  // Rentang yang diganti pada teks asal.
  start: number;
  end: number;
  replacement: string;
  // Pilihan setelah penggantian, relatif terhadap awal teks hasil.
  selectStart: number;
  selectEnd: number;
}

function lineBounds(value: string, start: number, end: number): { lineStart: number; lineEnd: number } {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", end);
  return { lineStart, lineEnd: nextBreak === -1 ? value.length : nextBreak };
}

export function wrapEdit(value: string, start: number, end: number, marker: string, placeholder: string): TextEdit {
  const selected = value.slice(start, end);
  const alreadyWrapped =
    selected.length >= marker.length * 2 && selected.startsWith(marker) && selected.endsWith(marker);

  if (alreadyWrapped) {
    const inner = selected.slice(marker.length, selected.length - marker.length);
    return { start, end, replacement: inner, selectStart: start, selectEnd: start + inner.length };
  }

  const text = selected || placeholder;
  const replacement = `${marker}${text}${marker}`;
  return {
    start,
    end,
    replacement,
    selectStart: start + marker.length,
    selectEnd: start + marker.length + text.length,
  };
}

export function linkEdit(value: string, start: number, end: number): TextEdit {
  const selected = value.slice(start, end);
  const label = selected || "teks tautan";
  const placeholderUrl = "https://";
  const replacement = `[${label}](${placeholderUrl})`;
  const urlStart = start + label.length + 3;
  return { start, end, replacement, selectStart: urlStart, selectEnd: urlStart + placeholderUrl.length };
}

export function headingEdit(value: string, start: number, end: number, level: 2 | 3): TextEdit {
  const { lineStart, lineEnd } = lineBounds(value, start, end);
  const lines = value.slice(lineStart, lineEnd).split("\n");
  const prefix = `${"#".repeat(level)} `;
  const allHaveLevel = lines.every((line) => line.startsWith(prefix));
  const changed = lines
    .map((line) => {
      const bare = line.replace(/^#{1,6}[ \t]+/, "");
      return allHaveLevel ? bare : `${prefix}${bare || "Judul bagian"}`;
    })
    .join("\n");
  return { start: lineStart, end: lineEnd, replacement: changed, selectStart: lineStart, selectEnd: lineStart + changed.length };
}

export function listEdit(value: string, start: number, end: number, ordered: boolean): TextEdit {
  const { lineStart, lineEnd } = lineBounds(value, start, end);
  const lines = value.slice(lineStart, lineEnd).split("\n");
  const marker = (index: number): string => (ordered ? `${index + 1}. ` : "- ");
  const alreadyList = lines.every((line) => (ordered ? /^\d+\.[ \t]+/.test(line) : /^[-*][ \t]+/.test(line)));
  const changed = lines
    .map((line, index) => {
      const bare = line.replace(/^(?:\d+\.|[-*])[ \t]+/, "");
      return alreadyList ? bare : `${marker(index)}${bare || "Isi poin"}`;
    })
    .join("\n");
  return { start: lineStart, end: lineEnd, replacement: changed, selectStart: lineStart, selectEnd: lineStart + changed.length };
}

function blockPrefix(value: string, position: number): string {
  if (position === 0) {
    return "";
  }
  const before = value.slice(0, position);
  if (before.endsWith("\n\n")) {
    return "";
  }
  return before.endsWith("\n") ? "\n" : "\n\n";
}

function blockSuffix(value: string, position: number): string {
  const after = value.slice(position);
  if (after.length === 0 || after.startsWith("\n\n")) {
    return after.length === 0 ? "\n" : "";
  }
  return after.startsWith("\n") ? "\n" : "\n\n";
}

export function tableEdit(value: string, start: number, end: number): TextEdit {
  const table = ["| Judul kolom 1 | Judul kolom 2 |", "| --- | --- |", "| Isi | Isi |", "| Isi | Isi |"].join("\n");
  const prefix = blockPrefix(value, start);
  const suffix = blockSuffix(value, end);
  const replacement = `${prefix}${table}${suffix}`;
  const tableStart = start + prefix.length;
  return { start, end, replacement, selectStart: tableStart + 2, selectEnd: tableStart + 2 + "Judul kolom 1".length };
}

export function imageEdit(value: string, start: number, end: number, url: string, alt: string, caption: string): TextEdit {
  const safeAlt = alt.replace(/[\[\]]/g, "");
  const safeCaption = caption.replace(/"/g, "'");
  const markdown = caption ? `![${safeAlt}](${url} "${safeCaption}")` : `![${safeAlt}](${url})`;
  const prefix = blockPrefix(value, start);
  const suffix = blockSuffix(value, end);
  const replacement = `${prefix}${markdown}${suffix}`;
  const position = start + replacement.length;
  return { start, end, replacement, selectStart: position, selectEnd: position };
}
