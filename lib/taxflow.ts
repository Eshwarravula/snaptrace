export type Role = 'owner' | 'admin' | 'staff';
export type ClientStatus = 'active' | 'inactive' | 'risky';
export type GstFrequency = 'monthly' | 'quarterly' | 'composition';
export type WorkflowStatus = 'not_started' | 'waiting_for_client' | 'documents_received' | 'in_progress' | 'ready_for_review' | 'client_approval_pending' | 'filed' | 'completed';
export type DocumentStatus = 'missing' | 'received' | 'checked' | 'issue_found';
export type ApprovalStatus = 'not_required' | 'pending' | 'approved' | 'rejected';
export type FilingStatus = 'not_filed' | 'filed' | 'late';
export type FeeStatus = 'unpaid' | 'partial' | 'paid' | 'overdue';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';

export type Firm = { id: string; name: string; address: string; phone: string; email: string };
export type Profile = { id: string; firm_id: string; full_name: string; email: string; role: Role; active: boolean };
export type Client = { id: string; firm_id: string; business_name: string; owner_name: string; gstin: string; phone: string; email: string; city: string; business_type: string; gst_frequency: GstFrequency; assigned_staff_id: string; monthly_fee: number; status: ClientStatus; notes: string; created_at: string; updated_at: string };
export type GstWorkRecord = { id: string; firm_id: string; client_id: string; month: number; year: number; assigned_staff_id: string; workflow_status: WorkflowStatus; document_status: DocumentStatus; approval_status: ApprovalStatus; filing_status: FilingStatus; gst_payable_amount: number; filing_date: string | null; notes: string; last_followup_at: string | null; next_followup_at: string | null; created_at: string; updated_at: string };
export type ChecklistItem = { id: string; firm_id: string; client_id: string; gst_work_id: string; title: string; status: DocumentStatus; remarks: string; file_path: string | null; uploaded_by: string | null; uploaded_at: string | null };
export type Task = { id: string; firm_id: string; title: string; description: string; client_id: string; gst_work_id: string | null; assigned_to: string; due_date: string; priority: Priority; status: TaskStatus; created_by: string; created_at: string };
export type ReminderTemplate = { id: string; firm_id: string; name: string; body: string };
export type Payment = { id: string; firm_id: string; client_id: string; month: number; year: number; amount_due: number; amount_paid: number; due_date: string; status: FeeStatus; payment_notes: string };

