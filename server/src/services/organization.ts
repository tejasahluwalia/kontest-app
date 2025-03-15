import { db } from "@server/database";
import { organization, organizationToHost } from "@server/database/schema";
import { model } from "@server/database/model";
import * as schema from "@server/database/schema";
import { redirect } from "elysia";

const { insert, select } = model;

export async function getOrganizationsByUserId(userId: string) {
  const userOrganizations = await db.query.organizationToHost.findMany({
    where: (organizationToHost, { eq }) =>
      eq(organizationToHost.userId, userId),
    with: {
      organization: true,
    },
  });
  return userOrganizations.map((record) => ({
    ...record.organization,
    role: record.role,
  }));
}

export async function getOrganizationBySlug(slug: string) {
  return await db.query.organization.findFirst({
    where: (organization, { eq }) => eq(organization.slug, slug),
    with: {
      contests: true,
    },
  });
}

export async function isUserOrganizationMember(userId: string, organizationId: string) {
  const membership = await db.query.organizationToHost.findFirst({
    where: (organizationToHost, { and, eq }) => 
      and(
        eq(organizationToHost.userId, userId),
        eq(organizationToHost.organizationId, organizationId)
      ),
  });
  return !!membership;
}


type OrganizationWithContests = typeof schema.organization.$inferSelect & {
  contests: typeof schema.contest.$inferSelect[];
};

/**
 * Helper function to check if a user is a member of an organization
 * This avoids TypeScript issues with Elysia middleware
 */
export async function checkOrganizationMembership(userId: string, organizationSlug: string): Promise<
  | { success: false; status: number; error?: string; }
  | { success: true; status: number; error?: string; organization:  OrganizationWithContests}
> {
  const organization = await getOrganizationBySlug(organizationSlug);
  if (!organization) {
    return { success: false, status: 404, error: "Organization not found" };
  }

  const isMember = await isUserOrganizationMember(userId, organization.id);
  if (!isMember) {
    return { success: false, status: 403, error: "Forbidden: You are not a member of this organization" };
  }

  return { success: true, status: 200, organization };
}

export async function createOrganization(
  name: string,
  slug: string,
  userId: string,
) {
  const newOrganization = await db
    .insert(organization)
    .values({ name, slug })
    .returning();
  await db
    .insert(organizationToHost)
    .values({ organizationId: newOrganization[0].id, userId, role: "admin" });

  return redirect("http://localhost:5173/host/organizations/" + slug, 302);
}

export async function checkOrganizationAvailability(slug: string) {
  const existingOrganization = await db.query.organization.findFirst({
    where: (organization, { eq }) => eq(organization.slug, slug),
  });
  return !existingOrganization;
}
