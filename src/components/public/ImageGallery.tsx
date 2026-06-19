"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="group aspect-[4/3] overflow-hidden rounded-xl border border-neutral-100"
          >
            <img
              src={url}
              alt={`${title} ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-6 top-6 text-white/60 hover:text-white"
          >
            <X className="h-7 w-7" />
          </button>

          {lightbox > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(lightbox - 1);
              }}
              className="absolute left-6 text-white/60 hover:text-white"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
          )}

          {lightbox < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(lightbox + 1);
              }}
              className="absolute right-6 text-white/60 hover:text-white"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          )}

          <img
            src={images[lightbox]}
            alt={`${title} ${lightbox + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <p className="absolute bottom-6 text-sm text-white/50">
            {lightbox + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