export const checklistTitles = ['Sales invoices', 'Purchase invoices', 'Bank statement', 'Expense bills', 'E-way bills', 'TDS details', 'Other supporting documents'];
export const statusLabel: Record<string, string> = { active:'Active', inactive:'Inactive', risky:'Risky', monthly:'Monthly', quarterly:'Quarterly', composition:'Composition', not_started:'Not started', waiting_for_client:'Waiting for client', documents_received:'Documents received', in_progress:'In progress', ready_for_review:'Ready for review', client_approval_pending:'Client approval pending', filed:'Filed', completed:'Completed', missing:'Missing', received:'Received', checked:'Checked', issue_found:'Issue found', not_required:'Not required', pending:'Pending', approved:'Approved', rejected:'Rejected', not_filed:'Not filed', late:'Late', unpaid:'Unpaid', partial:'Partial', paid:'Paid', overdue:'Overdue', todo:'Todo', blocked:'Blocked', done:'Done', low:'Low', medium:'Medium', high:'High', urgent:'Urgent' };
const now = new Date();
export const currentMonth = now.getMonth() + 1;
export const currentYear = now.getFullYear();
export const todayIso = now.toISOString();
export const dueIso = new Date(currentYear, currentMonth - 1, 20).toISOString();
export const feeIso = new Date(currentYear, currentMonth - 1, 25).toISOString();
export const demoFirm: Firm = { id:'firm-demo', name:'Rao & Associates CA Firm', address:'Madhapur, Hyderabad, Telangana', phone:'+919876543210', email:'ops@raoassociates.in' };
export const demoProfiles: Profile[] = [
 { id:'user-owner', firm_id:demoFirm.id, full_name:'Ananya Rao', email:'owner@raoassociates.in', role:'owner', active:true },
 { id:'user-staff-1', firm_id:demoFirm.id, full_name:'Rahul Sharma', email:'rahul@raoassociates.in', role:'staff', active:true },
 { id:'user-staff-2', firm_id:demoFirm.id, full_name:'Priya Nair', email:'priya@raoassociates.in', role:'staff', active:true }
];
export const demoClients: Client[] = [
 { id:'client-1', firm_id:demoFirm.id, business_name:'Sri Balaji Traders', owner_name:'Kiran Reddy', gstin:'36ABCDE1234F1Z5', phone:'919876543210', email:'accounts@balajitraders.in', city:'Hyderabad', business_type:'Wholesale trading', gst_frequency:'monthly', assigned_staff_id:'user-staff-1', monthly_fee:4500, status:'active', notes:'Sends documents late after 15th.', created_at:todayIso, updated_at:todayIso },
 { id:'client-2', firm_id:demoFirm.id, business_name:'CloudNine Cafe', owner_name:'Meera Jain', gstin:'36BCDEF2345G1Z2', phone:'919912345678', email:'finance@cloudninecafe.in', city:'Hyderabad', business_type:'Restaurant', gst_frequency:'monthly', assigned_staff_id:'user-staff-2', monthly_fee:6000, status:'active', notes:'Needs GST payable approval on WhatsApp.', created_at:todayIso, updated_at:todayIso },
 { id:'client-3', firm_id:demoFirm.id, business_name:'Veda Skin Clinic', owner_name:'Dr. Shalini', gstin:'36CDEFG3456H1Z8', phone:'918765432109', email:'billing@vedaskin.in', city:'Secunderabad', business_type:'Clinic', gst_frequency:'monthly', assigned_staff_id:'user-staff-1', monthly_fee:5500, status:'risky', notes:'Bank statement frequently missing.', created_at:todayIso, updated_at:todayIso },
 { id:'client-4', firm_id:demoFirm.id, business_name:'PixelKart Online', owner_name:'Arjun Varma', gstin:'36DEFGH4567J1Z9', phone:'918888777766', email:'tax@pixelkart.in', city:'Warangal', business_type:'E-commerce', gst_frequency:'monthly', assigned_staff_id:'user-staff-2', monthly_fee:7500, status:'active', notes:'High invoice volume.', created_at:todayIso, updated_at:todayIso },
 { id:'client-5', firm_id:demoFirm.id, business_name:'GreenLeaf Events', owner_name:'Sana Khan', gstin:'36EFGHI5678K1Z1', phone:'917799665544', email:'hello@greenleafevents.in', city:'Hyderabad', business_type:'Event services', gst_frequency:'quarterly', assigned_staff_id:'user-staff-1', monthly_fee:3500, status:'active', notes:'Quarterly filing but monthly fee follow-up.', created_at:todayIso, updated_at:todayIso }
];
export const demoWorkRecords: GstWorkRecord[] = demoClients.map((client, index) => ({ id:`work-${index+1}`, firm_id:demoFirm.id, client_id:client.id, month:currentMonth, year:currentYear, assigned_staff_id:client.assigned_staff_id, workflow_status:(['waiting_for_client','documents_received','in_progress','ready_for_review','filed'] as WorkflowStatus[])[index], document_status:(['missing','received','checked','issue_found','checked'] as DocumentStatus[])[index], approval_status:(['pending','pending','not_required','pending','approved'] as ApprovalStatus[])[index], filing_status:index===4?'filed':'not_filed', gst_payable_amount:[0,18200,9500,44200,0][index], filing_date:index===4?todayIso:null, notes:index===0?'Waiting for sales and purchase invoices.':'', last_followup_at:index<2?todayIso:null, next_followup_at:index<3?dueIso:null, created_at:todayIso, updated_at:todayIso }));
export const demoChecklistItems: ChecklistItem[] = demoWorkRecords.flatMap(work => checklistTitles.map((title, index) => ({ id:`${work.id}-doc-${index}`, firm_id:work.firm_id, client_id:work.client_id, gst_work_id:work.id, title, status:index<3?work.document_status:'missing', remarks:index===2 && work.document_status==='issue_found'?'Statement not matching books':'', file_path:null, uploaded_by:null, uploaded_at:null })));
export const demoTasks: Task[] = [
 { id:'task-1', firm_id:demoFirm.id, title:'Collect missing purchase invoices', description:'Call client and request current month purchase invoices.', client_id:'client-1', gst_work_id:'work-1', assigned_to:'user-staff-1', due_date:dueIso, priority:'high', status:'todo', created_by:'user-owner', created_at:todayIso },
 { id:'task-2', firm_id:demoFirm.id, title:'Prepare GSTR-3B review note', description:'Check payable and send approval message.', client_id:'client-2', gst_work_id:'work-2', assigned_to:'user-staff-2', due_date:dueIso, priority:'urgent', status:'in_progress', created_by:'user-owner', created_at:todayIso },
 { id:'task-3', firm_id:demoFirm.id, title:'Resolve bank mismatch', description:'Bank statement mismatch with sales entries.', client_id:'client-3', gst_work_id:'work-3', assigned_to:'user-staff-1', due_date:new Date(currentYear,currentMonth-1,12).toISOString(), priority:'urgent', status:'blocked', created_by:'user-owner', created_at:todayIso }
];
export const demoPayments: Payment[] = demoClients.map((client, index) => ({ id:`payment-${index+1}`, firm_id:demoFirm.id, client_id:client.id, month:currentMonth, year:currentYear, amount_due:client.monthly_fee, amount_paid:[0,2000,0,7500,3500][index], due_date:feeIso, status:(['unpaid','partial','overdue','paid','paid'] as FeeStatus[])[index], payment_notes:index===2?'Overdue from last month also.':'' }));
export const demoTemplates: ReminderTemplate[] = [
 { id:'tpl-1', firm_id:demoFirm.id, name:'Missing GST documents', body:'Hi {{client_name}}, this is {{staff_name}} from {{firm_name}}. For {{month}} {{year}} GST filing, we still need: {{missing_documents}}. Please share them today so we can complete filing on time.' },
 { id:'tpl-2', firm_id:demoFirm.id, name:'GST payable approval', body:'Hi {{client_name}}, GST payable for {{business_name}} for {{month}} {{year}} is ₹{{gst_payable_amount}}. Please approve so we can proceed with filing.' },
 { id:'tpl-3', firm_id:demoFirm.id, name:'Filing completed', body:'Hi {{client_name}}, GST filing for {{business_name}} for {{month}} {{year}} is completed. We will share the acknowledgement shortly.' },
 { id:'tpl-4', firm_id:demoFirm.id, name:'Fee payment reminder', body:'Hi {{client_name}}, fee payment of ₹{{payment_amount}} is pending for {{month}} {{year}}. Please clear it at the earliest. - {{firm_name}}' },
 { id:'tpl-5', firm_id:demoFirm.id, name:'Custom message', body:'Hi {{client_name}}, this is {{staff_name}} from {{firm_name}} regarding {{business_name}} GST work for {{month}} {{year}}.' }
];
export function monthName(month:number){ return new Date(2024, month-1, 1).toLocaleString('en-IN',{month:'long'}); }
export function money(amount:number){ return new Intl.NumberFormat('en-IN',{style:'currency', currency:'INR', maximumFractionDigits:0}).format(amount); }
export function makeWaLink(phone:string,message:string){ return `https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(message)}`; }
export function fillTemplate(template:string, values:Record<string,string|number>){ return template.replace(/{{(.*?)}}/g, (_, key:string) => String(values[key.trim()] ?? '')); }
