import type {CSSProperties} from 'react';
import type {MetaImage} from '~/lib/metaobjects';

type MetaobjectBannerImageProps = {
  image: MetaImage | null;
  className?: string;
  imgClassName?: string;
  loading?: 'eager' | 'lazy';
};

function joinClasses(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export function MetaobjectBannerImage({
  image,
  className,
  imgClassName,
  loading = 'lazy',
}: MetaobjectBannerImageProps) {
  const aspectRatio =
    image?.width && image.height
      ? `${image.width} / ${image.height}`
      : '16 / 9';

  return (
    <div
      className={joinClasses(
        'relative w-full overflow-hidden bg-[#D2D2D2]',
        className,
      )}
      style={{aspectRatio} as CSSProperties}
    >
      {image && (
        <img
          src={image.url}
          alt={image.altText}
          width={image.width}
          height={image.height}
          loading={loading}
          decoding="async"
          className={joinClasses(
            'block h-auto w-full object-contain md:absolute md:inset-0 md:h-full md:object-cover',
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
