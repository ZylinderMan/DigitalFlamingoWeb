import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

const projectsDirectory = path.join(process.cwd(), "content/projects");

export async function generateStaticParams() {
  const filenames = fs.readdirSync(projectsDirectory);
  return filenames.map((filename) => ({
    slug: filename.replace(/\.mdx$/, ""),
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(projectsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const { default: Content } = await import(`@/../content/projects/${slug}.mdx`);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 prose prose-invert">
      <Content />
    </article>
  );
}