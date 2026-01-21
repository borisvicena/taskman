import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taskman",
  description: "Taskman Application",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full items-start justify-center p-8">
      <div className="w-full max-w-7xl">{children}</div>
    </div>
  );
}
