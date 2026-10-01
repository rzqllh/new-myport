import type { ReactNode } from "react";

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border-y border-dashed border-border py-12 text-center">
      <h2 className="text-sm font-medium text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function AdminErrorState({
  title = "Unable to load this section",
  description = "The request failed. Refresh the page or try again after checking the data source.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      role="alert"
      className="border-y border-destructive/30 bg-destructive/5 px-4 py-6"
    >
      <h2 className="text-sm font-medium text-destructive">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
