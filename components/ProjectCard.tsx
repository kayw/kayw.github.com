'use client';

//import { useEffect, useState } from 'react';
import Image from './Image';
//import Link from './Link';
//import { DevIcons } from './DevIcons';
import { ArrowUpRight } from 'lucide-react';

export const ProjectCard = ({ title, description, images = [] as string[], href, techs }) => {
  // to solve hydration mismatch error
  /*
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
*/
  {
    /*
https://brittanychiang.com/#projects
*/
  }
  return (
    <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
      <div className="absolute -inset-x-0 -inset-y-2 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-0 lg:inline-block lg:group-hover:dark:bg-slate-700/20 lg:group-hover:bg-gray-100/10 lg:group-hover:shadow-[inset_0_0_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
      <div className="hover:brightness-125 sm:order-2 sm:col-span-6">
        <h3>
          <a
            className="inline-flex items-baseline font-medium leading-tight text-gray-700 dark:text-slate-200 hover:text-teal-600 hover:dark:text-teal-500 group/link text-base"
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={title}
          >
            <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
            <span>
              {title}
              <span className="inline-block">
                <ArrowUpRight className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" />
              </span>
            </span>
          </a>
        </h3>
        <p className="mt-2 text-sm leading-normal">{description}</p>
        <ul className="mt-2 flex flex-wrap" aria-label="Technologies used:">
          {techs.map((tech: string) => (
            <li className="mr-1.5 mt-2" key={tech}>
              <div className="flex items-center rounded-full bg-sky-500/20 dark:bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-500 dark:text-teal-300 ">
                {tech}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="sm:order-1 sm:col-span-2">
        {images.map((imgSrc: string) => (
          <Image
            alt={title}
            width="200"
            height="48"
            data-nimg="1"
            className="rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 sm:translate-y-1 text-transparent"
            key={imgSrc}
            src={imgSrc}
          />
        ))}
      </div>
    </div>
  );
};
