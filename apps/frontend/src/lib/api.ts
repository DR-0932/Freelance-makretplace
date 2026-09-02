const BACKEND_URL ="http://localhost:3001";

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
    throw new Error(data.message || "Failed to sign up");
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

  return data;
}