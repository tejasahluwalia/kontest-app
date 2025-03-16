import { db } from "@server/database";
import {
  contest,
  contestToParticipant,
  submission,
} from "@server/database/schema";

export async function checkContestBelongsToOrganization({
  contestId, 
  organizationId
}: {
  contestId: typeof contest.$inferSelect.id;
  organizationId: typeof contest.$inferSelect.organizationId;
}) {
  const contest = await db.query.contest.findFirst({
    where: (contest, { and, eq }) =>
      and(
        eq(contest.id, contestId),
        eq(contest.organizationId, organizationId),
      ),
  });
  return !!contest;
}


export async function getContestsByOrganizationId(organizationId: string) {
  return await db.query.contest.findMany({
    where: (contest, { eq }) => eq(contest.organizationId, organizationId),
    with: {
      contestToParticipant: true,
      submissions: { columns: { id: true } },
    },
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

export async function getContestBySlug({
  organizationId,
  contestId,
}: {
  organizationId: typeof contest.$inferSelect.organizationId;
  contestId: typeof contest.$inferSelect.id;
}) {
  return await db.query.contest.findFirst({
    where: (contest, { and, eq }) =>
      and(
        eq(contest.organizationId, organizationId),
        eq(contest.id, contestId),
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
  newContestValues: typeof contest.$inferInsert,
) {
  const newContest = await db
    .insert(contest)
    .values(newContestValues)
    .returning();

  return newContest[0];
}

export async function checkContestAvailability(slug: string) {
  const existingContest = await db.query.contest.findFirst({
    where: (contest, { eq }) => eq(contest.slug, slug),
  });
  return !existingContest;
}
