import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, IdCard, Search } from "lucide-react";
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

function uid() {
  return `NV-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function VisitorRequest() {
  const navigate = useNavigate();
  const { addVisitorRequest, addNotification, visitors } = useStore();
  const [mode, setMode] = useState<"new" | "id">("new");
  const [lookup, setLookup] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [unit, setUnit] = useState("W001");
  const [resident, setResident] = useState("John Perera");
  const [purpose, setPurpose] = useState<VisitorType>("guest");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState("18:00");
  const [end, setEnd] = useState("20:00");
  const [submitted, setSubmitted] = useState<VisitorRequest | null>(null);

  function findById(value: string) {
    const q = value.trim().toLowerCase();
    return visitors.find((v) => v.id.toLowerCase() === q || v.passCode.toLowerCase() === q);
  }

  function openExisting(e: FormEvent) {
    e.preventDefault();
    setLookupError(null);
    const found = findById(lookup);
    if (!found) {
      setLookupError("No pass with that ID. Check the code the resident sent you.");
      return;
    }
    navigate(`/visitor/pass/${found.id}`);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = uid();
    const request: VisitorRequest = {
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
      riskLevel: purpose === "contractor" ? "medium" : "low",
      riskReason:
        purpose === "contractor"
          ? "First-time contractor · longer access window — operator review required"
          : "Resident-hosted visit · short access window",
      status: "pending",
      passCode: id,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      accessEnabled: false,
      doorUnlocked: false,
    };
    addVisitorRequest(request);
    void persistVisitorRequest(request, contact.trim());
    addNotification({
      icon: "Users",
      title: "Visitor request received",
      body: `${name.trim()} · ID ${id} asked to visit ${unit} ${start}–${end}.`,
      category: "visitor",
    });
    setSubmitted(request);
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-violet-400";

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-6">
        <header className="flex items-center justify-between">
          <BackButton to="/" light />
          <NesturaLockup height={36} onDark />
        </header>

        {submitted ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Your Nestura ID</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Save this code.</h1>
            <p className="mt-2 text-sm text-white/65">
              Come back anytime, tap “I already have an ID”, and enter this to open your card after the resident approves.
            </p>
            <div className="mt-8 rounded-2xl border border-violet-400/40 bg-violet-400/10 p-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">Visitor ID</p>
              <p className="mt-2 font-mono text-3xl font-semibold tracking-[0.18em]">{submitted.passCode}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4 border-white/20 text-white"
                onClick={() => void navigator.clipboard.writeText(submitted.passCode)}
              >
                Copy ID
              </Button>
            </div>
            <ol className="mt-8 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-violet-300" /> Requested · waiting on {submitted.hostName}
              </li>
              <li>Resident grants a time window</li>
              <li>Your digital card unlocks the door until that window ends</li>
            </ol>
            <div className="mt-8 flex flex-col gap-2">
              <Button className="rounded-full" onClick={() => navigate(`/visitor/pass/${submitted.id}`)}>
                Open pass
              </Button>
              <Button variant="ghost" className="rounded-full text-white" onClick={() => setSubmitted(null)}>
                Make another request
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-2 rounded-full bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode("new")}
                className={`rounded-full py-2 text-sm font-semibold ${mode === "new" ? "bg-violet-500 text-white" : "text-white/60"}`}
              >
                New request
              </button>
              <button
                type="button"
                onClick={() => setMode("id")}
                className={`rounded-full py-2 text-sm font-semibold ${mode === "id" ? "bg-violet-500 text-white" : "text-white/60"}`}
              >
                I already have an ID
              </button>
            </div>

            {mode === "id" ? (
              <motion.form onSubmit={openExisting} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
                <IdCard className="text-violet-300" size={28} />
                <h1 className="mt-3 text-3xl font-semibold tracking-tight">Enter your visitor ID</h1>
                <p className="mt-2 text-sm text-white/65">Use the code from your request or the one a resident sent you.</p>
                <input
                  required
                  value={lookup}
                  onChange={(e) => setLookup(e.target.value)}
                  placeholder="NV-482193"
                  className={`${inputClass} mt-6 font-mono tracking-widest uppercase`}
                />
                {lookupError && <p className="mt-2 text-sm text-rose-300">{lookupError}</p>}
                <Button type="submit" className="mt-6 w-full rounded-full py-3.5">
                  <Search size={15} /> Open my card
                </Button>
              </motion.form>
            ) : (
              <motion.form onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-10 flex flex-1 flex-col">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Access request</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Who are you visiting?</h1>
                <p className="mt-2 text-sm leading-relaxed text-white/65">You’ll get a visitor ID immediately. The resident then unlocks your digital card.</p>

                <label className="mt-8 text-xs font-medium text-white/70">Your name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Sarah Perera" className={inputClass} />

                <label className="mt-4 text-xs font-medium text-white/70">Phone or email</label>
                <input required value={contact} onChange={(e) => setContact(e.target.value)} placeholder="sarah@email.com" className={inputClass} />

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-white/70">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass}>
                      <option className="text-neutral-900" value="W001">W001</option>
                      <option className="text-neutral-900" value="W002">W002</option>
                      <option className="text-neutral-900" value="W003">W003</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/70">Resident</label>
                    <input required value={resident} onChange={(e) => setResident(e.target.value)} className={inputClass} />
                  </div>
                </div>

                <p className="mt-5 text-xs font-medium text-white/70">Purpose</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {PURPOSES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPurpose(p.id)}
                      className={`rounded-xl border px-2 py-3 text-center ${
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
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/70">Start</label>
                    <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-white/70">End</label>
                    <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={inputClass} />
                  </div>
                </div>

                <Button type="submit" className="mt-8 w-full rounded-full py-3.5">
                  Request Access
                </Button>
              </motion.form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
