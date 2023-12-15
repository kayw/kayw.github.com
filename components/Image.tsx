'use client';
import NextImage, { ImageProps } from 'next/image';
import { useState } from 'react';
import { ImageGuesture } from './ImageGesture';
import { StaticImageData, StaticRequire } from 'next/dist/shared/lib/get-img-props';

function Image({ className = '', src, ...rest }: ImageProps) {
  const newClassName = `${className} hover:cursor-zoom-in`;
  const [visible, setVisible] = useState(false);
  let imgSrc = src as string;
  if ((src as StaticRequire).default) {
    imgSrc = (src as StaticRequire).default.src;
  } else if ((src as StaticImageData).src) {
    imgSrc = (src as StaticImageData).src;
  }
  return (
    <>
      <NextImage
        {...rest}
        className={newClassName}
        src={src}
        onClick={() => {
          setVisible(true);
        }}
      />
      <ImageGuesture src={imgSrc} visible={visible} onVisibleChange={() => setVisible(!visible)} />
    </>
  );
}

export default Image;
