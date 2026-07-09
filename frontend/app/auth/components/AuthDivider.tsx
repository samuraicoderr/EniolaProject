import React from "react";

export default function AuthDivider({ text = "or" }: { text?: string }) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-4 text-[13px] text-gray-400">{text}</span>
      </div>
    </div>
  );
}
