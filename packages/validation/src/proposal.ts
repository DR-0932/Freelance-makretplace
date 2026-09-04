import { z } from "zod";

export const proposalSchema = z.object({
  coverLetter: z
    .string()
    .min(10, "Cover letter must be at least 10 characters")
    .max(2000, "Cover letter cannot exceed 2000 characters"),
  
  proposedPrice: z
    .number()
    .positive("Proposed price must be greater than 0"),
  
  estimatedDuration: z
    .number()
    .int("Duration must be a whole number of days")
    .positive("Estimated duration must be at least 1 day"),
});

export type ProposalInput = z.infer<typeof proposalSchema>;