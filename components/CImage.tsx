import Image from 'next/image';
import React from 'react';

interface CImageProps {
  src: string;
  caption: string;
}

function CImage({ src, caption }: CImageProps) {
  return (
    <div className="mt-10">
      <Image
        loading="lazy"
        alt={caption}
        src={src}
        width="0"
        height="0"
        sizes="100vw"
        className="w-full h-auto"
      />
      <figcaption className="text-center -mt-6 font-bold dark:text-gray-100/95">
        {caption}
      </figcaption>
    </div>
  );
}

export default CImage;