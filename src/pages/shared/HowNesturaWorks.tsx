import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { AiHealthChip } from "@/components/system/AiHealthChip";

export function HowNesturaWorks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">How Nestura works</h1>
        <p className="mt-1 text-sm text-tertiary">
          One building model, four roles. Screenshot this page for Technical &amp; AI Progress.
        </p>
      </div>

      <AiHealthChip />

      <Card>
        <CardHeader>
          <CardTitle>Architecture</CardTitle>
        </CardHeader>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-secondary">
          <li>
            <span className="font-medium text-primary">UI</span> — resident / operator / developer / visitor shells.
          </li>
          <li>
            <span className="font-medium text-primary">Zustand store</span> — devices, scenes, visitors, alerts keyed by
            unit (W001–W003). Pages do not keep a second copy.
          </li>
          <li>
            <span className="font-medium text-primary">Persist</span> — optional Supabase <code>app_records</code> +
            visitor_requests. The UI still runs locally.
          </li>
          <li>
            <span className="font-medium text-primary">Nestura AI</span> — POST live snapshots to <code>/api/ai/*</code>.
            Local Express and Vercel share <code>shared/ai-core.mjs</code>. The browser never holds the OpenAI key.
          </li>
          <li>
            <span className="font-medium text-primary">Beacon graph</span> — indoor routes are deterministic. The model
            rewrites them; it does not invent the floor map.
          </li>
        </ol>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Live in this demo</CardTitle>
          </CardHeader>
          <ul className="list-disc space-y-1 pl-5 text-sm text-secondary">
            <li>Device, lock, scene, automation, visitor grant in the app store</li>
            <li>W002 owner family access</li>
            <li>Nestura jobs: wayfinding, scene compile, energy, maintenance, automation, analytics</li>
          </ul>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Clearly simulated</CardTitle>
          </CardHeader>
          <ul className="list-disc space-y-1 pl-5 text-sm text-secondary">
            <li>No physical lock, meter, or camera</li>
            <li>Energy charts are a seed profile, not utility data</li>
            <li>Sensor % jitters every 9 seconds</li>
            <li>CCTV tiles are placeholders</li>
            <li>Demo login; RLS is open for the prototype</li>
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What the model sees — and if it fails</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-left">
            <thead className="text-xs uppercase text-tertiary">
              <tr>
                <th className="py-2 pr-3">Input</th>
                <th className="py-2 pr-3">Limit</th>
                <th className="py-2">Fallback</th>
              </tr>
            </thead>
            <tbody className="text-secondary">
              <tr className="border-t border-border">
                <td className="py-2 pr-3">This unit’s devices (id, name, kind, room)</td>
                <td className="py-2 pr-3">Truncated; cannot invent ids</td>
                <td className="py-2">Local scene compiler</td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-2 pr-3">Activity, visitors, alerts</td>
                <td className="py-2 pr-3">Last N rows</td>
                <td className="py-2">Rule-based suggestion</td>
              </tr>
              <tr className="border-t border-border">
                <td className="py-2 pr-3">Floor amenities</td>
                <td className="py-2 pr-3">Beacon graph is source of truth</td>
                <td className="py-2">Precomputed route still shown</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Path to completion</CardTitle>
        </CardHeader>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-secondary">
          <li>Demo week — Vercel <code>OPENAI_API_KEY</code> so /api/health shows aiEnabled true; one recorded slice.</li>
          <li>Identity — demo login → Supabase Auth; same roles and units.</li>
          <li>Data — close anon RLS; persist household access in app_records.</li>
          <li>Devices — keep the Device type; replace sensor jitter with MQTT/webhooks; energy from a meter CSV/API.</li>
          <li>AI quality — 20 frozen prompts; log invalid device ids; keep scene matching.</li>
        </ol>
      </Card>
    </div>
  );
}
