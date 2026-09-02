import { z } from "zod";

export const createProjectSchema = z
  .object({

    title: z.string().min(1, "Title is required"),
    
    description: z.string().min(1, "Description is required"),
    
    category: z.string().min(1, "Category is required"),
    
    budgetMin: z.number().positive("Minimum budget must be greater than 0"),
    
    budgetMax: z.number().positive("Maximum budget must be greater than 0"),
    
    deadline: z.coerce.date(),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {

    message: "Maximum budget must be greater than or equal to minimum budget",
  
    path: ["budgetMax"],
  
  })
  .refine((data) => data.deadline.getTime() > Date.now(), {

    message: "Deadline must be in the future",
  
    path: ["deadline"],
  });

export const getProjectSchema = z.object({

  category: z.string().optional(),
  
  minBudget: z.coerce.number().positive().optional(),
  
  maxBudget: z.coerce.number().positive().optional(),
});


export type GetProjectsQuery = z.infer<typeof getProjectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
