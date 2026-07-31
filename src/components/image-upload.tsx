"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/cloudinary";
import { UploadSimple, X, Image as ImageIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onUpload: (url: string, publicId: string) => void;
  onRemove?: () => void;
  folder?: string;
  className?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onUpload,
  onRemove,
  folder = "portfolio",
  className,
  label = "Upload image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate: image only, max 10MB
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const { url, publicId } = await uploadImage(file, folder);
      onUpload(url, publicId);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-full object-cover"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors"
              aria-label="Remove image"
            >
              <X weight="bold" size={14} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "w-full aspect-video rounded-xl border-2 border-dashed border-border",
            "flex flex-col items-center justify-center gap-2",
            "text-muted-foreground hover:text-foreground hover:border-primary",
            "transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {uploading ? (
            <>
              <div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon weight="duotone" size={32} className="opacity-40" />
              <span className="text-sm font-medium">{label}</span>
              <span className="text-xs opacity-60">PNG, JPG, WebP up to 10MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label={label}
      />

      {!value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          <UploadSimple weight="duotone" data-icon="inline-start" />
          {uploading ? "Uploading..." : label}
        </Button>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
