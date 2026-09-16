import { QRCodeSVG } from "qrcode.react";

export function PassQRCode({ value, size = 168 }: { value: string; size?: number }) {
  return (
    <div className="inline-flex rounded-2xl border border-border bg-white p-4 shadow-soft">
      <QRCodeSVG value={value} size={size} fgColor="#312E81" bgColor="#ffffff" level="M" />
    </div>
  );
}
