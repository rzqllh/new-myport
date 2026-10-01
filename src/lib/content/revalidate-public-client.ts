export async function revalidatePublicContent() {
  try {
    const response = await fetch("/api/admin/revalidate", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}
