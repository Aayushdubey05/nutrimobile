interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function validateLoginForm({
  email,
  password,
}: LoginForm): string | null {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email";
  }

  if (!password) {
    return "Password is required";
  }

  return null;
}

export function validateSignupForm({
  name,
  email,
  password,
  confirmPassword,
}: SignupForm): string | null {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName) {
    return "Name is required";
  }

  if (trimmedName.length > 100) {
    return "Name must not exceed 100 characters";
  }

  if (!trimmedEmail) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email";
  }

  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (password.length > 100) {
    return "Password must not exceed 100 characters";
  }

  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
}
