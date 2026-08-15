import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "content/projects");

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  date: string;
}

export function getAllProjects(): ProjectMeta[] {
  const filenames = fs.readdirSync(projectsDirectory);

  const projects = filenames.map((filename) => {
    const filePath = path.join(projectsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(/\.mdx$/, ""),
      ...(data as Omit<ProjectMeta, "slug">),
    };
  });

  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}