"use client"

interface Proposal {
  proposalId: string;
  freelancerId: string;
  freelancerName: string;
  coverLetter: string;
  proposedPrice: number;
  estimatedDuration: number; // days
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface ProposalCardProps {
  proposal: Proposal;
  onAccept?: (proposalId: string) => void;
  onReject?: (proposalId: string) => void;
}

const statusStyles: Record<Proposal["status"], string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-neutral-100 text-neutral-500 ring-neutral-400/20",
};

const statusLabel: Record<Proposal["status"], string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

function formatPrice(price: number) {
  return `$${price.toLocaleString()}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProposalCard({ proposal, onAccept, onReject }: ProposalCardProps) {
  const {
    proposalId,
    freelancerName,
    coverLetter,
    proposedPrice,
    estimatedDuration,
    status,
    createdAt,
  } = proposal;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{freelancerName}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Submitted {formatDate(createdAt)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
        >
          {statusLabel[status]}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-600 leading-relaxed">{coverLetter}</p>

      <div className="mt-4 flex items-center gap-6 border-t border-gray-100 pt-3 text-sm">
        <span className="font-semibold text-gray-900">{formatPrice(proposedPrice)}</span>
        <span className="text-gray-500">
          {estimatedDuration} {estimatedDuration === 1 ? "day" : "days"}
        </span>
      </div>

      {status === "pending" && (onAccept || onReject) && (
        <div className="mt-4 flex gap-2">
          {onAccept && (
            <button
              type="button"
              onClick={() => onAccept(proposalId)}
              className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Accept
            </button>
          )}
          {onReject && (
            <button
              type="button"
              onClick={() => onReject(proposalId)}
              className="flex-1 py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors"
            >
              Decline
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export type { Proposal };