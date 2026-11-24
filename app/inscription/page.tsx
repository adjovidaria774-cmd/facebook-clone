import SignupForm from "@/components/SignupForm";

// Page d'inscription
export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F0F2F5] px-4 py-10">
      <h1 className="text-5xl font-bold tracking-tight text-[#0866FF]">facebook</h1>
      <SignupForm />
    </main>
  );
}