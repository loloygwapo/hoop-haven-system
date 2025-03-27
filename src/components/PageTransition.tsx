
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <div 
      className={`animate-fade-in ${className}`}
      style={{ animationDuration: "0.4s", animationFillMode: "both" }}
    >
      {children}
    </div>
  );
}
