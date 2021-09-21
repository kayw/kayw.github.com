import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';

interface IBlog {
  slug: string;
  title: string;
  author: string;
  published_at: string;
  tags: string[];
  banner?: string;
  bannerCredit?: string;
  canonical?: string;
  date: string;
  outline: string;
  edit?: string;
  modified?: string;
  readingTime: string;
}

const BASE_URL = process.env.URL ?? 'https://kayw-blog.vercel.app';
const renderXmlRssFeed = (
  blogs: { metadata: IBlog }[]
): string => `<?xml version="1.0" encoding="UTF-8" ?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title><![CDATA[kayw blog rss feed]]></title>
    <description><![CDATA[Personal website and blog written from scratch with SvelteKit and TailwindCSS.]]></description>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <generator>SvelteKit</generator>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${blogs
      .map((post) => post.metadata)
      .map(
        (value: IBlog) => `
    <item>
      <title><![CDATA[${value.title}]]></title>
      <description><![CDATA[${value.outline}]]></description>
      <link>${BASE_URL}/blog/${value.slug}</link>
      <guid isPermaLink="false">${BASE_URL}/blog/${value.slug}</guid>
      <pubDate>${value.published_at}</pubDate>
    </item>
    `
      )
      .join('\n')}
  </channel>
</rss>`;

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function get() {
  const blogPath = path.resolve('src', 'routes', 'blog');
  const posts = fs
    .readdirSync(blogPath)
    .filter((elem) => !elem.startsWith('.') && !elem.includes('.'))
    .map((postFoldername) => {
      const postContent = fs.readFileSync(`${blogPath}/${postFoldername}/index.svx`, {
        encoding: 'utf8',
      });

      const postFrontMatter = frontMatter(postContent);

      return {
        metadata: {
          slug: postFoldername,
          // @ts-expect-error Spread types may only be created from object types.
          ...postFrontMatter.attributes,
        },
      };
    });

  const modifiedBlogs: { metadata: IBlog }[] = posts.filter((post) => post.metadata.published_at);
  /*
	.sort((a, b) =>
		new Date(a.metadata.date).getTime() > new Date(b.metadata.date).getTime()
			? -1
			: new Date(a.metadata.date).getTime() < new Date(b.metadata.date).getTime()
			? 1
			: 0,
	);
 */

  const rss = renderXmlRssFeed(modifiedBlogs);
  return {
    headers: {
      'Cache-Control': `max-age=0, s-max-age=${600}`, // 10 minutes
      'Content-Type': 'application/rss+xml',
    },
    body: rss,
  };
}
