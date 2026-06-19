import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Career from "@/models/Career";
import ContactInquiry from "@/models/ContactInquiry";

type RecentProject = {
  _id: unknown;
  title: string;
  category?: string;
  projectStatus: "awarded" | "in-progress" | "completed";
};

type RecentInquiry = {
  _id: unknown;
  name: string;
  email: string;
  subject: string;
  status: "unread" | "read";
};

async function getDashboardData() {
  await connectDB();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalProjects,
    publishedProjects,
    newProjectsThisMonth,
    awardedProjects,
    inProgressProjects,
    completedProjects,
    totalBlogs,
    publishedBlogs,
    totalCareers,
    openCareers,
    totalInquiries,
    unreadInquiries,
    newInquiriesThisMonth,
    recentProjects,
    recentInquiries,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "published" }),
    Project.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Project.countDocuments({ projectStatus: "awarded" }),
    Project.countDocuments({ projectStatus: "in-progress" }),
    Project.countDocuments({ projectStatus: "completed" }),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Career.countDocuments(),
    Career.countDocuments({ status: "open" }),
    ContactInquiry.countDocuments(),
    ContactInquiry.countDocuments({ status: "unread" }),
    ContactInquiry.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title category projectStatus")
      .lean() as Promise<RecentProject[]>,
    ContactInquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject status")
      .lean() as Promise<RecentInquiry[]>,
  ]);

  return {
    totalProjects,
    publishedProjects,
    newProjectsThisMonth,
    awardedProjects,
    inProgressProjects,
    completedProjects,
    totalBlogs,
    publishedBlogs,
    totalCareers,
    openCareers,
    totalInquiries,
    unreadInquiries,
    newInquiriesThisMonth,
    recentProjects,
    recentInquiries,
  };
}

const PROJECT_STATUS_LABEL: Record<string, string> = {
  awarded: "Awarded",
  "in-progress": "In Progress",
  completed: "Completed",
};

const PROJECT_STATUS_STYLE: Record<string, string> = {
  awarded: "bg-blue-100 text-blue-700",
  "in-progress": "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
};

const QUICK_ACTIONS = [
  { label: "Add New Project", href: "/admin/projects/new" },
  { label: "Publish Blog", href: "/admin/blogs/new" },
  { label: "Create Career", href: "/admin/careers/new" },
  { label: "Manage Team", href: "/admin/team" },
];

