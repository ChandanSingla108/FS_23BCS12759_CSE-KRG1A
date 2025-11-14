// src/components/Avatar.jsx
import React from "react";

export default function Avatar({ name, size = 40 }) {
  const initials = name
    ? name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()
    : "?";
  return (
    <div style={{ width: size, height: size }} className="rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
      {initials}
    </div>
  );
}
