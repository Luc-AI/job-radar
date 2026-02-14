"use client";

import { useState } from "react";

interface CompanyLogoProps {
  logoUrl: string | null;
  companyName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CompanyLogo({
  logoUrl,
  companyName,
  size = "md",
  className = "",
}: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false);

  const initial = companyName.charAt(0).toUpperCase();

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-2xl",
  };

  const imgSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  if (!logoUrl || imageError) {
    return (
      <div
        className={`
          ${sizes[size]}
          flex items-center justify-center
          bg-slate-100 border border-slate-200
          rounded-lg font-semibold text-slate-600
          flex-shrink-0
          ${className}
        `}
        aria-label={`${companyName} logo`}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${companyName} logo`}
      className={`
        ${imgSizes[size]}
        rounded-lg object-contain
        bg-white border border-slate-200
        flex-shrink-0
        ${className}
      `}
      onError={() => setImageError(true)}
    />
  );
}
