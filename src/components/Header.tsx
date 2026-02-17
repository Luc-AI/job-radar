"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { logout } from "@/app/(auth)/actions";

interface HeaderProps {
  userEmail?: string;
  showMobileMenu?: boolean;
  onMobileMenuToggle?: () => void;
}

export function Header({
  userEmail,
  showMobileMenu = false,
  onMobileMenuToggle,
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900"
          onClick={onMobileMenuToggle}
          aria-label="Toggle menu"
        >
          {showMobileMenu ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Logo (mobile only) */}
        <div className="lg:hidden">
          <Logo size="sm" linkTo="/dashboard" />
        </div>

        {/* Spacer for desktop */}
        <div className="hidden lg:block" />

        {/* User dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 p-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="hidden sm:block max-w-[150px] truncate">
              {userEmail || "Account"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
                <form action={logout}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Sign out
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
