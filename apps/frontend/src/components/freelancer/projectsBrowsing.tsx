"use client";

import { useEffect, useState } from "react";
import ProjectCard, { type Project } from "@/components/freelancer/projectCard";
import { getProjects } from "@/lib/api";

type Category = "Web Development" | "Mobile App" | "UI/UX Design" | "Marketing";

interface Filters {
  category: Category | "";
  minBudget: string;
  maxBudget: string;
}

interface BrowseProjectsPageProps {
  onSelectProject?: (projectId: string) => void;
}

export default function BrowseProjectsPage({ onSelectProject }: BrowseProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    category: "",
    minBudget: "",
    maxBudget: "",
  });

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProjects({
          category: filters.category,
          minBudget: filters.minBudget,
          maxBudget: filters.maxBudget,
        });
        setProjects(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [filters.category, filters.minBudget, filters.maxBudget]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Projects</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                category: e.target.value as Category | "",
              }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App">Mobile App</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Budget ($)
          </label>
          <input
            type="number"
            value={filters.minBudget}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, minBudget: e.target.value }))
            }
            placeholder="0"
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Budget ($)
          </label>
          <input
            type="number"
            value={filters.maxBudget}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxBudget: e.target.value }))
            }
            placeholder="Any"
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <button
          type="button"
          onClick={() =>
            setFilters({ category: "", minBudget: "", maxBudget: "" })
          }
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Clear filters
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl border border-gray-200 bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev }))}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No projects match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject?.(project.id)}
              className="cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              <ProjectCard project={project} href={`/projects/${project.id}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}