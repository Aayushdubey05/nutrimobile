interface LoginForm {
  email: string;
  password: string;
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
