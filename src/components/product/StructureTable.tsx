import type { FabricStructure } from "@/domain/product";

interface StructureTableProps {
  structures: FabricStructure[];
  caption: string;
  captionId: string;
}

export function StructureTable({ structures, caption, captionId }: StructureTableProps) {
  return (
    <div tabIndex={0} role="region" aria-labelledby={captionId} className="table-wrapper">
      <table className="data-table data-table-stack">
        <caption id={captionId}>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Struktur</th>
            <th scope="col">Kelompok</th>
            <th scope="col">Ciri umum</th>
            <th scope="col">Pemakaian umum</th>
          </tr>
        </thead>
        <tbody>
          {structures.map((structure) => (
            <tr key={structure.id}>
              <th scope="row">{structure.name}</th>
              <td data-label="Kelompok">{structure.family}</td>
              <td data-label="Ciri umum">{structure.traits}</td>
              <td data-label="Pemakaian umum">{structure.commonUses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
