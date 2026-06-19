"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "Blogs", href: "/blogs" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      {!isHome && (
        <div className="hidden border-b border-neutral-100 bg-white lg:block">
          <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-2 lg:px-10">
            <span className="text-[11px] text-neutral-400">
              Electrotech Electromechanical Contracting LLC
            </span>
            <div className="flex items-center gap-6">
              <a
                href="tel:+97140000000"
                className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 transition hover:text-[#C0152A]"
              >
                <Phone className="h-3 w-3" /> +971 4 000 0000
              </a>
              <a
                href="mailto:info@electrotech-uae.com"
                className="text-[11px] font-medium text-neutral-500 transition hover:text-[#C0152A]"
              >
                info@electrotech-uae.com
              </a>
            </div>
          </div>
        </div>
      )}

      {isHome && (
        <div
          className={clsx(
            "absolute left-0 right-0 top-0 z-40 hidden border-b lg:block",
            "border-white/10",
          )}
        >
          <div className="mx-auto flex max-w-[1360px] items-center justify-between px-6 py-2 lg:px-10">
            <span className="text-[11px] text-white/40">
              Electrotech Electromechanical Contracting LLC
            </span>
            <div className="flex items-center gap-6">
              <a
                href="tel:+97140000000"
                className="flex items-center gap-1.5 text-[11px] font-medium text-white/50 transition hover:text-white"
              >
                <Phone className="h-3 w-3" /> +971 4 000 0000
              </a>
              <a
                href="mailto:info@electrotech-uae.com"
                className="text-[11px] font-medium text-white/50 transition hover:text-white"
              >
                info@electrotech-uae.com
              </a>
            </div>
          </div>
        </div>
      )}

      <nav
        className={clsx(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          isHome ? "top-0 lg:top-[33px]" : "top-0",
          isTransparent
            ? "bg-transparent"
            : "bg-white/95 !top-0 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-xl",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1360px] items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo-electrotech.png"
              alt="Electrotech Electromechanical"
              width={44}
              height={44}
              className="h-auto w-[44px] object-contain"
              priority
            />
            <div className="leading-none">
              <span
                className={clsx(
                  "text-xl font-extrabold tracking-wide",
                  isTransparent ? "text-white" : "text-[#080808]",
                )}
              >
                ELECTRO<span className="text-[#C0152A]">TECH</span>
              </span>
              <p
                className={clsx(
                  "mt-0.5 text-[8px] uppercase tracking-[0.2em]",
                  isTransparent ? "text-white/40" : "text-neutral-400",
                )}
              >
                Electromechanical · UAE
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "relative px-3.5 py-2 text-[13px] font-medium transition",
                    isActive
                      ? "text-[#C0152A]"
                      : isTransparent
                        ? "text-white/70 hover:text-white"
                        : "text-neutral-600 hover:text-[#080808]",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-3.5 right-3.5 h-[2px] rounded-full bg-[#C0152A]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden items-center gap-2 rounded-lg bg-[#C0152A] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[#960F20] lg:flex"
            >
              Get a Quote <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-lg border lg:hidden",
                isTransparent
                  ? "border-white/20 text-white"
                  : "border-neutral-200 text-neutral-700",
              )}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-x-0 top-[72px] z-40 max-h-[calc(100vh-72px)] overflow-y-auto bg-white px-6 py-6 shadow-xl lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "w-full rounded-xl px-5 py-3.5 text-lg font-semibold transition",
                    pathname === link.href
                      ? "bg-red-50 text-[#C0152A]"
                      : "text-neutral-700 hover:bg-neutral-50",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-4 w-full rounded-xl bg-[#C0152A] py-4 text-center text-sm font-bold uppercase tracking-wider text-white"
              >
                Get a Quote
              </Link>
            </nav>
          </div>
        </>
      )}

      {!isHome && <div className="h-[72px] lg:h-[105px]" />}
    </>
  );
}
