import Link from './Link';
import siteMetadata from '@/data/siteMetadata';
import { GithubIcon } from 'lucide-react';
//import SocialIcon from '@/components/social-icons';

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link
            href={siteMetadata.siteRepo}
            className="text-sm text-gray-500 transition hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className={`fill-current text-gray-700 dark:text-gray-200 h-4 w-4`} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
