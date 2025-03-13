import { db } from "@server/database";
import { organization, organizationToHost } from "@server/database/schema";
import { model } from "@server/database/model";

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
  return newOrganization[0].id;
}

export async function checkOrganizationAvailability(slug: string) {
  const existingOrganization = await db.query.organization.findFirst({
    where: (organization, { eq }) => eq(organization.slug, slug),
  });
  return !existingOrganization;
}
