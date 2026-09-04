"use client";

import { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import { createProposal } from "@/lib/api";

interface ProposalFormProps {
  projectId: string;
  onSuccess?: () => void;
}

export default function ProposalForm({ projectId, onSuccess }: ProposalFormProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (coverLetter.trim().length < 10) {
      setError("Cover letter must be at least 10 characters.");
      return;
    }
    if (!proposedPrice || Number(proposedPrice) <= 0) {
      setError("Enter a valid proposed price.");
      return;
    }
    if (!estimatedDuration || Number(estimatedDuration) <= 0) {
      setError("Enter a valid estimated duration in days.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProposal(projectId, {
        coverLetter,
        proposedPrice: Number(proposedPrice),
        estimatedDuration: Number(estimatedDuration),
      });
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
        Proposal submitted successfully.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Letter
        </label>
        <textarea
          rows={5}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Explain why you're a good fit for this project..."
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proposed Price ($)
          </label>
          <input
            type="number"
            value={proposedPrice}
            onChange={(e) => setProposedPrice(e.target.value)}
            placeholder="5000"
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (days)
          </label>
          <input
            type="number"
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(e.target.value)}
            placeholder="30"
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-50"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : (
          <>
            <span>Submit Proposal</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}