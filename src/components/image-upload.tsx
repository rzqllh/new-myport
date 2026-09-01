/* eslint-disable */
"use client";

import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/cloudinary";
import { UploadSimple, X, Image as ImageIcon, Crop as CropIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onUpload: (url: string, publicId: string) => void;
  onRemove?: () => void;
  folder?: string;
  className?: string;
  label?: string;
  aspectRatio?: number;
}

// Helper to center the crop initially
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageUpload({
  value,
  onUpload,
  onRemove,
  folder = "portfolio",
  className,
  label = "Upload image",
  aspectRatio,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crop modal state
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  
  const [urlInput, setUrlInput] = useState("");

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be under 10MB.");
        return;
      }

      setOriginalFile(file);
      setCrop(undefined); // Reset crop
      
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(file);

      // Reset input
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspectRatio) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    }
  }

  // Extract cropped image as Blob
  const getCroppedImg = async (
    image: HTMLImageElement,
    cropConfig: PixelCrop,
    fileName: string
  ): Promise<File> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = cropConfig.width;
    canvas.height = cropConfig.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      image,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY,
      0,
      0,
      cropConfig.width,
      cropConfig.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      }, "image/jpeg");
    });
  };

  async function handleCropConfirm() {
    if (!originalFile) return;

    let fileToUpload = originalFile;

    // If crop is completed and has width/height, extract the cropped area
    if (completedCrop?.width && completedCrop?.height && imgRef.current && aspectRatio) {
      try {
        fileToUpload = await getCroppedImg(imgRef.current, completedCrop, originalFile.name);
      } catch (err) {
        console.error("Crop failed", err);
        toast.error("Failed to crop image.");
        return;
      }
    }

    setIsCropModalOpen(false);
    setUploading(true);
    setError(null);

    try {
      const { url, publicId } = await uploadImage(fileToUpload, folder);
      onUpload(url, publicId);
      toast.success("Image uploaded successfully.");
    } catch {
      toast.error("Upload failed. Please try again.");
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleUrlSubmit() {
    if (!urlInput.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    // We pass the URL directly back to the parent.
    // For external URLs, we might not have a publicId, so we can pass an empty string or the URL itself.
    onUpload(urlInput.trim(), ""); 
    setUrlInput("");
    toast.success("Image URL added successfully.");
  }

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border">
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-full object-cover"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm"
              aria-label="Remove image"
            >
              <X weight="bold" size={14} />
            </button>
          )}
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="url">Paste URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className={cn(
                "w-full aspect-video rounded-xl border-2 border-dashed border-border",
                "flex flex-col items-center justify-center gap-2",
                "text-muted-foreground hover:text-foreground hover:border-primary",
                "transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-muted/20"
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
          </TabsContent>
          
          <TabsContent value="url">
            <div className="flex gap-2">
              <Input 
                placeholder="https://example.com/image.jpg" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
              />
              <Button type="button" onClick={handleUrlSubmit}>
                Save URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onSelectFile}
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
          <UploadSimple weight="duotone" className="mr-2" />
          {uploading ? "Uploading..." : label}
        </Button>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Crop Modal */}
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center bg-black/5 rounded-lg p-2 overflow-hidden max-h-[60vh]">
            {!!imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                className="max-h-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-h-[50vh] w-auto object-contain"
                />
              </ReactCrop>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm}>
              <CropIcon weight="bold" className="mr-2" />
              Crop & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

