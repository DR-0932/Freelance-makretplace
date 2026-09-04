"use client"
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string; // ISO date string
  status: "open" | "in_progress" | "completed" | "closed";
  clientName: string;
  proposalCount: number;
}

interface ProjectCardProps {
  project: Project;
  href?: string; 
}

const statusStyles: Record<Project["status"], string> = {
  open: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-600/20",
  completed: "bg-neutral-100 text-neutral-600 ring-neutral-500/20",
  closed: "bg-neutral-100 text-neutral-400 ring-neutral-400/20",
};

const statusLabel: Record<Project["status"], string> = {
  open: "Open",
  in_progress: "In Progress",
  completed: "Completed",
  closed: "Closed",
};

function formatBudget(min: number, max: number) {
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;
  return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
}

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function ProjectInfoCard({ project, href }: ProjectCardProps) {
  const {
    title,
    description,
    category,
    budgetMin,
    budgetMax,
    deadline,
    status,
    clientName,
    proposalCount,
  } = project;

  const content = (
    <div className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium text-indigo-600">{category}</span>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
        >
          {statusLabel[status]}
        </span>
      </div>

      <h3 className="mt-2 text-base font-semibold text-gray-900 group-hover:text-indigo-600">
        {title}
      </h3>

      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-gray-500">
        {description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
        <span className="font-semibold text-gray-900">
          {formatBudget(budgetMin, budgetMax)}
        </span>
        <span className="text-gray-400">Due {formatDeadline(deadline)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span className="truncate">{clientName}</span>
        <span>
          {proposalCount} {proposalCount === 1 ? "proposal" : "proposals"}
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

export type { Project };