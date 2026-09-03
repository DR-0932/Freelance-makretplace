"use client";

import { useEffect, useState } from "react";

// --- Adjust these to match your actual backend routes/response shape ---
const PROJECTS_ENDPOINT = "/api/projects";
const proposalsEndpoint = (projectId: string) => `/api/projects/${projectId}/proposals`;

// --- Demo mode: flip to false once your backend routes are ready ---
const USE_DEMO_DATA = true;

interface Project {
  id: string;
  title: string;
}

interface Proposal {
  id: string;
  title: string;
}

const DEMO_PROJECTS: Project[] = [
  { id: "1", title: "Landing Page Redesign" },
  { id: "2", title: "Mobile Banking App" },
  { id: "3", title: "Internal Analytics Tool" },
  { id: "4", title: "Marketing Site" },
  { id: "5", title: "Onboarding Flow" },
];

const DEMO_PROPOSALS: Record<string, Proposal[]> = {
  "1": [
    { id: "p1", title: "Homepage Concept A" },
    { id: "p2", title: "Homepage Concept B" },
    { id: "p3", title: "Pricing Page Layout" },
  ],
  "2": [
    { id: "p4", title: "Onboarding Screens" },
    { id: "p5", title: "Dashboard Wireframe" },
  ],
  "3": [{ id: "p6", title: "Chart Library Options" }],
  "4": [],
  "5": [
    { id: "p7", title: "Welcome Flow v1" },
    { id: "p8", title: "Welcome Flow v2" },
    { id: "p9", title: "Empty State Copy" },
  ],
};

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);

  useEffect(() => {
    if (USE_DEMO_DATA) {
      setProjects(DEMO_PROJECTS);
      setProjectsLoading(false);
      return;
    }
    fetch(PROJECTS_ENDPOINT)
      .then((res) => res.json())
      .then((data: Project[]) => setProjects(data))
      .catch((err) => console.error("Failed to load projects", err))
      .finally(() => setProjectsLoading(false));
  }, []);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setProposalsLoading(true);

    if (USE_DEMO_DATA) {
      setTimeout(() => {
        setProposals(DEMO_PROPOSALS[project.id] ?? []);
        setProposalsLoading(false);
      }, 200); // fake latency so loading state is visible
      return;
    }

    fetch(proposalsEndpoint(project.id))
      .then((res) => res.json())
      .then((data: Proposal[]) => setProposals(data))
      .catch((err) => console.error("Failed to load proposals", err))
      .finally(() => setProposalsLoading(false));
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Projects */}
        <section>
          <h2 className="text-sm text-neutral-400 mb-4">Projects</h2>
          {projectsLoading ? (
            <p className="text-sm text-neutral-500">Loading projects…</p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-neutral-500">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSelectProject(project)}
                  className={`aspect-square flex items-center justify-center text-center px-3 rounded-md border text-sm transition-colors ${
                    selectedProject?.id === project.id
                      ? "border-neutral-100 bg-neutral-800"
                      : "border-neutral-700 hover:border-neutral-500"
                  }`}
                >
                  {project.title}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Proposals for selected project */}
        <section>
          <h2 className="text-sm text-neutral-400 mb-4">
            {selectedProject ? `Proposals — ${selectedProject.title}` : "Proposals"}
          </h2>

          {!selectedProject ? (
            <p className="text-sm text-neutral-500">Select a project to see its proposals.</p>
          ) : proposalsLoading ? (
            <p className="text-sm text-neutral-500">Loading proposals…</p>
          ) : proposals.length === 0 ? (
            <p className="text-sm text-neutral-500">No proposals for this project yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="aspect-square flex items-center justify-center text-center px-3 rounded-md border border-neutral-700 text-sm"
                >
                  {proposal.title}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}