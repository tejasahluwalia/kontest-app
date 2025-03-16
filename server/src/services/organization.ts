import { db } from "@server/database";
import { organization, organizationToHost } from "@server/database/schema";
import type * as schema from "@server/database/schema";
import { redirect } from "elysia";

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

export async function getOrganizationById(id: string) {
  return await db.query.organization.findFirst({
    where: (organization, { eq }) => eq(organization.id, id),
    with: {
      contests: {
        with: {
          contestToParticipant: true,
          submissions: {
            columns: { id: true },
          },
        },
      },
    },
  });
}

export async function isUserOrganizationMember(
  userId: string,
  organizationId: string,
) {
  const membership = await db.query.organizationToHost.findFirst({
    where: (organizationToHost, { and, eq }) =>
      and(
        eq(organizationToHost.userId, userId),
        eq(organizationToHost.organizationId, organizationId),
      ),
  });
  return !!membership;
}

type OrganizationWithContests = typeof organization.$inferSelect & {
  contests: (typeof schema.contest.$inferSelect)[];
};

/**
 * Helper function to check if a user is a member of an organization
 * This avoids TypeScript issues with Elysia middleware
 */
export async function checkOrganizationMembership({
  userId,
  organizationId,
}: {
  userId: typeof schema.organizationToHost.$inferSelect.userId;
  organizationId: typeof schema.organizationToHost.$inferSelect.organizationId;
}) {
  const isMember = await isUserOrganizationMember(userId, organizationId);
  return isMember;
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

  return redirect(`http://localhost:5173/host/organizations/${slug}`, 302);
}

export async function checkOrganizationAvailability(slug: string) {
  const existingOrganization = await db.query.organization.findFirst({
    where: (organization, { eq }) => eq(organization.slug, slug),
  });
  return !existingOrganization;
}
