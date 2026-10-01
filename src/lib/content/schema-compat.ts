export interface SupabaseLikeError {
  code?: string;
  message?: string;
}

export function isV2SchemaUnavailable(error: SupabaseLikeError | null) {
  if (!error) return false;

  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    /could not find the table|relation .* does not exist/i.test(
      error.message ?? ""
    )
  );
}
