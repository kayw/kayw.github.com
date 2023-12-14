import { ArrowUpRight } from 'lucide-react';
import Link from '@/components/Link';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/siteMetadata';
import { formatDate } from './util';
import projectsData from '@/data/projectsData';
//import Card from '@/components/Card';
import { ProjectCard } from '@/components/ProjectCard';
//import NewsletterForm from 'pliny/ui/NewsletterForm'
//import Image from 'next/image';

const MAX_DISPLAY = 3;

/*
 * #TODO
 * https://weirdo.cn/404
 */
export default function Home({ posts }) {
  return (
    <>
      <div className="flex items-center justify-between space-y-2 mt-4 mb-8">
        <div className="space-y-2">
          <h1 className="text-xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-10 md:leading-14">
            Hi, <span>I'm </span>
            <span className="text-sky-500 dark:text-teal-400">kayw</span>
            <span className="wave">👋🏻</span>
          </h1>
          <p>Welcome to my digital garden! It's great honour to have you here.</p>
          <p>I'm a freelancer and ready to be hired for your future amazing projects.</p>
          <p>
            I'm a versatile indie hacker with a great ability of problem solving and product
            delivery.
          </p>
          <p>
            I'm a fullstack developer with rich experience in NodeJs/ReactJS/Typescript/Golang
            technology stack.
          </p>
          {/*
https://github.com/said7388/developer-portfolio
https://github.com/hktitof/my-website
https://abusaid.netlify.app/
https://musing.vercel.app/blog
*/}
          {/*
https://preview.themeforest.net/item/edrea-personal-portfolio-react-template/full_screen_preview/38647904 learn more modal skills chart / work timeline
https://nayanbastola.com/
          <Link
            href="/about"
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded mt-4 inline-block"
          >
            About Me
          </Link>
*/}
        </div>
        {/*
        <div className="rounded-full md:hidden shadow-lg ">
          <Image
            src="/static/images/avatar.jpg"
            alt="avatar"
            width={150}
            height={150}
            className="h-50 w-50 rounded-full shadow-gray-300"
          />
        </div>
        <Image
          src="/static/images/avatar.jpg"
          alt="avatar"
          width={200}
          height={200}
          className="h-50 w-50 rounded-full hidden md:block shadow-lg shadow-gray-400"
        />
*/}
      </div>
      <div className="flex flex-col lg:flex-row items-start gap-x-4">
        <div className="flex-1 divide-y divide-gray-200 dark:divide-gray-700 round-lg">
          <div className="space-y-0 mt-3 md:mt-0 pb-2 pt-6 md:space-y-5">
            <p className="text-lg leading-7 text-gray-900 dark:text-gray-100">
              Projects I've worked
            </p>
          </div>
          <div className="py-4">
            <div className="flex flex-wrap justify-center gap-8">
              {projectsData.slice(0, MAX_DISPLAY).map((d) => (
                <ProjectCard
                  key={d.title}
                  title={d.title}
                  description={d.description}
                  images={d.images}
                  href={d.href}
                  techs={d.techs}
                />
              ))}
            </div>
          </div>
          {projectsData.length > MAX_DISPLAY && (
            <a
              className="flex mt-2 font-medium leading-tight text-slate-200 font-semibold text-slate-200 group"
              aria-label="View Full Project Archive"
              href="/projects"
            >
              <span className="border-b border-transparent pb-px transition group-hover:border-teal-300 motion-reduce:transition-none text-primary-500">
                View Full Project Archive
                <ArrowUpRight className="inline-block h-4 w-4 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none" />
              </span>
            </a>
          )}
        </div>
        <div className="flex-1 divide-y divide-gray-200 dark:divide-gray-700 round-lg">
          <div className="space-y-0 mt-3 md:mt-0 pb-2 pt-6 md:space-y-5">
            <p className="text-lg leading-7 text-gray-900 dark:text-gray-100">
              Explore my latest posts.
            </p>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!posts.length && 'No posts found.'}
            {posts.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, date, title, summary, tags } = post;
              return (
                <li key={slug} className="py-4">
                  <article>
                    <div className="space-y-2 transition hover:scale-105 hover:rounded-xl hover:lg:bg-gray-100/20 hover:lg:dark:bg-zinc-800/90 xl:grid xl:grid-cols-6 xl:items-baseline md:px-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        </dd>
                      </dl>
                      <div className="space-y-5 xl:col-span-5 xl:p-2 rounded-lg">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-xl md:text-2xl font-bold  leading-8 tracking-tight">
                              <Link
                                href={`/blog/${slug}`}
                                className="text-gray-800 hover:underline underline-offset-4 dark:text-gray-100 hover:dark:text-green-400"
                              >
                                <div>{title}</div>
                              </Link>
                            </h2>
                            <div className="flex flex-wrap">
                              {tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {summary}
                          </div>
                        </div>
                        <div className="text-base font-medium leading-6">
                          <Link
                            href={`/blog/${slug}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label={`Read "${title}"`}
                          >
                            Read more &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
        {posts.length > MAX_DISPLAY && (
          <div className="flex justify-end text-base font-medium leading-6">
            <Link
              href="/blog"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="All posts"
            >
              All Posts &rarr;
            </Link>
          </div>
        )}
      </div>
      {/*
https://preview.themeforest.net/item/jackcreative-react-nextjs-portfolio-template/full_screen_preview/47727028
https://georgefrancis.dev/
https://www.anaflous.com/

https://demo.maxencewolff.com/ astro
https://www.atksoto.com/resume
*/}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-0 mt-3 md:mt-0 pb-2 pt-6 md:space-y-5">
          <p className="text-lg leading-7 text-gray-900 dark:text-gray-100">Get In Touch</p>
        </div>
        <div className="group relative">
          {/*
https://github.com/pycoder2000/blog  https://musing.vercel.app/
*/}
          <div className="animate-tilt absolute -inset-0.5 mt-3 rounded-lg bg-gradient-to-br from-amber-200 to-yellow-300 opacity-50 blur transition duration-1000 group-hover:opacity-70 group-hover:duration-200"></div>
          <div className="relative flex flex-col items-center justify-center rounded-lg py-3 mt-4 bg-[#fff6e5] dark:bg-[#1B1B1B]">
            <div className="pb-1 px-1 text-3xl font-semibold text-gray-800 dark:text-gray-100">
              Have a project in mind? <p>I'm always open to new opportunities 📫 </p>
            </div>
            <a
              type="button"
              href={`mailto:${siteMetadata.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Let's Connect👋
              {/*<Mail className="inline-block h-4 w-4 shrink-0 transition-transform -translate-y-0.5 translate-x-1" />*/}
            </a>
          </div>
        </div>
      </div>
      {/* {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )} */}
    </>
  );
}
