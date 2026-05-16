"use client";

import { FormEvent, useEffect, useState } from "react";

type Client = { id: string; business: string; owner: string; gstin: string; phone: string; city: string; fee: number };
const storageKey = "taxflow_clients_v1";

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [firm, setFirm] = useState("My CA Firm");

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { firm: string; clients: Client[] };
      setFirm(saved.firm || "My CA Firm");
      setClients(saved.clients || []);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ firm, clients }));
  }, [firm, clients]);

  function addClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const client: Client = {
      id: `client-${Date.now()}`,
      business: String(data.get("business") || "New client"),
      owner: String(data.get("owner") || ""),
      gstin: String(data.get("gstin") || ""),
      phone: String(data.get("phone") || ""),
      city: String(data.get("city") || ""),
      fee: Number(data.get("fee") || 0)
    };
    setClients((current) => [client, ...current]);
    event.currentTarget.reset();
  }

  const unpaid = clients.reduce((sum, client) => sum + client.fee, 0);

  return <main className="min-h-screen bg-slate-50 p-4 text-slate-950 md:p-8"><header className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-bold text-blue-700">TaxFlow</p><h1 className="text-3xl font-black">{firm}</h1><p className="mt-2 text-slate-600">CA/GST firm control room. New users start with zero clients.</p></div><a href="/login" className="rounded-2xl bg-blue-600 px-5 py-3 text-center font-black text-white">Sign in / Sign up</a></header><section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-4"><Metric label="Clients" value={clients.length} /><Metric label="Pending filings" value={clients.length} /><Metric label="Waiting docs" value={clients.length} /><Metric label="Unpaid fees" value={`₹${unpaid.toLocaleString("en-IN")}`} /></section><section className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]"><div className="rounded-3xl border bg-white p-5"><h2 className="text-xl font-black">Clients</h2>{clients.length === 0 ? <div className="mt-6 rounded-3xl border border-dashed p-8 text-center"><h3 className="text-2xl font-black">No clients yet</h3><p className="mt-2 text-slate-500">Add your first GST client. No demo clients are shown.</p></div> : <div className="mt-4 grid gap-4 md:grid-cols-2">{clients.map((client) => <div key={client.id} className="rounded-3xl border bg-slate-50 p-5"><h3 className="font-black">{client.business}</h3><p className="text-sm text-slate-500">{client.owner || "Owner not added"} · {client.city || "City not added"}</p><p className="mt-3 text-sm">GSTIN: <b>{client.gstin || "Not added"}</b></p><p className="text-sm">Monthly fee: <b>₹{client.fee.toLocaleString("en-IN")}</b></p><a className="mt-4 inline-block rounded-2xl bg-green-600 px-4 py-2 text-sm font-black text-white" href={`https://wa.me/${client.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${client.owner || client.business}, please share GST documents for this month.`)}`} target="_blank">WhatsApp reminder</a></div>)}</div>}</div><form onSubmit={addClient} className="h-fit rounded-3xl border bg-white p-5"><h2 className="text-xl font-black">Add client</h2>{[["business","Business name"],["owner","Owner name"],["gstin","GSTIN"],["phone","WhatsApp phone"],["city","City"],["fee","Monthly fee"]].map(([name,label]) => <input key={name} name={name} placeholder={label} className="mt-3 w-full rounded-2xl border px-4 py-3" />)}<button className="mt-4 w-full rounded-2xl bg-blue-600 px-4 py-3 font-black text-white">Create client</button></form></section><section className="mx-auto mt-8 max-w-6xl rounded-3xl border bg-white p-5"><h2 className="text-xl font-black">Login status</h2><p className="mt-2 text-slate-600">Email/password and Google login UI are available at <a href="/login" className="font-bold text-blue-700">/login</a>. Google login needs Google provider enabled in Supabase and Vercel env vars set.</p><input className="mt-4 w-full rounded-2xl border px-4 py-3" value={firm} onChange={(e) => setFirm(e.target.value)} /></section></main>;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-3xl border bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-3 text-3xl font-black">{value}</p></div>;
}
