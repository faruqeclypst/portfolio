import { FadeIn } from "@/components/atoms/fade-in";
import MicroCMSProjectCard from "@/components/molecules/project-card";
import { siteConfig } from "@/constants";
import { fetchProjects } from "@/actions/projects";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/atoms/skeleton";
import Pagination from "@/components/molecules/pagination";
import { Separator } from "@/components/atoms/separator";

// Add revalidation to cache API responses in development
export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Projects | " + siteConfig.name,
  description: "A collection of projects that I have worked on.",
};

interface ProjectsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const limit = Number(resolvedSearchParams?.pageSize) || 12;

  // Fetch projects from MicroCMS
  const projectsData = await fetchProjects(page, limit);

  return (
    <section className="overflow-y-auto relative h-full pb-10">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-base font-bold text-foreground mb-1">Projects</h1>
          <p className="text-muted-foreground text-xs">
            A collection of {projectsData.totalCount} projects that I have
            worked on.
          </p>
        </div>

        {/* Projects Grid */}
        {projectsData.projects.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projectsData.projects.map((project) => (
                <FadeIn key={`Project-${project.id}`}>
                  <Suspense
                    fallback={
                      <Skeleton className="w-full h-64 sm:h-72 lg:h-80" />
                    }
                  >
                    <MicroCMSProjectCard project={project} />
                  </Suspense>
                </FadeIn>
              ))}
            </div>

            {/* Pagination */}
            {projectsData.totalPages > 1 && (
              <>
                <Separator className="my-8" />
                <Pagination
                  page={projectsData.currentPage}
                  pageSize={limit}
                  totalPages={projectsData.totalPages}
                />
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground">
                Unable to fetch projects at the moment. Please try again later.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
