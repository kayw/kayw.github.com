import TOCInline from './TOCInline';
//import Pre from './Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm';
import type { MDXComponents } from 'mdx/types';
import Image from './Image';
import CustomLink from './Link';
import CImage from './CImage';
import { SideNote } from './SideNote';

export const components: MDXComponents = {
  Image,
  TOCInline,
  SideNote: (props) => <SideNote {...props} />, // https://github.com/contentlayerdev/contentlayer/issues/506 use client
  a: CustomLink,
  //pre: Pre,
  BlogNewsletterForm,
  CImage,
};
