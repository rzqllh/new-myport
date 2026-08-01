import * as React from "react";
import { cn } from "@/lib/utils";

const AdminCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border border-border overflow-hidden divide-y divide-border", className)}
      {...props}
    />
  )
);
AdminCard.displayName = "AdminCard";

const AdminCardItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-start gap-4 p-4 transition-colors hover:bg-muted/10", className)}
      {...props}
    />
  )
);
AdminCardItem.displayName = "AdminCardItem";

const AdminCardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-4 space-y-4", className)}
      {...props}
    />
  )
);
AdminCardBody.displayName = "AdminCardBody";

export { AdminCard, AdminCardItem, AdminCardBody };
