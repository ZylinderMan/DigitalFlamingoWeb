import { getAllProjects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  const projects = getAllProjects();

  return (
    <section className="snap-start snap-always min-h-screen w-full flex items-center px-6 py-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}