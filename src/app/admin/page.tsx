"use client";

import { useState, useEffect, useCallback } from "react";
import { EXPERTS_DATA, CATEGORY_MAP, MARKUP_PERCENT } from "@/lib/constants";
import type { Case } from "@/lib/types";

const DEMO_CASES: Case[] = [
  { id: "PF-001", client_name: "Ramesh Kumar", client_phone: "9876543210", city: "Kukatpally", category: "legal_heir", category_label: "Legal Heir & Succession", description: "My father passed away 6 months ago. Property is in his name. Need to transfer to my mother and siblings.", expert_id: null, status: "new", urgency: "soon", user_paid: 0, expert_paid: false, created_at: "2026-04-07" },
  { id: "PF-002", client_name: "Priya Reddy", client_phone: "8765432109", city: "Attapur", category: "name_mismatch", category_label: "Name / DOB Mismatch", description: "My name in Aadhaar is Priya Reddy but in PAN it is P. Reddy and passport has Priya R.", expert_id: null, status: "new", urgency: "urgent", user_paid: 0, expert_paid: false, created_at: "2026-04-07" },
  { id: "PF-003", client_name: "Ahmed Khan", client_phone: "7654321098", city: "Secunderabad", category: "pension", category_label: "Pension Issues", description: "Family pension not transferred after father death. Applied 3 months ago but no update.", expert_id: null, status: "new", urgency: "normal", user_paid: 0, expert_paid: false, created_at: "2026-04-06" },
  { id: "PF-004", client_name: "Lakshmi Devi", client_phone: "6543210987", city: "Khammam", category: "property", category_label: "Property Records", description: "Land record shows wrong survey number in Dharani.", expert_id: "ravuri", status: "in-progress", urgency: "soon", user_paid: 1800, expert_paid: false, created_at: "2026-04-04" },
  { id: "PF-005", client_name: "Suresh Rao", client_phone: "5432109876", city: "Hyderabad", category: "gst", category_label: "GST & Tax", description: "Got GST notice for FY 2023-24. Input tax credit mismatch.", expert_id: "harsh", status: "assigned", urgency: "urgent", user_paid: 12000, expert_paid: false, created_at: "2026-04-05" },
  { id: "PF-006", client_name: "Meena Kumari", client_phone: "4321098765", city: "Narapally", category: "birth_death", category_label: "Late Birth Registration", description: "Son born in 2018 but birth was never registered.", expert_id: "bhanu", status: "completed", urgency: "normal", user_paid: 1800, expert_paid: true, created_at: "2026-04-01" },
];

