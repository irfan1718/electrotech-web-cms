"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import clsx from "clsx";

interface Props {
  projects: any[];
  categories: string[];
  statuses: string[];
}

export default function ProjectsFilter({
  projects,
  categories,
  statuses,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");

  const filtered = projects.filter((p) => {
    const matchCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchStatus =
      activeStatus === "All" || p.projectStatus === activeStatus;
    return matchCategory && matchStatus;
  });

  return (
    <>
      {/* Filters */}
      <div className="mb-12 rounded-2xl border border-neutral-100 bg-[#FAFAFA] p-6">
        {/* Category row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">
            Category
          </span>
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                "rounded-full px-5 py-2 text-[13px] font-medium transition",
                activeCategory === cat
                  ? "bg-[#C0152A] text-white shadow-sm"
                  : "bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-neutral-200/60" />

        {/* Status row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">
            Status
          </span>
          {["All", ...statuses].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={clsx(
                "rounded-full px-5 py-2 text-[13px] font-medium transition",
                activeStatus === status
                  ? "bg-[#080808] text-white shadow-sm"
                  : "bg-white border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700",
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="mb-6 text-[13px] text-neutral-400">
        Showing{" "}
        <span className="font-semibold text-neutral-700">
          {filtered.length}
        </span>{" "}
        project{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project: any) => (
            <ProjectCard
              key={project._id}
              title={project.title}
              caption={project.caption}
              slug={project.slug}
              thumbnail={project.thumbnail}
              category={project.category}
              location={project.location}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-60 items-center justify-center rounded-xl border border-neutral-100 bg-[#F7F7F8] text-neutral-400">
          No projects match these filters
        </div>
      )}
    </>
  );
}
