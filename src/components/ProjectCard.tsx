"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ProjectMeta } from "@/lib/projects";

export default function ProjectCard({ project }: { project: ProjectMeta }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900"
    >
      <Link href={`/projects/${project.slug}`}>
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p className="text-neutral-400 mt-2">{project.description}</p>
        <div className="flex gap-2 mt-4 flex-wrap">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-neutral-800 text-neutral-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}