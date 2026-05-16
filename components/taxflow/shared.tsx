import { statusLabel } from "@/lib/taxflow";

export function Badge({ value }: { value: string }) {
  const danger = ["missing", "overdue", "risky", "urgent", "blocked", "issue_found"].some((word) => value.includes(word));
  const good = ["paid", "filed", "completed", "checked", "approved", "received"].some((word) => value.includes(word));
  const tone = danger ? "bg-red-50 text-red-700" : good ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${tone}`}>{statusLabel[value] || value}</span>;
}

export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-3xl border bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-3 text-3xl font-black">{value}</p></div>;
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="rounded-3xl border border-dashed bg-white p-8 text-center"><h3 className="text-xl font-black">{title}</h3><p className="mt-2 text-sm text-slate-500">{body}</p></div>;
}
