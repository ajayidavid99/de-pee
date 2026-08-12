// src/app/(public)/products/[id]/product-gallery.tsx
'use client';

import { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  // Set the first image as the default, or a fallback placeholder if the array is empty
  const [mainImage, setMainImage] = useState(images[0] || '/placeholder.png');

  return (
    <div className="flex flex-col gap-4">
      {/* Main Focus Image */}
      <div className="aspect-square w-full overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm flex items-center justify-center p-4">
        <img
          src={mainImage}
          alt={productName}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnails Row (Only render if there is more than 1 image) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {images.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => setMainImage(imgUrl)}
              className={`relative h-20 w-20 flex-shrink-0 rounded-lg border bg-white overflow-hidden transition-all duration-200 ${
                mainImage === imgUrl
                  ? 'ring-2 ring-primary border-transparent'
                  : 'border-border/50 opacity-70 hover:opacity-100 hover:border-primary/50'
              }`}
            >
              <img
                src={imgUrl}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}