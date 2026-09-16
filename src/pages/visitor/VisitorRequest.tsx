import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { persistVisitorRequest } from "@/lib/visitors";
import { useStore } from "@/store/useStore";
import { BackButton } from "@/components/ui/BackButton";
import { NesturaLockup } from "@/components/brand/NesturaMark";
import { Button } from "@/components/ui/Button";
import type { VisitorRequest, VisitorType } from "@/types";

const PURPOSES: { id: VisitorType; label: string; hint: string }[] = [
  { id: "guest", label: "Visit", hint: "Friends & family" },
  { id: "delivery", label: "Delivery", hint: "Parcels & food" },
  { id: "contractor", label: "Contractor", hint: "Works & repairs" },
];

const STEPS = ["Requested", "Resident approval", "Building approval", "Access pass"];

function uid() {
  return `visitor-${Math.random().toString(36).slice(2, 9)}`;
}
function passCode() {
  return `NV-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function VisitorRequest() {
  const navigate = useNavigate();
  const { addVisitorRequest, addNotification } = useStore();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [unit, setUnit] = useState("W001");
  const [resident, setResident] = useState("John Perera");
  const [purpose, setPurpose] = useState<VisitorType>("guest");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState("18:00");
  const [end, setEnd] = useState("20:00");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = uid();
    const request = {
      id,
      name: name.trim(),
      type: purpose,
      unitId: unit === "W001" ? "12A" : unit === "W002" ? "18B" : "8F",
      hostName: resident.trim(),
      destination: `Tower A · Unit ${unit === "W001" ? "12A" : unit === "W002" ? "18B" : "8F"}`,
      purpose: PURPOSES.find((p) => p.id === purpose)?.label,
      requestedFor: date,
      windowStart: start,
      windowEnd: end,
      riskLevel: (purpose === "contractor" ? "medium" : "low") as VisitorRequest["riskLevel"],
      riskReason:
        purpose === "contractor"
          ? "First-time contractor · longer access window — operator review required"
          : "Resident-hosted visit · short access window",
      status: "pending" as const,
      passCode: passCode(),
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    addVisitorRequest(request);
    void persistVisitorRequest(request, contact.trim());
    addNotification({
      icon: "Users",
      title: "Visitor request received",
      body: `${name.trim()} asked to visit ${unit} ${start}–${end}.`,
      category: "visitor",
    });
    setSubmittedId(id);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-6">
        <header className="flex items-center justify-between">
          <BackButton to="/" light />
          <NesturaLockup height={36} onDark />
        </header>

        {!submittedId ? (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-1 flex-col"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Access request</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Who are you visiting?</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              A digital concierge for The Meridian. Your request goes to the resident first, then Building Operations.
            </p>

            <label className="mt-8 text-xs font-medium text-white/70">Your name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Perera"
              className="mt-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-sm outline-none placeholder:text-white/35 focus:border-violet-400"
            />

            <label className="mt-4 text-xs font-medium text-white/70">Phone or email</label>
            <input
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="sarah@email.com"
              className="mt-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-sm outline-none placeholder:text-white/35 focus:border-violet-400"
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-white/70">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-sm outline-none focus:border-violet-400"
                >
                  <option className="text-neutral-900" value="W001">W001</option>
                  <option className="text-neutral-900" value="W002">W002</option>
                  <option className="text-neutral-900" value="W003">W003</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-white/70">Resident</label>
                <input
                  required
                  value={resident}
                  onChange={(e) => setResident(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-sm outline-none focus:border-violet-400"
                />
              </div>
            </div>

            <p className="mt-5 text-xs font-medium text-white/70">Purpose</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {PURPOSES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPurpose(p.id)}
                  className={`rounded-xl border px-2 py-3 text-center transition-colors ${
                    purpose === p.id ? "border-violet-400 bg-violet-400/15" : "border-white/15 bg-white/5"
                  }`}
                >
                  <span className="block text-sm font-semibold">{p.label}</span>
                  <span className="mt-0.5 block text-[10px] text-white/55">{p.hint}</span>
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="col-span-3 sm:col-span-1">
                <label className="text-xs font-medium text-white/70">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/70">Start</label>
                <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/70">End</label>
                <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm outline-none" />
              </div>
            </div>

            <Button type="submit" className="mt-8 w-full rounded-full py-3.5">
              Request Access
            </Button>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Request received</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">We have your visit.</h1>
            <p className="mt-2 text-sm text-white/65">
              {name} · {unit} · {start}–{end}. The resident will review this next.
            </p>
            <ol className="mt-10 space-y-0">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${i === 0 ? "bg-violet-400 text-neutral-950" : "border border-white/20 text-white/50"}`}>
                      {i === 0 ? <Check size={14} /> : i + 1}
                    </span>
                    {i < STEPS.length - 1 && <span className="my-1 w-px flex-1 bg-white/15" style={{ minHeight: 28 }} />}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-semibold ${i === 0 ? "text-white" : "text-white/45"}`}>{step}</p>
                    {i === 0 && <p className="mt-0.5 text-xs text-white/50">Waiting on resident approval</p>}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-col gap-2">
              <Button className="rounded-full" onClick={() => navigate(`/visitor/pass/${submittedId}`)}>
                View request status
              </Button>
              <Button variant="ghost" className="rounded-full text-white" onClick={() => navigate("/login?role=resident")}>
                Continue as resident to approve
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
