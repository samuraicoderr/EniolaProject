import React from "react";

export default function AuthDivider({ text = "or" }: { text?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-[3px] border-dashed border-[#D4A017]/60" />
      </div>
      <div className="relative flex justify-center">
        <span
          className="bg-[#FFFBF0] px-4 text-sm font-bold text-[#1B3A8C]"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
