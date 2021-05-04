import fs from 'fs';
import path from 'path';
import MD from 'markdown-to-jsx';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { LocaleSwitch } from '../components/navigation/LocaleSwitch';

interface ContentPageProps {
  markdownContent: string;
}

const ContentPage: NextPage<ContentPageProps> = ({ markdownContent }: ContentPageProps) => {
  return (
    <div>
      <div>Content page outside of /app</div>
      <div>{markdownContent ? <MD>{markdownContent}</MD> : ''}</div>
      <div>
        <LocaleSwitch />
      </div>
    </div>
  );
};

interface ContentPageGetStaticProps {
  params: { slug: string[] };
  locale: string;
}

export const getStaticProps: GetStaticProps<ContentPageGetStaticProps> = async ({
  params,
  locale,
}: ContentPageGetStaticProps) => {
  const { slug } = params;

  const markdownContent = fs.readFileSync(`${path.join('./content', locale, ...slug)}.md`, 'utf-8');

  return {
    props: {
      params,
      locale,
      markdownContent,
    },
  };
};

const getFilePaths = (directoryPath: string): string[] => {
  const filePaths: string[] = [];

  const findFilePaths = (directory: string): void => {
    fs.readdirSync(directory).forEach((relativePath) => {
      const absolutePath = path.join(directory, relativePath);

      if (fs.statSync(absolutePath).isDirectory()) {
        findFilePaths(absolutePath);
      } else {
        filePaths.push(absolutePath);
      }
    });
  };

  findFilePaths(directoryPath);

  return filePaths;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const filePaths = getFilePaths('./content');

  const pagePaths = filePaths.map((filePath) => ({
    locale: filePath.split('/')[1],
    params: {
      slug: filePath
        .split('/')
        .slice(2)
        .map((slug) => slug.replace('.md', '')),
    },
  }));

  return {
    paths: pagePaths,
    fallback: false,
  };
};

export default ContentPage;
