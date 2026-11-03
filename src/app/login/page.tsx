export const dynamic = "force-dynamic";

import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface px-4 py-12">
      <LoginForm />
    </div>
  );
}