import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
      <Link href="/" className="mb-8 text-center">
        <span className="text-3xl font-extrabold tracking-tight text-brand-700">
          +Mulher
        </span>
        <span className="ml-1 text-2xl">🌸</span>
      </Link>
      <div className="flex-1">{children}</div>
    </div>
  );
}
