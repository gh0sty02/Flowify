"use client";

import { defaultImages } from "@/constants/images";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { FormErrors } from "./form-errors";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ errors, id }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [images, setImages] =
    useState<Array<Record<string, any>>>(defaultImages);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // undo this for prod
  //   useEffect(() => {
  //     const fetchImages = async () => {
  //       try {
  //         const result = await unsplash.photos.getRandom({
  //           collectionIds: ["317099"],
  //           count: 9,
  //         });
  //         if (result && result.response) {
  //           setImages(result.response as Array<Record<string, any>>);
  //         } else {
  //           console.error("Failed to get Images from Unsplash");
  //         }
  //       } catch (error) {
  //         console.log(error);
  //         // setImages(defaultImages);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };
  //     fetchImages();
  //   }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              isLoading && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => {
              if (isLoading) return;

              setSelectedImage(image.id);
            }}
          >
            <input
              type="radio"
              name={id}
              id={id}
              className="hidden"
              checked={selectedImage === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
              onChange={() => {}}
            />
            <Image
              src={image.urls.thumb}
              alt="unsplash image"
              fill
              className="object-cover rounded-sm"
            />
            {selectedImage === image.id && (
              <div className="absolute h-full w-full flex items-center justify-center bg-black/30 inset-y-0">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              target="_blank"
              className="absolute bottom-0 opacity-0 group-hover:opacity-100 text-[10px] text-white truncate hover:underline p-1 bg-black/50 w-full"
              href={image.links.html}
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};
