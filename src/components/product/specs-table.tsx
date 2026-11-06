import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import type { ProductFeatures } from "@/lib/types";

export function SpecsTable({ features }: { features: ProductFeatures }) {
  const entries = Object.entries(features);
  if (!entries.length) return null;
  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableBody>
          {entries.map(([key, value]) => (
            <TableRow key={key}>
              <TableHead scope="row" className="w-1/2 bg-muted/50 font-medium">
                {key}
              </TableHead>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
