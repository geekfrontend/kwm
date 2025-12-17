export function formatRupiah(value: number): string {
  if (isNaN(value)) return "Rp.0,00";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(value);
}
