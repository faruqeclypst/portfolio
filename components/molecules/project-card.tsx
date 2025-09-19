"use client";

import React from "react";
import Link from "next/link";
import { OptimizedImage } from "@/components/atoms/optimized-image";
import { Icons } from "@/components/atoms/icons";
import { MicroCMSProject } from "@/actions/projects";

interface MicroCMSProjectCardProps {
  project: MicroCMSProject;
}

export default function MicroCMSProjectCard({
  project,
}: MicroCMSProjectCardProps) {
  // Strip HTML tags from description for preview
  const plainDescription = project.description.replace(/<[^>]*>/g, "");

  return (
    <article className="group relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-full">
      <Link href={`/projects/${project.id}`} className="block">
        <div className="relative overflow-hidden">
          {project.thumbnail ? (
            <div className="relative aspect-video overflow-hidden">
              <OptimizedImage
                src={project.thumbnail.url}
                alt={`${project.title} thumbnail`}
                width={project.thumbnail.width}
                height={project.thumbnail.height}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Icons.image className="w-12 h-12 text-muted-foreground" />
            </div>
          )}

          {/* Floating Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.project_url && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.project_url, "_blank");
                }}
                className="cursor-pointer h-10 w-10 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full border shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                title="Visit Project"
              >
                <Icons.externalLink className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-medium bg-primary/90 text-primary-foreground rounded-full backdrop-blur-sm">
              Blogs
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>

            {plainDescription && (
              <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                {plainDescription}
              </p>
            )}

            {project.project_url && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icons.link className="w-3 h-3" />
                <span className="truncate hover:text-primary transition-colors duration-200">
                  {project.project_url.replace(/^https?:\/\//, "")}
                </span>
              </div>
            )}
          </div>

          {/* Skills Tags */}
          {project.skills && project.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md"
                >
                  {skill}
                </span>
              ))}
              {project.skills.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-md">
                  +{project.skills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer with actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icons.calendar className="w-3 h-3" />
              <span>{new Date(project.publishedAt).getFullYear()}</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs text-primary font-medium">
                View Details
              </span>
              <Icons.arrowRight className="w-3 h-3 text-primary group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
