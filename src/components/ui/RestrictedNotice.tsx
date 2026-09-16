import { Lock } from "lucide-react";

export function RestrictedNotice({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dashed border-border-strong bg-surface-raised p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-tertiary">
        <Lock size={14} />
      </div>
      <p className="text-sm text-tertiary">{message}</p>
    </div>
  );
}
