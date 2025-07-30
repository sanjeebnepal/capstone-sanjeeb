import { useState } from "react";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (form) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
  if (!res.ok) {
  const msg = await res.json();
  throw new Error(msg.error || "Registration failed");
}
      return await res.json();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
// This code defines a custom hook called useRegister that manages the registration process for a user.
// It uses the useState hook to manage loading and error states. The register function sends a POST request to the server with the user's registration data.
// If the request is successful, it returns the response data; otherwise, it sets an error message.
// The hook returns the register function, loading state, and error message, allowing components to use it for user registration.