type View = "dashboard" | "cases" | "experts" | "payments";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [cases, setCases] = useState<Case[]>(DEMO_CASES);
  const [filter, setFilter] = useState("all");
  const [modalCase, setModalCase] = useState<Case | null>(null);
  const [assignCase, setAssignCase] = useState<Case | null>(null);
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [time, setTime] = useState("");

  const updateTime = useCallback(() => {
    const now = new Date();
    setTime(now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) + " · " + now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
  }, []);

  useEffect(() => { updateTime(); const t = setInterval(updateTime, 60000); return () => clearInterval(t); }, [updateTime]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === "paperfix2026") { setAuthed(true); setAuthError(false); }
    else setAuthError(true);
  }

  const newCount = cases.filter(c => c.status === "new").length;
  const inProgressCount = cases.filter(c => c.status === "in-progress" || c.status === "assigned").length;
  const completedCount = cases.filter(c => c.status === "completed").length;
  const revenue = cases.reduce((sum, c) => c.user_paid > 0 ? sum + Math.round(c.user_paid * MARKUP_PERCENT / (1 + MARKUP_PERCENT)) : sum, 0);
  const filteredCases = filter === "all" ? cases : cases.filter(c => c.status === filter);

  function getExpert(id: string | null) { return id ? EXPERTS_DATA.find(e => e.id === id) : null; }

  function assignExpert() {
    if (!assignCase || !selectedExpertId) return;
    setCases(prev => prev.map(c => c.id === assignCase.id ? { ...c, expert_id: selectedExpertId, status: "assigned" as const } : c));
    setAssignCase(null);
    setSelectedExpertId(null);
  }

  function updateStatus(id: string, status: Case["status"]) {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setModalCase(null);
  }

  function payExpert(id: string) {
    setCases(prev => prev.map(c => c.id === id ? { ...c, expert_paid: true } : c));
  }

  const statusLabel: Record<string, string> = { new: "New", assigned: "Assigned", "in-progress": "In Progress", completed: "Completed" };
  const statusClass: Record<string, string> = { new: "bg-orange-light text-orange", assigned: "bg-blue-light text-blue", "in-progress": "bg-yellow-light text-yellow", completed: "bg-accent-light text-accent" };

  if (!authed) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-surface border border-border rounded-2xl p-10 shadow-lg max-w-sm w-full text-center">
          <div className="font-[Playfair_Display,serif] text-2xl font-extrabold mb-1 text-accent-dark">Paper<span className="text-orange">Fix</span></div>
          <p className="text-sm text-text-secondary mb-6">Admin Dashboard</p>
          <input type="password" value={password} onChange={e => { setPassword(e.target.value); setAuthError(false); }} placeholder="Enter admin password" className="w-full px-4 py-3 border-[1.5px] border-border rounded-xl bg-bg text-sm focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/10 mb-3 transition-all" />
          <button type="submit" className="w-full py-3 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-dark transition-all">Login</button>
          {authError && <p className="text-red text-sm mt-3">Incorrect password. Try again.</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-60 bg-text fixed top-0 bottom-0 left-0 z-50 hidden md:flex flex-col">
        <div className="text-xl font-extrabold text-white px-6 pt-6 pb-7 tracking-tight">Paper<span className="text-orange">Fix</span></div>
        <div className="text-[0.68rem] font-bold uppercase tracking-widest text-white/35 px-6 pt-4 pb-2">Main</div>
        <nav className="flex-1">
          {([["dashboard", "Dashboard", newCount], ["cases", "All Cases", 0], ["experts", "Experts", 0], ["payments", "Payments", 0]] as [View, string, number][]).map(([v, label, badge]) => (
            <button key={v} onClick={() => setView(v)} className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all border-l-[3px] ${view === v ? "text-white bg-white/8 border-l-orange" : "text-white/60 hover:text-white hover:bg-white/5 border-l-transparent"}`}>
              {label}
              {badge > 0 && <span className="ml-auto bg-orange text-white text-[0.7rem] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
            </button>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-white/10 text-xs text-white/40">PaperFix Admin v1.0</div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 md:ml-60">
        <div className="bg-surface border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg font-bold capitalize">{view === "dashboard" ? "Dashboard" : view}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">{time}</span>
            <div className="w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center text-sm font-bold">E</div>
          </div>
        </div>

        <div className="p-7">
          {/* DASHBOARD VIEW */}
          {view === "dashboard" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                {[["New Cases", newCount, "Awaiting assignment"], ["In Progress", inProgressCount, "With experts"], ["Completed", completedCount, "This week"], ["Revenue", `₹${revenue.toLocaleString()}`, "Your 20% commission"]].map(([label, value, sub]) => (
                  <div key={String(label)} className="bg-surface border border-border rounded-xl p-5">
                    <div className="text-xs text-text-secondary font-medium mb-1.5">{label}</div>
                    <div className="text-3xl font-bold tracking-tight">{value}</div>
                    <div className="text-xs text-text-secondary mt-1">{sub}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold">Recent Cases</h2>
                <div className="flex gap-2">
                  {["all", "new", "assigned", "in-progress", "completed"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg border text-xs font-semibold transition-all ${filter === f ? "bg-accent text-white border-accent" : "bg-surface text-text-secondary border-border hover:border-text-secondary"}`}>
                      {f === "all" ? "All" : statusLabel[f]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-[#FAFAF7]">
                        {["Case #", "Client", "Category", "Expert", "Status", "Payment", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[0.75rem] font-bold uppercase tracking-wider text-text-secondary border-b border-border">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCases.map(c => {
                        const expert = getExpert(c.expert_id);
                        return (
                          <tr key={c.id} className="hover:bg-[#FAFAF7] border-b border-border last:border-0">
                            <td className="px-4 py-3.5 text-sm font-bold">{c.id}</td>
                            <td className="px-4 py-3.5"><div className="text-sm font-semibold">{c.client_name}</div><div className="text-xs text-text-secondary">{c.client_phone}</div></td>
                            <td className="px-4 py-3.5"><span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-light text-blue">{CATEGORY_MAP[c.category]?.label || c.category}</span></td>
                            <td className="px-4 py-3.5 text-sm">{expert ? expert.name : <span className="text-text-secondary">—</span>}</td>
                            <td className="px-4 py-3.5"><span className={`text-xs font-bold px-3 py-1 rounded-full ${statusClass[c.status]}`}>{statusLabel[c.status]}</span></td>
                            <td className="px-4 py-3.5">{c.user_paid > 0 ? <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-accent-light text-accent">₹{c.user_paid.toLocaleString()}</span> : <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-yellow-light text-yellow">Pending</span>}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex gap-1.5">
                                <button onClick={() => setModalCase(c)} className="px-3.5 py-1.5 rounded-lg bg-bg text-text border border-border text-xs font-semibold hover:border-text-secondary transition-all">View</button>
                                {c.status === "new" && <button onClick={() => setAssignCase(c)} className="px-3.5 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-dark transition-all">Assign</button>}
                                {c.status === "assigned" && <button onClick={() => updateStatus(c.id, "in-progress")} className="px-3.5 py-1.5 rounded-lg bg-orange text-white text-xs font-semibold hover:opacity-90 transition-all">→ In Progress</button>}
                                {c.status === "in-progress" && <button onClick={() => updateStatus(c.id, "completed")} className="px-3.5 py-1.5 rounded-lg bg-orange text-white text-xs font-semibold hover:opacity-90 transition-all">→ Complete</button>}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* EXPERTS VIEW */}
          {view === "experts" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                <div className="bg-surface border border-border rounded-xl p-5"><div className="text-xs text-text-secondary font-medium mb-1.5">Total Experts</div><div className="text-3xl font-bold">{EXPERTS_DATA.length}</div></div>
                <div className="bg-surface border border-border rounded-xl p-5"><div className="text-xs text-text-secondary font-medium mb-1.5">Active Cases</div><div className="text-3xl font-bold">{cases.filter(c => c.expert_id && c.status !== "completed").length}</div></div>
                <div className="bg-surface border border-border rounded-xl p-5"><div className="text-xs text-text-secondary font-medium mb-1.5">Completed Cases</div><div className="text-3xl font-bold">{completedCount}</div></div>
                <div className="bg-surface border border-border rounded-xl p-5"><div className="text-xs text-text-secondary font-medium mb-1.5">Pending Payouts</div><div className="text-3xl font-bold">₹{cases.filter(c => c.status === "completed" && !c.expert_paid).reduce((s, c) => s + Math.round(c.user_paid / (1 + MARKUP_PERCENT)), 0).toLocaleString()}</div></div>
              </div>
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead><tr className="bg-[#FAFAF7]">{["Expert", "Firm", "Experience", "Areas", "Fee Range", "Active Cases", "Phone"].map(h => (<th key={h} className="px-4 py-3 text-left text-[0.75rem] font-bold uppercase tracking-wider text-text-secondary border-b border-border">{h}</th>))}</tr></thead>
                    <tbody>
                      {EXPERTS_DATA.map(e => (
                        <tr key={e.id} className="hover:bg-[#FAFAF7] border-b border-border last:border-0">
                          <td className="px-4 py-3.5 text-sm font-semibold">{e.name}</td>
                          <td className="px-4 py-3.5 text-sm">{e.firm || "—"}</td>
                          <td className="px-4 py-3.5 text-sm">{e.experience}</td>
                          <td className="px-4 py-3.5 text-sm">{e.areas}</td>
                          <td className="px-4 py-3.5 text-sm">₹{e.fee_range}</td>
                          <td className="px-4 py-3.5 text-sm font-bold">{cases.filter(c => c.expert_id === e.id && c.status !== "completed").length}</td>
                          <td className="px-4 py-3.5 text-xs text-text-secondary">{e.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* PAYMENTS VIEW */}
          {view === "payments" && (() => {
            const paidCases = cases.filter(c => c.user_paid > 0);
            let totalCollected = 0, totalExpert = 0, totalProfit = 0;
            paidCases.forEach(c => {
              const expertFee = Math.round(c.user_paid / (1 + MARKUP_PERCENT));
              const profit = c.user_paid - expertFee;
              totalCollected += c.user_paid;
              totalExpert += c.expert_paid ? expertFee : 0;
              totalProfit += profit;
            });
            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
                  <div className="bg-surface border border-border rounded-xl p-5"><div className="text-xs text-text-secondary font-medium mb-1">Total Collected from Users</div><div className="text-2xl font-bold text-accent">₹{totalCollected.toLocaleString()}</div></div>
                  <div className="bg-surface border border-border rounded-xl p-5"><div className="text-xs text-text-secondary font-medium mb-1">Paid to Experts</div><div className="text-2xl font-bold text-orange">₹{totalExpert.toLocaleString()}</div></div>
                  <div className="bg-surface border border-border rounded-xl p-5"><div className="text-xs text-text-secondary font-medium mb-1">Your Profit (20%)</div><div className="text-2xl font-bold text-accent">₹{totalProfit.toLocaleString()}</div></div>
                </div>
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead><tr className="bg-[#FAFAF7]">{["Case #", "Client", "Expert", "User Paid", "Expert Fee", "Your Cut", "User Payment", "Expert Payout"].map(h => (<th key={h} className="px-4 py-3 text-left text-[0.75rem] font-bold uppercase tracking-wider text-text-secondary border-b border-border">{h}</th>))}</tr></thead>
                      <tbody>
                        {paidCases.map(c => {
                          const expert = getExpert(c.expert_id);
                          const expertFee = Math.round(c.user_paid / (1 + MARKUP_PERCENT));
                          const profit = c.user_paid - expertFee;
                          return (
                            <tr key={c.id} className="hover:bg-[#FAFAF7] border-b border-border last:border-0">
                              <td className="px-4 py-3.5 text-sm font-bold">{c.id}</td>
                              <td className="px-4 py-3.5 text-sm">{c.client_name}</td>
                              <td className="px-4 py-3.5 text-sm">{expert?.name || "—"}</td>
                              <td className="px-4 py-3.5 text-sm font-bold">₹{c.user_paid.toLocaleString()}</td>
                              <td className="px-4 py-3.5 text-sm">₹{expertFee.toLocaleString()}</td>
                              <td className="px-4 py-3.5 text-sm font-bold text-accent">₹{profit.toLocaleString()}</td>
                              <td className="px-4 py-3.5"><span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-accent-light text-accent">Received</span></td>
                              <td className="px-4 py-3.5">{c.expert_paid ? <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-accent-light text-[#0D7C4A]">Paid</span> : <button onClick={() => payExpert(c.id)} className="px-3.5 py-1.5 rounded-lg bg-orange text-white text-xs font-semibold hover:opacity-90 transition-all">Pay Expert</button>}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            );
          })()}

          {/* ALL CASES VIEW */}
          {view === "cases" && (
            <>
              <h2 className="text-base font-bold mb-4">All Cases</h2>
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead><tr className="bg-[#FAFAF7]">{["Case #", "Client", "Phone", "City", "Category", "Expert", "Status", "Date"].map(h => (<th key={h} className="px-4 py-3 text-left text-[0.75rem] font-bold uppercase tracking-wider text-text-secondary border-b border-border">{h}</th>))}</tr></thead>
                    <tbody>
                      {cases.map(c => {
                        const expert = getExpert(c.expert_id);
                        return (
                          <tr key={c.id} className="hover:bg-[#FAFAF7] border-b border-border last:border-0">
                            <td className="px-4 py-3.5 text-sm font-bold">{c.id}</td>
                            <td className="px-4 py-3.5 text-sm">{c.client_name}</td>
                            <td className="px-4 py-3.5 text-xs text-text-secondary">{c.client_phone}</td>
                            <td className="px-4 py-3.5 text-sm">{c.city}</td>
                            <td className="px-4 py-3.5"><span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-light text-blue">{CATEGORY_MAP[c.category]?.label || c.category}</span></td>
                            <td className="px-4 py-3.5 text-sm">{expert?.name || "—"}</td>
                            <td className="px-4 py-3.5"><span className={`text-xs font-bold px-3 py-1 rounded-full ${statusClass[c.status]}`}>{statusLabel[c.status]}</span></td>
                            <td className="px-4 py-3.5 text-sm">{c.created_at}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CASE DETAIL MODAL */}
      {modalCase && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalCase(null)}>
          <div className="bg-surface rounded-2xl w-full max-w-[520px] max-h-[85vh] overflow-y-auto shadow-lg animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-bold">{modalCase.id} — {modalCase.client_name}</h3>
              <button onClick={() => setModalCase(null)} className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center text-text-secondary hover:bg-border text-lg">×</button>
            </div>
            <div className="px-6 py-5">
              {[
                ["Client", modalCase.client_name],
                ["Phone", modalCase.client_phone],
                ["City", modalCase.city],
                ["Category", modalCase.category_label],
                ["Urgency", modalCase.urgency],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 border-b border-border text-sm">
                  <span className="text-text-secondary">{k}</span>
                  <span className="font-semibold text-right max-w-[60%] capitalize">{v}</span>
                </div>
              ))}
              <div className="flex justify-between py-2.5 border-b border-border text-sm">
                <span className="text-text-secondary">Status</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusClass[modalCase.status]}`}>{statusLabel[modalCase.status]}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-border text-sm">
                <span className="text-text-secondary">Expert</span>
                <span className="font-semibold">{getExpert(modalCase.expert_id)?.name || "Not assigned"}</span>
              </div>
              {modalCase.user_paid > 0 && (() => {
                const expertFee = Math.round(modalCase.user_paid / (1 + MARKUP_PERCENT));
                return (
                  <>
                    <div className="flex justify-between py-2.5 border-b border-border text-sm"><span className="text-text-secondary">User Paid</span><span className="font-semibold">₹{modalCase.user_paid.toLocaleString()}</span></div>
                    <div className="flex justify-between py-2.5 border-b border-border text-sm"><span className="text-text-secondary">Expert Fee</span><span className="font-semibold">₹{expertFee.toLocaleString()}</span></div>
                    <div className="flex justify-between py-2.5 text-sm"><span className="text-text-secondary">Your Profit</span><span className="font-semibold text-accent">₹{(modalCase.user_paid - expertFee).toLocaleString()}</span></div>
                  </>
                );
              })()}
              <div className="bg-bg rounded-xl p-3.5 mt-4 text-sm text-text-secondary leading-relaxed">{modalCase.description}</div>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-2.5 justify-end">
              <button onClick={() => setModalCase(null)} className="px-5 py-2.5 rounded-lg bg-bg text-text border border-border text-sm font-semibold hover:border-text-secondary transition-all">Close</button>
              {modalCase.status === "new" && <button onClick={() => { setAssignCase(modalCase); setModalCase(null); }} className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-all">Assign Expert</button>}
              {modalCase.status === "assigned" && <button onClick={() => updateStatus(modalCase.id, "in-progress")} className="px-5 py-2.5 rounded-lg bg-orange text-white text-sm font-semibold hover:opacity-90 transition-all">Mark In Progress</button>}
              {modalCase.status === "in-progress" && <button onClick={() => updateStatus(modalCase.id, "completed")} className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-all">Mark Completed</button>}
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN EXPERT MODAL */}
      {assignCase && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setAssignCase(null); setSelectedExpertId(null); }}>
          <div className="bg-surface rounded-2xl w-full max-w-[520px] max-h-[85vh] overflow-y-auto shadow-lg animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-bold">Assign Expert</h3>
              <button onClick={() => { setAssignCase(null); setSelectedExpertId(null); }} className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center text-text-secondary hover:bg-border text-lg">×</button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-text-secondary mb-3">Select an expert for this case:</p>
              <div className="flex flex-col gap-2">
                {EXPERTS_DATA.filter(e => e.categories.includes(assignCase.category)).map(e => (
                  <button key={e.id} onClick={() => setSelectedExpertId(e.id)} className={`flex items-center gap-3 p-3 border-[1.5px] rounded-xl transition-all text-left ${selectedExpertId === e.id ? "border-accent bg-accent-light" : "border-border hover:border-accent"}`}>
                    <div className="w-[38px] h-[38px] rounded-full bg-bg flex items-center justify-center text-sm font-bold text-accent-dark">{e.initials}</div>
                    <div className="flex-1"><div className="text-sm font-bold">{e.name} {e.firm ? `(${e.firm})` : ""}</div><div className="text-xs text-text-secondary">{e.experience} · {e.areas}</div></div>
                    <div className="text-sm font-bold">₹{e.fee_range}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-2.5 justify-end">
              <button onClick={() => { setAssignCase(null); setSelectedExpertId(null); }} className="px-5 py-2.5 rounded-lg bg-bg text-text border border-border text-sm font-semibold">Cancel</button>
              <button onClick={assignExpert} className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-all">Assign Expert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
