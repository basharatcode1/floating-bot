import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Briefcase, CalendarDays, Check, ChevronDown, ClipboardList, Clock3, LayoutDashboard, MapPin, MessageSquare, Moon, MoreVertical, Plus, Search, TrendingUp, UserRound, UserRoundCheck, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RequirementBuilder } from "./RequirementBuilder";
import { filterRequirements, requirements, type Requirement } from "@/lib/requirements/list";

function Skills({ values, secondary = false, more = false }: { values: string[]; secondary?: boolean; more?: boolean }) {
  return <div className="req-skills">{values.map(skill => <span key={skill} className={secondary ? "req-skill req-skill-secondary" : "req-skill"}>{skill}</span>)}{more && <span className={secondary ? "req-skill req-skill-secondary" : "req-skill"}>+more</span>}</div>;
}

function RequirementCard({ row, onDetails }: { row: Requirement; onDetails: () => void }) {
  return <article className="req-row">
    <div className="req-identity">
      <span className="req-id">{row.id}</span>
      <h2>{row.title}</h2>
      <p className="req-experience">Experience : <strong>{row.experience}</strong></p>
      <div className="req-meta">
        {row.date && <span><CalendarDays />{row.date}</span>}{row.type && <span><Briefcase />{row.type}</span>}
        {row.location && <span><MapPin />{row.location}</span>}{row.timezone && <span><Clock3 />{row.timezone}</span>}
      </div>
    </div>
    <div className="req-skills-column">
      <h3>Primary Skills</h3><Skills values={row.primary} more={!!row.morePrimary} />
      <h3 className="req-secondary-label">Secondary Skills</h3><Skills values={row.secondary} secondary more={!!row.moreSecondary} />
    </div>
    <div className="req-salary-column">
      <h3>Salary</h3><p className="req-salary">{row.salary}</p>
      <h3 className="req-certificate-label">Certificate</h3>
      <ul>{row.certificates.map(certificate => <li key={certificate}><Check />{certificate}</li>)}</ul>
    </div>
    <div className="req-count-column">
      <div className="req-row-actions">
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="req-status" aria-label={`Status of ${row.id}`}><span />Active<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="start"><DropdownMenuItem disabled><Check />Active</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`More actions for ${row.id}`}><MoreVertical /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={onDetails}>View details</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
      </div>
      {row.positions !== undefined && <div className="req-counts">
        <div><Users className="req-blue" /><span>Total Position</span><strong>{row.positions}</strong></div>
        <div><UserRoundCheck className="req-green" /><span>Open Position</span><strong>{row.open}</strong></div>
        <div><Users className="req-purple" /><span>Candidates</span><strong>{row.candidates}</strong></div>
      </div>}
    </div>
  </article>;
}

export function RequirementsList() {
  const [query, setQuery] = useState("");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [engagement, setEngagement] = useState("all");
  const [selected, setSelected] = useState<Requirement | null>(null);
  const [dark, setDark] = useState(false);
  const visible = filterRequirements(requirements, query, status, type, engagement);
  const stats = [{ icon: Briefcase, label: "Total Requirements", value: 6, color: "req-blue" }, { icon: UserRound, label: "Total Positions", value: 11, color: "req-purple" }, { icon: ClipboardList, label: "Total Candidates", value: 19, color: "req-green" }, { icon: UserRoundCheck, label: "Active Requirements", value: 5, color: "req-orange" }];
  return <div className={`requirements-dashboard${dark ? " dark" : ""}`}>
    <header className="req-topbar">
      <Link to="/client/requirements" className="req-brand">StaffSync</Link>
      <div className="req-account">
        <Button variant="outline" size="icon" aria-label="Toggle color theme" onClick={() => setDark(v => !v)}><Moon /></Button>
        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="Notifications"><Bell /><span className="req-notification-dot" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem disabled>Notifications</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        <span className="req-avatar"><UserRound /></span><div><strong>John Smith</strong><span>Client</span></div>
      </div>
    </header>
    <aside className="req-sidebar" aria-label="Main navigation">
      {[{ icon: LayoutDashboard, label: "Dashboard" }, { icon: ClipboardList, label: "Requirements", active: true }, { icon: UserRoundCheck, label: "Candidates" }, { icon: TrendingUp, label: "Reports" }, { icon: Bell, label: "Notifications" }, { icon: MessageSquare, label: "Messages" }].map(item => <Button key={item.label} variant="ghost" size="icon" title={item.label} aria-label={item.label} disabled={!item.active} className={item.active ? "req-nav-active" : "req-nav-icon"} asChild={!!item.active}>{item.active ? <Link to="/client/requirements"><item.icon /></Link> : <item.icon />}</Button>)}
    </aside>
    <main className="req-main">
      <div className="req-heading"><div><h1>My Requirements</h1><p>Manage your job descriptions and hiring needs.</p></div><Button className="req-post" onClick={() => setBuilderOpen(true)}><Plus />Post Requirement</Button></div>
      <section className="req-stats" aria-label="Requirement overview">{stats.map(stat => <div key={stat.label}><stat.icon className={stat.color} /><span>{stat.label}</span><strong className={stat.color}>{stat.value}</strong></div>)}</section>
      <div className="req-filters">
        <div className="req-search"><Search /><Input aria-label="Search requirements" placeholder="Search by name, ID, skills..." value={query} onChange={e => setQuery(e.target.value)} />{query && <Button size="icon" variant="ghost" aria-label="Clear search" onClick={() => setQuery("")}><X /></Button>}</div>
        <Select value={status} onValueChange={setStatus}><SelectTrigger aria-label="Filter by status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select>
        <Select value={type} onValueChange={setType}><SelectTrigger aria-label="Filter by type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="C-C">C-C</SelectItem></SelectContent></Select>
        <Select value={engagement} onValueChange={setEngagement}><SelectTrigger aria-label="Filter by engagement"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Engagements</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem><SelectItem value="remote">Remote</SelectItem><SelectItem value="onsite">On-site</SelectItem></SelectContent></Select>
      </div>
      <section className="req-results" aria-label="Requirements" aria-live="polite">{visible.map(row => <RequirementCard key={row.id} row={row} onDetails={() => setSelected(row)} />)}{!visible.length && <div className="req-empty"><Search /><h2>No matching requirements</h2><Button variant="outline" onClick={() => { setQuery(""); setStatus("all"); setType("all"); setEngagement("all"); }}>Clear filters</Button></div>}</section>
    </main>
    <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>{selected && <div className="space-y-5"><span className="req-id">{selected.id}</span><p>Experience : <strong>{selected.experience}</strong></p><p>{selected.salary}</p>{selected.location && <p>{selected.location}</p>}<div><h3 className="mb-2 text-sm font-semibold">Primary Skills</h3><Skills values={selected.primary} /></div>{!!selected.secondary.length && <div><h3 className="mb-2 text-sm font-semibold">Secondary Skills</h3><Skills values={selected.secondary} secondary /></div>}<ul className="space-y-2 text-sm">{selected.certificates.map(certificate => <li key={certificate}>{certificate}</li>)}</ul></div>}</DialogContent></Dialog>
    <Dialog open={builderOpen} onOpenChange={setBuilderOpen}><DialogContent className="max-h-[100dvh] w-[calc(100vw-1rem)] max-w-6xl gap-0 overflow-y-auto overscroll-contain rounded-2xl p-0 data-[state=open]:animate-none sm:max-h-[94dvh]"><DialogHeader className="sr-only"><DialogTitle>Create Hiring Requirement</DialogTitle></DialogHeader>{builderOpen && <RequirementBuilder embedded />}</DialogContent></Dialog>
  </div>;
}