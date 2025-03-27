
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 md:py-8 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Barangay Basketball Tournament System</p>
        </div>
      </footer>
    </div>
  );
}
