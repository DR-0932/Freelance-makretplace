"use client";

import { useState } from "react";
import ProposalForm from "@/components/freelancer/createProposal";
import BrowseProjectsPage from "@/components/freelancer/projectsBrowsing";

export default function FreelancePage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <BrowseProjectsPage 
          onSelectProject={(id: string) => setSelectedProjectId(id)} 
        />
        <ProposalForm 
          projectId={selectedProjectId} 
          onSuccess={() => setSelectedProjectId("")} 
        />
      </div>
    </div>
  );
}