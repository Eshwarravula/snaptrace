"use client";

import { useState } from "react";
import { EXPERTS_DATA } from "@/lib/constants";
import { Expert } from "@/lib/types";

interface ExpertCase {
  id: string;
  client: string;
  phone: string;
  city: string;
  category: string;
  description: string;
  status: "assigned" | "in-progress" | "completed";
  urgency: "normal" | "soon" | "urgent";
  expertFee: number;
  paid: boolean;
  date: string;
}

const DEMO_CASES: ExpertCase[] = [
  { id: "PF-004", client: "Lakshmi Devi", phone: "6543210987", city: "Khammam", category: "Property Records", description: "Land record shows wrong survey number in Dharani. Tried to correct online but keeps getting rejected.", status: "in-progress", urgency: "soon", expertFee: 1500, paid: false, date: "2026-04-04" },
  { id: "PF-005", client: "Suresh Rao", phone: "5432109876", city: "Hyderabad", category: "GST & Tax", description: "Got GST notice for FY 2023-24. Input tax credit mismatch. Need someone to handle the response.", status: "assigned", urgency: "urgent", expertFee: 10000, paid: false, date: "2026-04-05" },
  { id: "PF-006", client: "Meena Kumari", phone: "4321098765", city: "Narapally", category: "Late Birth Registration", description: "My son born in 2018 but birth was never registered. Need late registration with GHMC. Have hospital records.", status: "completed", urgency: "normal", expertFee: 1500, paid: true, date: "2026-04-01" },
  { id: "PF-007", client: "Rajesh Yadav", phone: "3210987654", city: "Kodad", category: "Legal Heir & Succession", description: "Father passed away. Need legal heir certificate for bank account and property transfer. 4 legal heirs total.", status: "assigned", urgency: "soon", expertFee: 1500, paid: false, date: "2026-04-06" },
  { id: "PF-008", client: "Sunitha Reddy", phone: "2109876543", city: "Secunderabad", category: "Name Mismatch", description: "Name in all documents is different. Aadhaar says Sunitha, PAN says S. Reddy, passport says Sunitha R.", status: "in-progress", urgency: "normal", expertFee: 1500, paid: false, date: "2026-04-03" },
];

type Tab = "active" | "completed" | "payouts";

