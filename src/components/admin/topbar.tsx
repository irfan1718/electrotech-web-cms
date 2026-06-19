"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut, Menu } from "lucide-react";
import { useAdminStore } from "@/store/adminStore";

export default function Topbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const { toggleSidebar } = useAdminStore();
  const pathname = usePathname();
  const segment = pathname.replace(/^\/admin\/?/, "").split("/")[0] || "dashboard";
  const breadcrumb = segment.charAt(0).toUpperCase() + segment.slice(1);

  return (
    <header className="sticky top-0 z-40 flex h-[78px] items-center justify-between border-b border-neutral-200 bg-white px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-[#F8F9FB] hover:text-black"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="text-sm text-neutral-400">Electrotech</span>

        <ChevronRight className="h-5 w-5 text-neutral-300" />

        <span className="text-sm font-semibold text-black">{breadcrumb}</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* AVATAR */}
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1f3] text-sm font-bold uppercase text-[#c0152a]">
            {user?.name?.charAt(0) || "A"}
          </div>

          <div className="hidden text-left lg:block">
            <p className="text-sm font-semibold text-black">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
