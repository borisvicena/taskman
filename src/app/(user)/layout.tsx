import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taskman",
  description: "Taskman Application",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center p-8">
      <div className="w-full max-w-4xl">{children}</div>
    </div>
  );
}
