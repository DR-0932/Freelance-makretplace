const BACKEND_URL = "http://localhost:3001";

// Helper function to extract token safely on client side
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export async function signupUser(payload: Record<string, any>) {
  const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to sign up");
  }

  return data;
}

export async function loginUser(payload: { loginIdentifier: string; password: string }) {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Login error response:", data);
    throw new Error(data.error || data.message || "Failed to log in");
  }

  // Automatically persist token upon login
  if (data.token && typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
  }

  return data;
}

export async function getProjects(filters?: {
  category?: string;
  minBudget?: string;
  maxBudget?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.minBudget) params.set("minBudget", filters.minBudget);
  if (filters?.maxBudget) params.set("maxBudget", filters.maxBudget);

  const response = await fetch(`${BACKEND_URL}/api/business/projects?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to fetch projects");
  }

  // Handles both wrapped { projects: [...] } or direct array [...] responses
  return data.projects || data; 
}

export async function createProject(payload: {
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
}) {
  const response = await fetch(`${BACKEND_URL}/api/business/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to create project");
  }

  return data.project_data || data.project || data;
}

export async function createProposal(
  projectId: string,
  payload: {
    coverLetter: string;
    proposedPrice: number;
    estimatedDuration: number;
  }
) {
  const response = await fetch(`${BACKEND_URL}/api/business/projects/${projectId}/proposals`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to submit proposal");
  }

  return data.proposal || data.proposal_data || data;
}