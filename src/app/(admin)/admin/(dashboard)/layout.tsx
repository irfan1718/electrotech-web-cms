import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Service from "@/models/Service";
import Blog from "@/models/Blog";
import ContactInquiry from "@/models/ContactInquiry";
import Sidebar from "@/components/admin/sidebar";
import Topbar from "@/components/admin/topbar";
import JobApplication from "@/models/JobApplication";

async function getSidebarCounts() {
  try {
    await connectDB();
    const [services, projects, blogs, inquiries, applications] = await Promise.all([
      Service.countDocuments(),
      Project.countDocuments(),
      Blog.countDocuments(),
      ContactInquiry.countDocuments({ status: "unread" }),
      JobApplication.countDocuments({ status: "new" }),
    ]);
    return { services, projects, blogs, inquiries, applications};
  } catch {
    return { services: 0, projects: 0, blogs: 0, inquiries: 0, applications: 0 };
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const counts = await getSidebarCounts();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6fa]">
      {/* SIDEBAR */}
      <Sidebar counts={counts} />

      {/* RIGHT CONTENT */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
