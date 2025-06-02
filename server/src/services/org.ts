import { db } from "@server/database";
import { org, orgToHost } from "@server/database/schema";
import type * as schema from "@server/database/schema";
import { redirect } from "elysia";

export async function getOrgsByUserId(userId: string) {
  const userOrgs = await db.query.orgToHost.findMany({
    where: (orgToHost, { eq }) =>
      eq(orgToHost.userId, userId),
    with: {
      org: true,
    },
  });
  return userOrgs.map((record) => ({
    ...record.org,
    role: record.role,
  }));
}

export async function getOrgById(id: string) {
  return await db.query.org.findFirst({
    where: (org, { eq }) => eq(org.id, id),
    with: {
      calls: {
        with: {
          callToParticipant: true,
          submissions: {
            columns: { id: true },
          },
        },
      },
    },
  });
}

export async function isUserOrgMember(
  userId: string,
  orgId: string,
) {
  const membership = await db.query.orgToHost.findFirst({
    where: (orgToHost, { and, eq }) =>
      and(
        eq(orgToHost.userId, userId),
        eq(orgToHost.orgId, orgId),
      ),
  });
  return !!membership;
}

type OrgWithCalls = typeof org.$inferSelect & {
  calls: (typeof schema.call.$inferSelect)[];
};

/**
 * Helper function to check if a user is a member of an org
 * This avoids TypeScript issues with Elysia middleware
 */
export async function checkOrgMembership({
  userId,
  orgId,
}: {
  userId: typeof schema.orgToHost.$inferSelect.userId;
  orgId: typeof schema.orgToHost.$inferSelect.orgId;
}) {
  const isMember = await isUserOrgMember(userId, orgId);
  return isMember;
}

export async function createOrg(
  name: string,
  slug: string,
  userId: string,
) {
  const newOrg = await db
    .insert(org)
    .values({ name, slug })
    .returning();
  await db
    .insert(orgToHost)
    .values({ orgId: newOrg[0].id, userId, role: "admin" });

  return redirect(`http://localhost:5173/host/orgs/${slug}`, 302);
}

export async function checkOrgAvailability(slug: string) {
  const existingOrg = await db.query.org.findFirst({
    where: (org, { eq }) => eq(org.slug, slug),
  });
  return !existingOrg;
}
