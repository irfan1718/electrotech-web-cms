"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  FolderKanban,
  Wrench,
  Info,
} from "lucide-react";

import clsx from "clsx";
import { useAdminStore } from "@/store/adminStore";

export interface SidebarCounts {
  services: number;
  projects: number;
  blogs: number;
  inquiries: number;
  applications: number;
}

export default function Sidebar({ counts }: { counts?: SidebarCounts }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const { sidebarOpen } = useAdminStore();

  const menuItems = [
    {
      title: "MAIN",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "CONTENT",
      items: [
        { label: "About Us", href: "/admin/about", icon: Info },
        {
          label: "Services",
          href: "/admin/services",
          icon: Wrench,
          badge: counts?.services,
        },
        {
          label: "Projects",
          href: "/admin/projects",
          icon: FolderKanban,
          badge: counts?.projects,
        },
        {
          label: "Blogs",
          href: "/admin/blogs",
          icon: FileText,
          badge: counts?.blogs,
        },
      ],
    },
    {
      title: "PEOPLE",
      items: [
        { label: "Team", href: "/admin/team", icon: Users },
        { label: "Careers", href: "/admin/careers", icon: Briefcase },
      ],
    },
    {
      title: "COMMUNICATION",
      items: [
        {
          label: "Inquiries",
          href: "/admin/inquiries",
          icon: MessageSquare,
          badgeRed: counts?.inquiries,
        },
        {
          label: "Applications",
          href: "/admin/applications",
          icon: FileText,
          badgeRed: counts?.applications,
        },
      ],
    },
  ];

  return (
    <aside
      className={clsx(
        "flex h-full flex-col shrink-0 bg-white overflow-hidden transition-[width] duration-300",
        sidebarOpen ? "w-64 border-r border-neutral-200" : "w-0",
      )}
    >
      {/* LOGO */}
      <div className="flex h-[78px] shrink-0 items-center border-b border-neutral-200 px-5 gap-3">
        <Image
          src="/images/logo-electrotech.png"
          alt="Electrotech logo"
          width={32}
          height={32}
          className="shrink-0 object-contain"
        />
        <div>
          <h1 className="text-[15px] font-black tracking-tight text-black leading-none">
            ELECTRO<span className="text-[#c0152a]">TECH</span>
          </h1>
          <p className="mt-0.5 text-[9px] uppercase tracking-widest text-neutral-400">Admin Panel</p>
        </div>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {menuItems.map((section) => (
            <div key={section.title}>
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                {section.title}
              </p>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-2.5 py-2 pr-2 text-sm transition-colors",
                        isActive
                          ? "rounded-r-lg border-l-2 border-[#c0152a] bg-[#FDF0F2] pl-[6px] font-medium text-[#c0152a]"
                          : "rounded-lg pl-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                      )}
                    >
                      <span
                        className={clsx(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                          isActive ? "bg-[#c0152a] text-white" : "",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex-1">{item.label}</span>

                      {"badge" in item && item.badge != null && item.badge > 0 && (
                        <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-500">
                          {item.badge}
                        </span>
                      )}

                      {"badgeRed" in item && item.badgeRed != null && item.badgeRed > 0 && (
                        <span className="rounded-md bg-[#c0152a] px-1.5 py-0.5 text-[11px] font-medium text-white">
                          {item.badgeRed}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* USER FOOTER */}
      <div className="shrink-0 border-t border-neutral-200 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBE3E7] text-xs font-bold uppercase text-[#c0152a]">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-black">
              {user?.name || "Admin User"}
            </p>
            <p className="truncate text-xs text-neutral-400">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
