const API_BASE = import.meta.env.VITE_OURA_API_BASE_URL;

// Function to log someone in
async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Send cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

// Function to register someone new
async function registerUser(name, email, password) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Send cookies
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
}

// Function to log someone out
async function logoutUser() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include', // Send cookies
  });
}

export { loginUser, registerUser, logoutUser };