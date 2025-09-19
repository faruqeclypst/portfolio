import { microCMSClient } from "@/lib/microcms";

// MicroCMS project interface
export interface MicroCMSProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  thumbnail: {
    url: string;
    height: number;
    width: number;
  } | null;
  // New optional additional images gallery
  images?: {
    url: string;
    width: number;
    height: number;
  }[];
  title: string;
  description: string;
  project_url: string;
  skills: string[];
}

interface MicroCMSProjectsResponse {
  contents: MicroCMSProject[];
  totalCount: number;
  offset: number;
  limit: number;
}

/**
 * Fetches projects from MicroCMS with pagination
 */
export async function fetchProjects(page: number = 1, limit: number = 12) {
  try {
    const offset = (page - 1) * limit;

    const response = (await microCMSClient.get({
      endpoint: "project",
      queries: {
        offset,
        limit,
      },
    })) as MicroCMSProjectsResponse;

    return {
      projects: response.contents || [],
      totalCount: response.totalCount || 0,
      currentPage: page,
      totalPages: Math.ceil((response.totalCount || 0) / limit),
      hasNextPage: offset + limit < (response.totalCount || 0),
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return {
      projects: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
}

/**
 * Fetches a single project by ID from MicroCMS
 */
export async function fetchProject(
  id: string
): Promise<MicroCMSProject | null> {
  try {
    const response = (await microCMSClient.get({
      endpoint: "project",
      contentId: id,
    })) as MicroCMSProject;

    return response;
  } catch (error) {
    console.error(`Failed to fetch project with ID ${id}:`, error);
    return null;
  }
}