export default async function DashboardPage() {
  const {
    totalProjects,
    publishedProjects,
    newProjectsThisMonth,
    awardedProjects,
    inProgressProjects,
    completedProjects,
    totalBlogs,
    publishedBlogs,
    totalCareers,
    openCareers,
    totalInquiries,
    unreadInquiries,
    newInquiriesThisMonth,
    recentProjects,
    recentInquiries,
  } = await getDashboardData();

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      badge: `+${newProjectsThisMonth} this month`,
      progress: totalProjects > 0 ? Math.round((publishedProjects / totalProjects) * 100) : 0,
      color: "bg-[#fff1f3]",
      textColor: "text-[#c0152a]",
      barColor: "bg-[#c0152a]",
    },
    {
      title: "Blog Articles",
      value: totalBlogs,
      badge: `${publishedBlogs} published`,
      progress: totalBlogs > 0 ? Math.round((publishedBlogs / totalBlogs) * 100) : 0,
      color: "bg-[#f3f7ff]",
      textColor: "text-blue-600",
      barColor: "bg-blue-600",
    },
    {
      title: "Career Openings",
      value: openCareers,
      badge: `${totalCareers - openCareers} closed`,
      progress: totalCareers > 0 ? Math.round((openCareers / totalCareers) * 100) : 0,
      color: "bg-[#f4fff7]",
      textColor: "text-green-600",
      barColor: "bg-green-600",
    },
    {
      title: "New Inquiries",
      value: unreadInquiries,
      badge: `+${newInquiriesThisMonth} this month`,
      progress: totalInquiries > 0 ? Math.round((unreadInquiries / totalInquiries) * 100) : 0,
      color: "bg-[#fff8f1]",
      textColor: "text-orange-600",
      barColor: "bg-orange-500",
    },
  ];

  const projectStatusCards = [
    {
      label: "Awarded",
      value: awardedProjects,
      color: "bg-blue-50",
      textColor: "text-blue-700",
      barColor: "bg-blue-500",
      total: totalProjects,
    },
    {
      label: "In Progress",
      value: inProgressProjects,
      color: "bg-amber-50",
      textColor: "text-amber-700",
      barColor: "bg-amber-500",
      total: totalProjects,
    },
    {
      label: "Completed",
      value: completedProjects,
      color: "bg-green-50",
      textColor: "text-green-700",
      barColor: "bg-green-500",
      total: totalProjects,
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-black">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Welcome back. Here&apos;s what&apos;s happening with your company website.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm text-neutral-500">{item.title}</p>
                <h2 className="mt-3 text-4xl font-black text-black">
                  {String(item.value).padStart(2, "0")}
                </h2>
              </div>
              <div
                className={`mt-1 shrink-0 rounded-2xl px-3 py-2 text-xs font-bold ${item.color} ${item.textColor}`}
              >
                {item.badge}
              </div>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className={`h-full rounded-full transition-all ${item.barColor}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* PROJECT STATUS BREAKDOWN */}
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-neutral-400">
          Project Status Breakdown
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {projectStatusCards.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">{item.label}</p>
                <span className={`rounded-xl px-3 py-1 text-xs font-bold ${item.color} ${item.textColor}`}>
                  {item.total > 0 ? Math.round((item.value / item.total) * 100) : 0}%
                </span>
              </div>
              <h2 className="mt-3 text-4xl font-black text-black">
                {String(item.value).padStart(2, "0")}
              </h2>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className={`h-full rounded-full transition-all ${item.barColor}`}
                  style={{ width: item.total > 0 ? `${Math.round((item.value / item.total) * 100)}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* RECENT PROJECTS */}
        <div className="rounded-3xl border border-neutral-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-black">Recent Projects</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Latest project activities
              </p>
            </div>
            <Link
              href="/admin/projects"
              className="text-sm font-semibold text-[#c0152a] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentProjects.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-neutral-400">
                No projects yet.{" "}
                <Link
                  href="/admin/projects/new"
                  className="font-medium text-[#c0152a] hover:underline"
                >
                  Add one →
                </Link>
              </p>
            ) : (
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-neutral-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((project) => (
                    <tr
                      key={String(project._id)}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-black">
                          {project.title}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-sm text-neutral-500">
                        {project.category || "—"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            PROJECT_STATUS_STYLE[project.projectStatus] ??
                            "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {PROJECT_STATUS_LABEL[project.projectStatus] ??
                            project.projectStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* INQUIRIES */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-black">
                  Recent Inquiries
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Latest contact submissions
                </p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-sm font-semibold text-[#c0152a] hover:underline"
              >
                View All
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <p className="py-6 text-center text-sm text-neutral-400">
                No inquiries yet.
              </p>
            ) : (
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={String(inquiry._id)}
                    className="rounded-2xl border border-neutral-100 p-4 transition hover:border-neutral-200"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-black">
                          {inquiry.name}
                        </h3>
                        <p className="mt-0.5 truncate text-sm text-neutral-500">
                          {inquiry.email}
                        </p>
                      </div>
                      {inquiry.status === "unread" && (
                        <span className="shrink-0 rounded-full bg-[#fff1f3] px-3 py-1 text-xs font-semibold text-[#c0152a]">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-neutral-600">
                      {inquiry.subject}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QUICK ACTIONS */}
          {/* <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-black">Quick Actions</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Common admin operations
              </p>
            </div>
            <div className="grid gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex h-14 items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-black transition hover:border-[#c0152a] hover:bg-[#fff8f8]"
                >
                  {action.label}
                  <span className="text-[#c0152a]">→</span>
                </Link>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
