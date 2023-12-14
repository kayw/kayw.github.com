'use client';
import NextImage, { ImageProps } from 'next/image';
import { useState } from 'react';
import { ImageGuesture } from './ImageGesture';

function Image({ className = '', src, ...rest }: ImageProps) {
  const newClassName = `${className} hover:cursor-zoom-in`;
  const [visible, setVisible] = useState(false);
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
      <ImageGuesture src={src} visible={visible} onVisibleChange={() => setVisible(!visible)} />
    </>
  );
}

export default Image;