export default function ExpertPanel() {
  const [loggedIn, setLoggedIn] = useState<Expert | null>(null);
  const [phone, setPhone] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [cases, setCases] = useState<ExpertCase[]>(DEMO_CASES);
  const [tab, setTab] = useState<Tab>("active");

  function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    const found = EXPERTS_DATA.find(ex => ex.phone === phone.trim());
    if (found) { setLoggedIn(found); setLoginError(false); }
    else setLoginError(true);
  }

  function updateStatus(caseId: string, newStatus: ExpertCase["status"]) {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <form onSubmit={handleLogin} className="bg-surface border border-border rounded-2xl p-10 shadow-lg">
            <h2 className="text-xl font-bold mb-1.5">Expert Login</h2>
            <p className="text-sm text-text-secondary mb-6">Enter your registered phone number to access your cases.</p>
            <input
              type="tel" value={phone} maxLength={10}
              onChange={e => { setPhone(e.target.value); setLoginError(false); }}
              onKeyUp={e => { if (e.key === "Enter") handleLogin(); }}
              placeholder="Your phone number"
              className="w-full px-4 py-3.5 border-[1.5px] border-border rounded-xl bg-bg text-base focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/10 mb-3.5 transition-all"
            />
            <button type="submit" className="w-full py-3.5 bg-accent text-white rounded-xl text-base font-bold hover:bg-accent-dark transition-all">Login</button>
            {loginError && <p className="text-red text-sm mt-3">Phone number not found. Please check and try again.</p>}
          </form>
          <p className="mt-4 text-xs text-text-secondary">Powered by PaperFix</p>
        </div>
      </div>
    );
  }

  const myCases = cases.filter(c => {
    if (loggedIn.id === "ravuri") return c.id === "PF-004";
    if (loggedIn.id === "harsh") return c.id === "PF-005";
    if (loggedIn.id === "bhanu") return c.id === "PF-006";
    if (loggedIn.id === "fayaz") return c.id === "PF-007";
    if (loggedIn.id === "raviteja") return c.id === "PF-008";
    return false;
  });

  const activeCases = myCases.filter(c => c.status !== "completed");
  const completedCases = myCases.filter(c => c.status === "completed");
  const pendingPayout = completedCases.filter(c => !c.paid).reduce((s, c) => s + c.expertFee, 0);
  const totalEarned = completedCases.reduce((s, c) => s + c.expertFee, 0);
  const totalPaid = completedCases.filter(c => c.paid).reduce((s, c) => s + c.expertFee, 0);

  const urgencyClass: Record<string, string> = {
    urgent: "bg-red-light text-red",
    soon: "bg-yellow-light text-yellow",
    normal: "bg-bg text-text-secondary",
  };
  const statusText: Record<string, string> = { assigned: "New Assignment", "in-progress": "In Progress", completed: "Completed" };
  const statusClass: Record<string, string> = { assigned: "bg-blue-light text-blue", "in-progress": "bg-yellow-light text-yellow", completed: "bg-accent-light text-accent" };

  return (
    <>
      {/* TOPBAR */}
      <div className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3.5">
          <div className="text-xl font-extrabold text-accent-dark tracking-tight">Paper<span className="text-orange">Fix</span></div>
          <div className="w-px h-6 bg-border" />
          <span className="text-sm font-semibold text-text-secondary">Expert Panel</span>
        </div>
        <div className="flex items-center gap-2 bg-accent-light px-3.5 py-1.5 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-[0.72rem] font-bold">{loggedIn.initials}</div>
          <span className="text-sm font-semibold text-accent-dark">{loggedIn.name}</span>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-7">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          <div className="bg-surface border border-border rounded-xl p-4"><div className="text-xs text-text-secondary mb-1">Active Cases</div><div className="text-2xl font-bold">{activeCases.length}</div></div>
          <div className="bg-surface border border-border rounded-xl p-4"><div className="text-xs text-text-secondary mb-1">Completed</div><div className="text-2xl font-bold">{completedCases.length}</div></div>
          <div className="bg-surface border border-border rounded-xl p-4"><div className="text-xs text-text-secondary mb-1">Pending Payout</div><div className="text-2xl font-bold">₹{pendingPayout.toLocaleString()}</div></div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 mb-5 bg-surface border border-border rounded-xl p-1 w-fit">
          {(["active", "completed", "payouts"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-accent text-white" : "text-text-secondary hover:text-text"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === "active" && activeCases.length > 0 && (
                <span className={`ml-1.5 text-[0.68rem] font-bold px-1.5 py-0.5 rounded-md ${tab === t ? "bg-white/30" : "bg-orange text-white"}`}>{activeCases.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ACTIVE TAB */}
        {tab === "active" && (
          <div className="flex flex-col gap-3.5">
            {activeCases.length === 0 ? (
              <div className="text-center py-16 text-text-secondary"><div className="text-4xl mb-3">📭</div><h3 className="text-base font-semibold text-text mb-1">No active cases</h3><p className="text-sm">New cases will appear here when assigned to you.</p></div>
            ) : activeCases.map(c => (
              <div key={c.id} className="bg-surface border border-border rounded-xl p-5 hover:shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-secondary">{c.id}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusClass[c.status]}`}>{statusText[c.status]}</span>
                  </div>
                  <span className={`text-[0.7rem] font-bold px-2.5 py-0.5 rounded-md uppercase ${urgencyClass[c.urgency]}`}>{c.urgency}</span>
                </div>
                <div className="text-base font-bold mb-0.5">{c.client}</div>
                <div className="text-sm text-accent font-semibold mb-2">{c.category}</div>
                <div className="bg-bg rounded-lg p-3 text-sm text-text-secondary leading-relaxed mb-3.5">{c.description}</div>
                <div className="flex flex-wrap gap-4 text-xs text-text-secondary mb-3.5">
                  <span>📞 {c.phone}</span>
                  <span>📍 {c.city}</span>
                  <span>📅 {c.date}</span>
                  <span>💳 ₹{c.expertFee.toLocaleString()} (your fee)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.status === "assigned" && (
                    <button onClick={() => updateStatus(c.id, "in-progress")} className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-all">Accept & Start</button>
                  )}
                  {c.status === "in-progress" && (
                    <button onClick={() => updateStatus(c.id, "completed")} className="px-4 py-2.5 rounded-lg bg-orange text-white text-sm font-semibold hover:opacity-90 transition-all">Mark Completed</button>
                  )}
                  <a href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(`Hi ${c.client}, I'm your assigned expert from PaperFix for your ${c.category} case. Let me help you with this.`)}`} target="_blank" className="px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1DAE54] transition-all inline-flex items-center gap-1.5">WhatsApp Client</a>
                  <a href={`tel:${c.phone}`} className="px-4 py-2.5 rounded-lg bg-bg text-text border border-border text-sm font-semibold hover:border-text-secondary transition-all">Call Client</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPLETED TAB */}
        {tab === "completed" && (
          <div className="flex flex-col gap-3.5">
            {completedCases.length === 0 ? (
              <div className="text-center py-16 text-text-secondary"><div className="text-4xl mb-3">✅</div><h3 className="text-base font-semibold text-text mb-1">No completed cases yet</h3><p className="text-sm">Cases you complete will show up here.</p></div>
            ) : completedCases.map(c => (
              <div key={c.id} className="bg-surface border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-text-secondary">{c.id}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent-light text-accent">Completed</span>
                </div>
                <div className="text-base font-bold mb-0.5">{c.client}</div>
                <div className="text-sm text-accent font-semibold mb-2">{c.category}</div>
                <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
                  <span>📍 {c.city}</span>
                  <span>💳 ₹{c.expertFee.toLocaleString()} {c.paid ? "(Paid)" : "(Pending)"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAYOUTS TAB */}
        {tab === "payouts" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
              <div className="bg-surface border border-border rounded-xl p-4"><div className="text-xs text-text-secondary mb-1">Total Earned</div><div className="text-2xl font-bold text-accent">₹{totalEarned.toLocaleString()}</div></div>
              <div className="bg-surface border border-border rounded-xl p-4"><div className="text-xs text-text-secondary mb-1">Received</div><div className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</div></div>
              <div className="bg-surface border border-border rounded-xl p-4"><div className="text-xs text-text-secondary mb-1">Pending</div><div className="text-2xl font-bold text-orange">₹{pendingPayout.toLocaleString()}</div></div>
            </div>
            {completedCases.length === 0 ? (
              <div className="text-center py-16 text-text-secondary"><div className="text-4xl mb-3">💰</div><h3 className="text-base font-semibold text-text mb-1">No payouts yet</h3><p className="text-sm">Complete cases to earn payouts.</p></div>
            ) : completedCases.map(c => (
              <div key={c.id} className="bg-surface border border-border rounded-xl p-5 flex items-center justify-between mb-2.5">
                <div><h3 className="text-sm font-bold">{c.id} — {c.client}</h3><p className="text-xs text-text-secondary">{c.category} · {c.date}</p></div>
                <div className="text-right"><div className="text-xl font-bold text-accent">₹{c.expertFee.toLocaleString()}</div><div className={`text-xs font-semibold mt-0.5 ${c.paid ? "text-accent" : "text-orange"}`}>{c.paid ? "Paid" : "Pending"}</div></div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
