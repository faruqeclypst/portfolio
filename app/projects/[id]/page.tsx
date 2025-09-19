import { FadeIn } from "@/components/atoms/fade-in";
import { OptimizedImage } from "@/components/atoms/optimized-image";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { siteConfig } from "@/constants";
import { fetchProject, MicroCMSProject } from "@/actions/projects";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, Globe } from "lucide-react";

// Add revalidation to cache API responses
export const revalidate = 3600; // Revalidate every hour

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  try {
    const project = await fetchProject(projectId);

    if (!project) {
      return {
        title: `Project Not Found | ${siteConfig.name}`,
        description: "The requested project could not be found.",
      };
    }

    // Strip HTML from description for meta
    const plainDescription = project.description.replace(/<[^>]*>/g, "");

    return {
      title: `${project.title} | Projects | ${siteConfig.name}`,
      description: plainDescription.substring(0, 160),
      openGraph: {
        title: project.title,
        description: plainDescription.substring(0, 160),
        images: project.thumbnail?.url
          ? [
              {
                url: project.thumbnail.url,
                width: project.thumbnail.width,
                height: project.thumbnail.height,
                alt: project.title,
              },
            ]
          : [],
      },
    };
  } catch {
    return {
      title: `Project Not Found | ${siteConfig.name}`,
      description: "The requested project could not be found.",
    };
  }
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const project = await fetchProject(projectId);

  if (!project) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="overflow-y-auto relative h-full pb-10">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Back Navigation */}
        <FadeIn>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </FadeIn>

        {/* Project Header */}
        <FadeIn>
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {project.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    {/* <Calendar className="w-4 h-4" /> */}
                    <span>{formatDate(project.publishedAt)}</span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span className="text-green-600 dark:text-green-400">
                      Live Project
                    </span>
                  </div> */}
                </div>

                {/* Skills */}
                {project.skills && project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                    {project.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted rounded-md text-xs font-medium text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons (moves below on small screens) */}
              {project.project_url && (
                <div className="flex items-center gap-2 flex-wrap md:ml-4">
                  <Button size="sm" asChild>
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Source / Project / Learning
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Project Image */}
        {project.thumbnail && (
          <FadeIn>
            <div className="mb-8 rounded-lg overflow-hidden border bg-muted">
              <OptimizedImage
                src={project.thumbnail.url}
                alt={project.title}
                width={project.thumbnail.width}
                height={project.thumbnail.height}
                className="w-full h-auto"
                priority
              />
            </div>
          </FadeIn>
        )}

        <Separator className="my-8" />

        {/* Project Description */}
        <FadeIn>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-xl font-bold text-foreground mb-6 pb-2 border-b border-border">
              About this
            </h2>
            <div
              className="
                text-foreground leading-7 
                prose-headings:text-foreground prose-headings:font-semibold prose-headings:mb-4 prose-headings:mt-6
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base
                prose-p:mb-4 prose-p:text-muted-foreground prose-p:leading-7
                prose-strong:text-foreground prose-strong:font-semibold
                prose-em:text-foreground prose-em:italic
                prose-ul:mb-4 prose-ul:pl-6 prose-li:mb-2 prose-li:text-muted-foreground
                prose-ol:mb-4 prose-ol:pl-6 prose-li:marker:text-muted-foreground
                prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:rounded-r
                prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-foreground
                prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2 hover:prose-a:decoration-blue-500
                prose-img:rounded-lg prose-img:border prose-img:border-border prose-img:shadow-sm
                prose-hr:border-border prose-hr:my-8
                prose-table:border-collapse prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:overflow-hidden
                prose-th:bg-muted prose-th:font-semibold prose-th:text-foreground prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2
                prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2 prose-td:text-muted-foreground
              "
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>
        </FadeIn>

        {/* Project Details */}
        <FadeIn>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">
                Details Post
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="text-green-600 dark:text-green-400">
                    Published
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-foreground">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published:</span>
                  <span className="text-foreground">
                    {formatDate(project.publishedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="text-foreground">
                    {formatDate(project.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">Links</h3>
              <div className="space-y-2">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Source / Project / Learning
                  </a>
                )}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Navigation to Other Projects */}
        <Separator className="my-8" />
        <FadeIn>
          <div className="text-center">
            <Link href="/projects">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                View All Projects
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
