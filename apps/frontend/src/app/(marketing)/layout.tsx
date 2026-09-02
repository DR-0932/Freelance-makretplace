import NavbarDemo from "@/components/resizable-navbar-demo";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children}: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-orange-100">
      <NavbarDemo /> 
      <main className="flex-1">{children}</main>
    </div>
  );
}