import { describe, expect, it } from "bun:test";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db, model, schema } from "../index";

describe("@kontest/db Model & Schema Definitions", () => {
	it("exports all table definitions and model keys", () => {
		expect(schema.user).toBeDefined();
		expect(schema.org).toBeDefined();
		expect(schema.call).toBeDefined();
		expect(schema.round).toBeDefined();
		expect(schema.submission).toBeDefined();
		expect(schema.judgement).toBeDefined();

		expect(model.insert.user).toBeDefined();
		expect(model.insert.org).toBeDefined();
		expect(model.select.user).toBeDefined();
		expect(model.update.user).toBeDefined();
	});
});

describe("@kontest/db Isolated CRUD & Relational Lifecycle", () => {
	const testId = nanoid(8);
	const testEmail = `test_runner_${testId}@kontest.dev`;
	const testOrgSlug = `test-org-${testId}`;
	const testCallSlug = `test-call-${testId}`;
	const testRoundSlug = `test-round-${testId}`;

	let createdUserId: string;
	let createdOrgId: string;
	let createdCallId: string;
	let createdRoundId: string;

	it("inserts and reads isolated user and org entities", async () => {
		createdUserId = `usr_${nanoid()}`;
		const [insertedUser] = await db
			.insert(schema.user)
			.values({
				id: createdUserId,
				name: `Runner ${testId}`,
				email: testEmail,
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		expect(insertedUser).toBeDefined();
		expect(insertedUser.email).toBe(testEmail);

		const [insertedOrg] = await db
			.insert(schema.org)
			.values({
				name: `Test Org ${testId}`,
				slug: testOrgSlug,
			})
			.returning();

		expect(insertedOrg).toBeDefined();
		createdOrgId = insertedOrg.id;
		expect(insertedOrg.slug).toBe(testOrgSlug);
	});

	it("enforces database unique constraint on organization slug", async () => {
		let duplicateError: Error | null = null;
		try {
			await db.insert(schema.org).values({
				name: `Duplicate Org ${testId}`,
				slug: testOrgSlug, // Already inserted in previous test
			});
		} catch (err) {
			duplicateError = err instanceof Error ? err : new Error(String(err));
		}

		expect(duplicateError).not.toBeNull();
		const cause =
			duplicateError &&
			"cause" in duplicateError &&
			typeof duplicateError.cause === "object" &&
			duplicateError.cause !== null &&
			"message" in duplicateError.cause
				? String((duplicateError.cause as { message?: string }).message || "")
				: "";
		const errStr = `${duplicateError?.message || ""} ${cause}`;
		expect(errStr.toLowerCase()).toMatch(/unique|duplicate/);
	});

	it("creates relational hierarchy: member -> call -> round with schemas", async () => {
		// 1. Add user as admin member of org
		const [createdMember] = await db
			.insert(schema.member)
			.values({
				orgId: createdOrgId,
				userId: createdUserId,
				role: "admin",
			})
			.returning();

		expect(createdMember).toBeDefined();
		expect(createdMember.orgId).toBe(createdOrgId);
		expect(createdMember.userId).toBe(createdUserId);

		// 2. Create a call under the org
		const [createdCall] = await db
			.insert(schema.call)
			.values({
				orgId: createdOrgId,
				name: `Test Call ${testId}`,
				slug: testCallSlug,
				metadata: { description: "Automated test call description" },
				visibility: "public",
			})
			.returning();

		expect(createdCall).toBeDefined();
		createdCallId = createdCall.id;

		// 3. Create a round with formSchema and judgingSchema
		const formSchema = {
			blocks: [{ id: "b1", type: "text", label: "Project Name" }],
		};
		const judgingSchema = {
			rubrics: [{ id: "r1", name: "Impact", weight: 1.0, maxScore: 10 }],
		};

		const [createdRound] = await db
			.insert(schema.round)
			.values({
				callId: createdCallId,
				name: "Preliminary Round",
				slug: testRoundSlug,
				startDate: new Date(),
				endDate: new Date(Date.now() + 86400000),
				formSchema,
				judgingSchema,
			})
			.returning();

		expect(createdRound).toBeDefined();
		createdRoundId = createdRound.id;
		expect(createdRound.formSchema).toEqual(formSchema);
		expect(createdRound.judgingSchema).toEqual(judgingSchema);
	});

	it("executes deep relational query across org, members, calls, and rounds", async () => {
		const fetchedOrg = await db.query.org.findFirst({
			where: { id: createdOrgId },
			with: {
				members: {
					with: {
						user: true,
					},
				},
				calls: {
					with: {
						rounds: true,
					},
				},
			},
		});

		expect(fetchedOrg).toBeDefined();
		expect(fetchedOrg?.slug).toBe(testOrgSlug);
		expect(fetchedOrg?.members.length).toBe(1);
		expect(fetchedOrg?.members[0].user.email).toBe(testEmail);
		expect(fetchedOrg?.calls.length).toBe(1);
		expect(fetchedOrg?.calls[0].slug).toBe(testCallSlug);
		expect(fetchedOrg?.calls[0].rounds.length).toBe(1);
		expect(fetchedOrg?.calls[0].rounds[0].id).toBe(createdRoundId);
	});

	it("cleans up test entities cleanly without leaving artifacts", async () => {
		// Clean up created round -> call -> member -> org -> user
		await db.delete(schema.round).where(eq(schema.round.id, createdRoundId));
		await db.delete(schema.call).where(eq(schema.call.id, createdCallId));
		await db.delete(schema.member).where(eq(schema.member.orgId, createdOrgId));
		await db.delete(schema.org).where(eq(schema.org.id, createdOrgId));
		await db.delete(schema.user).where(eq(schema.user.id, createdUserId));

		// Verify deletion
		const deletedOrg = await db.query.org.findFirst({
			where: { id: createdOrgId },
		});
		expect(deletedOrg).toBeUndefined();

		const deletedUser = await db.query.user.findFirst({
			where: { id: createdUserId },
		});
		expect(deletedUser).toBeUndefined();
	});
});
