import {useEffect, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';

type GalleryImage = NonNullable<
  ProductFragment['images']
>['nodes'][number];

/**
 * Product image gallery for the MSC PDP.
 * Large image on a white card (object-contain so apparel/objects never crop),
 * with a thumbnail strip beneath. Selecting a variant with its own image jumps
 * the gallery to that image.
 */
export function ProductGallery({
  images,
  selectedImageId,
  title,
}: {
  images: GalleryImage[];
  selectedImageId?: string | null;
  title: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(
    selectedImageId ?? images[0]?.id ?? null,
  );

  // Follow the selected variant's image when it changes.
  useEffect(() => {
    if (selectedImageId) setActiveId(selectedImageId);
  }, [selectedImageId]);

  const active =
    images.find((img) => img.id === activeId) ?? images[0] ?? null;

  if (!active) {
    return (
      <div className="w-full aspect-[4/5] bg-white rounded-[10px]" />
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Main image */}
      <div className="w-full overflow-hidden rounded-[10px] bg-white">
        <Image
          alt={active.altText || title}
          data={active}
          key={active.id}
          className="w-full aspect-[4/5] object-contain"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-[10px] flex-wrap">
          {images.map((img) => {
            const isActive = img.id === active.id;
            return (
              <button
                type="button"
                key={img.id}
                aria-label={`View ${img.altText || title}`}
                onClick={() => setActiveId(img.id ?? null)}
                className="overflow-hidden rounded-[8px] bg-white cursor-pointer transition-opacity hover:opacity-100"
                style={{
                  width: 84,
                  height: 84,
                  boxShadow: isActive
                    ? '0 0 0 2px var(--color-black)'
                    : '0 0 0 1px var(--color-neutral-02)',
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                <Image
                  alt={img.altText || title}
                  data={img}
                  className="w-full h-full object-contain"
                  sizes="84px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
