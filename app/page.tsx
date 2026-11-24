import LoginForm from "@/components/LoginForm";

// Page de connexion : c'est la première page du site
export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#F0F2F5] px-4 py-10 lg:flex-row lg:gap-20">
      <div className="max-w-md text-center lg:text-left">
        <h1 className="text-5xl font-bold tracking-tight text-[#0866FF] sm:text-6xl">facebook</h1>
        <p className="mt-4 text-2xl leading-8 text-[#1C1E21]">
          Retrouve tes amis, partage tes moments et reste en contact avec ton entourage.
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
