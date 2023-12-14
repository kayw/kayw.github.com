import projectsData from '@/data/projectsData';
//import Card from '@/components/Card';
import { genPageMetadata } from 'app/seo';
import { ProjectCard } from '@/components/ProjectCard';

export const metadata = genPageMetadata({ title: 'Projects' });

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-4 pt-4 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Here are some of the projects I've taken part or built.
          </p>
        </div>
        <div className="py-4">
          <div className="grid grid-flow-row-dense md:grid-cols-2 gap-12 md:gap-8">
            {projectsData.map((d) => (
              <ProjectCard {...d} key={d.title} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
