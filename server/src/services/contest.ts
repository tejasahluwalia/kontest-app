import { db } from "@server/database";
import { contest, contestToParticipant, submission } from "@server/database/schema";
import { model } from "@server/database/model";
import { eq } from "drizzle-orm";

const { insert, select } = model;

export async function getContestsByOrganizationId(organizationId: string) {
  return await db.query.contest.findMany({
    where: (contest, { eq }) => eq(contest.organizationId, organizationId),
  });
}

export async function getContestsByOrganizationSlug(slug: string) {
  const organization = await db.query.organization.findFirst({
    where: (organization, { eq }) => eq(organization.slug, slug),
  });

  if (!organization) {
    return null;
  }

  return await getContestsByOrganizationId(organization.id);
}

export async function getContestBySlug(organizationId: string, contestSlug: string) {
  return await db.query.contest.findFirst({
    where: (contest, { and, eq }) => 
      and(
        eq(contest.organizationId, organizationId),
        eq(contest.slug, contestSlug)
      ),
    with: {
      contestToParticipant: {
        with: {
          user: true,
        },
      },
      submissions: true,
    },
  });
}

export async function createContest(
  name: string,
  slug: string,
  organizationId: string,
  schema?: any,
) {
  const newContest = await db
    .insert(contest)
    .values({ 
      name, 
      slug, 
      organizationId,
      schema: schema ? schema : null,
    })
    .returning();
  
  return newContest[0];
}

export async function checkContestAvailability(slug: string) {
  const existingContest = await db.query.contest.findFirst({
    where: (contest, { eq }) => eq(contest.slug, slug),
  });
  return !existingContest;
}
