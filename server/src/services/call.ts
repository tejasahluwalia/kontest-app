import { db } from "@server/database";
import {
  call,
  callToParticipant,
  submission,
} from "@server/database/schema";
import { eq } from "drizzle-orm";

export async function checkCallBelongsToOrg({
  callId, 
  orgId
}: {
  callId: typeof call.$inferSelect.id;
  orgId: typeof call.$inferSelect.orgId;
}) {
  const call = await db.query.call.findFirst({
    where: (call, { and, eq }) =>
      and(
        eq(call.id, callId),
        eq(call.orgId, orgId),
      ),
  });
  return !!call;
}


export async function getCallsByOrgId(orgId: string) {
  return await db.query.call.findMany({
    where: (call, { eq }) => eq(call.orgId, orgId),
    with: {
      callToParticipant: true,
      submissions: { columns: { id: true } },
    },
  });
}

export async function getCallsByOrgSlug(slug: string) {
  const org = await db.query.org.findFirst({
    where: (org, { eq }) => eq(org.slug, slug),
  });

  if (!org) {
    return null;
  }

  return await getCallsByOrgId(org.id);
}

export async function getCallBySlug({
  orgId,
  callId,
}: {
  orgId: typeof call.$inferSelect.orgId;
  callId: typeof call.$inferSelect.id;
}) {
  return await db.query.call.findFirst({
    where: (call, { and, eq }) =>
      and(
        eq(call.orgId, orgId),
        eq(call.id, callId),
      ),
    with: {
      callToParticipant: {
        with: {
          user: true,
        },
      },
      submissions: true,
    },
  });
}

export async function createCall(
  newCallValues: typeof call.$inferInsert,
) {
  const newCall = await db
    .insert(call)
    .values(newCallValues)
    .returning();

  return newCall[0];
}

export async function checkCallAvailability(slug: string) {
  const existingCall = await db.query.call.findFirst({
    where: (call, { eq }) => eq(call.slug, slug),
  });
  return !existingCall;
}

export async function updateCall(
  callId: typeof call.$inferSelect.id,
  callValues: typeof call.$inferInsert,
) {
  const updatedCall = await db
    .update(call)
    .set(callValues)
    .where(eq(call.id, callId))
    .returning();
  return updatedCall[0];
}

export async function deleteCall(
  callId: typeof call.$inferSelect.id,
) {
  await db.delete(call).where(eq(call.id, callId));
  return;
}