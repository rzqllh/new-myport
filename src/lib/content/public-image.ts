const CLOUDINARY_UPLOAD_MARKER = "/image/upload/";

export function cloudinaryImageUrl(url: string, width: number) {
  if (
    !url.includes("res.cloudinary.com") ||
    !url.includes(CLOUDINARY_UPLOAD_MARKER)
  ) {
    return url;
  }

  const [prefix, suffix] = url.split(CLOUDINARY_UPLOAD_MARKER);
  if (!prefix || !suffix) return url;

  return (
    prefix +
    CLOUDINARY_UPLOAD_MARKER +
    "f_auto,q_auto,c_limit,w_" +
    width +
    "/" +
    suffix
  );
}

export function responsiveImageProps(
  url: string,
  widths: readonly number[]
): {
  src: string;
  srcSet?: string;
} {
  const sorted = [...new Set(widths)]
    .filter((width) => Number.isFinite(width) && width > 0)
    .sort((a, b) => a - b);

  if (!sorted.length || !url.includes("res.cloudinary.com")) {
    return { src: url };
  }

  const largest = sorted[sorted.length - 1];

  return {
    src: cloudinaryImageUrl(url, largest),
    srcSet: sorted
      .map(
        (width) =>
          cloudinaryImageUrl(url, width) + " " + String(width) + "w"
      )
      .join(", "),
  };
}
