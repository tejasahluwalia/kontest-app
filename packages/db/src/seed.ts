import { db, schema } from "./index";

export async function seed() {
	console.log("🌱 Starting Kontest Database Seed...");

	const now = new Date();
	const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
	const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

	// 1. Seed Users
	console.log("  → Seeding Users...");
	const usersData = [
		{
			id: "usr_host_admin_01",
			name: "Host Admin",
			email: "host@kontest.dev",
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "usr_juror_chief_01",
			name: "Chief Juror",
			email: "juror@kontest.dev",
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "usr_alice_dev_01",
			name: "Alice Developer",
			email: "alice@kontest.dev",
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "usr_bob_builder_01",
			name: "Bob Builder",
			email: "bob@kontest.dev",
			emailVerified: true,
			image: null,
			createdAt: now,
			updatedAt: now,
		},
	];

	for (const u of usersData) {
		await db
			.insert(schema.user)
			.values(u)
			.onConflictDoUpdate({
				target: schema.user.id,
				set: {
					name: u.name,
					email: u.email,
					emailVerified: u.emailVerified,
					updatedAt: now,
				},
			});
	}

	// 2. Seed Organizations
	console.log("  → Seeding Organizations...");
	const orgsData = [
		{
			id: "org_acme_innovations",
			name: "Acme Innovations",
			slug: "acme-innovations",
			metadata: {
				website: "https://acme.example.com",
				description: "Next-generation software & AI innovation challenges.",
				logo: "/assets/acme-logo.svg",
			},
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "org_open_grants",
			name: "Open Grants DAO",
			slug: "open-grants",
			metadata: {
				website: "https://opengrants.example.org",
				description: "Funding open source public goods and open research.",
				logo: "/assets/opengrants-logo.svg",
			},
			createdAt: now,
			updatedAt: now,
		},
	];

	for (const o of orgsData) {
		await db
			.insert(schema.org)
			.values(o)
			.onConflictDoUpdate({
				target: schema.org.id,
				set: {
					name: o.name,
					slug: o.slug,
					metadata: o.metadata,
					updatedAt: now,
				},
			});
	}

	// 3. Seed Members
	console.log("  → Seeding Org Members...");
	const membersData = [
		{
			id: "mem_host_acme",
			userId: "usr_host_admin_01",
			orgId: "org_acme_innovations",
			role: "admin" as const,
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "mem_host_opengrants",
			userId: "usr_host_admin_01",
			orgId: "org_open_grants",
			role: "admin" as const,
			createdAt: now,
			updatedAt: now,
		},
	];

	for (const m of membersData) {
		await db
			.insert(schema.member)
			.values(m)
			.onConflictDoUpdate({
				target: schema.member.id,
				set: {
					role: m.role,
					updatedAt: now,
				},
			});
	}

	// 4. Seed Calls (Competitions / Grants)
	console.log("  → Seeding Calls...");
	const callsData = [
		{
			id: "call_global_ai_2026",
			name: "Global AI Hackathon 2026",
			slug: "global-ai-hackathon-2026",
			orgId: "org_acme_innovations",
			visibility: "public" as const,
			metadata: {
				summary: "Build autonomous AI agents and intelligent developer tools.",
				prizePool: "$100,000 USD",
				bannerImage: "/assets/banners/ai-hackathon.jpg",
				rules: "Open to all developers worldwide.",
			},
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "call_oss_grant_wave3",
			name: "Open Source Grant Wave 3",
			slug: "open-source-grant-wave-3",
			orgId: "org_open_grants",
			visibility: "public" as const,
			metadata: {
				summary:
					"Micro-grants for maintainers of essential open-source libraries.",
				prizePool: "$50,000 USD",
				bannerImage: "/assets/banners/oss-grant.jpg",
			},
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "call_private_pitch",
			name: "Private Investor Pitch Round",
			slug: "private-investor-pitch",
			orgId: "org_acme_innovations",
			visibility: "private" as const,
			metadata: {
				summary: "Invitation-only cohort pitch round for seed stage startups.",
			},
			createdAt: now,
			updatedAt: now,
		},
	];

	for (const c of callsData) {
		await db
			.insert(schema.call)
			.values(c)
			.onConflictDoUpdate({
				target: schema.call.id,
				set: {
					name: c.name,
					slug: c.slug,
					visibility: c.visibility,
					metadata: c.metadata,
					updatedAt: now,
				},
			});
	}

	// 5. Link Call to Member
	console.log("  → Linking Calls to Members...");
	const callToMemberData = [
		{
			callId: "call_global_ai_2026",
			memberId: "mem_host_acme",
			role: "admin" as const,
		},
		{
			callId: "call_oss_grant_wave3",
			memberId: "mem_host_opengrants",
			role: "admin" as const,
		},
		{
			callId: "call_private_pitch",
			memberId: "mem_host_acme",
			role: "admin" as const,
		},
	];

	for (const ctm of callToMemberData) {
		await db.insert(schema.callToMember).values(ctm).onConflictDoNothing();
	}

	// 6. Seed Rounds
	console.log("  → Seeding Rounds...");
	const roundsData = [
		{
			id: "rnd_ai_qualifiers",
			name: "Round 1: Idea & Prototype Submission",
			slug: "ai-qualifiers-2026",
			callId: "call_global_ai_2026",
			formSchema: {
				fields: [
					{
						id: "project_name",
						type: "text",
						label: "Project Name",
						required: true,
					},
					{
						id: "repo_url",
						type: "url",
						label: "GitHub Repository URL",
						required: true,
					},
					{
						id: "demo_video",
						type: "url",
						label: "Video Demo Link",
						required: false,
					},
					{
						id: "description",
						type: "textarea",
						label: "Architecture & Problem Statement",
						required: true,
					},
				],
			},
			judgingSchema: {
				rubrics: [
					{
						id: "innovation",
						name: "Innovation & Originality",
						weight: 30,
						maxScore: 10,
					},
					{
						id: "execution",
						name: "Technical Execution & Polish",
						weight: 40,
						maxScore: 10,
					},
					{
						id: "utility",
						name: "Practical Impact & Usability",
						weight: 30,
						maxScore: 10,
					},
				],
			},
			startDate: now,
			endDate: nextWeek,
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "rnd_ai_finals",
			name: "Round 2: Live Demo & Final Judging",
			slug: "ai-finals-2026",
			callId: "call_global_ai_2026",
			formSchema: {
				fields: [
					{
						id: "live_url",
						type: "url",
						label: "Production Deployment URL",
						required: true,
					},
					{
						id: "pitch_deck",
						type: "file",
						label: "Pitch Deck PDF",
						required: true,
					},
				],
			},
			judgingSchema: {
				rubrics: [
					{
						id: "overall_impact",
						name: "Overall System Performance & Impact",
						weight: 50,
						maxScore: 10,
					},
					{
						id: "presentation",
						name: "Presentation & Clarity",
						weight: 50,
						maxScore: 10,
					},
				],
			},
			startDate: nextWeek,
			endDate: nextMonth,
			createdAt: now,
			updatedAt: now,
		},
	];

	for (const r of roundsData) {
		await db
			.insert(schema.round)
			.values(r)
			.onConflictDoUpdate({
				target: schema.round.id,
				set: {
					name: r.name,
					slug: r.slug,
					formSchema: r.formSchema,
					judgingSchema: r.judgingSchema,
					startDate: r.startDate,
					endDate: r.endDate,
					updatedAt: now,
				},
			});
	}

	// 7. Seed Jurors
	console.log("  → Seeding Jurors...");
	const jurorsData = [
		{
			id: "jur_chief_qualifiers",
			userId: "usr_juror_chief_01",
			roundId: "rnd_ai_qualifiers",
			createdAt: now,
		},
		{
			id: "jur_chief_finals",
			userId: "usr_juror_chief_01",
			roundId: "rnd_ai_finals",
			createdAt: now,
		},
	];

	for (const j of jurorsData) {
		await db.insert(schema.juror).values(j).onConflictDoNothing();
	}

	// 8. Seed Participants
	console.log("  → Seeding Participants...");
	const participantsData = [
		{
			id: "part_alice_ai",
			userId: "usr_alice_dev_01",
			callId: "call_global_ai_2026",
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "part_bob_ai",
			userId: "usr_bob_builder_01",
			callId: "call_global_ai_2026",
			createdAt: now,
			updatedAt: now,
		},
	];

	for (const p of participantsData) {
		await db.insert(schema.participant).values(p).onConflictDoNothing();
	}

	// 9. Seed Submissions
	console.log("  → Seeding Submissions...");
	const submissionsData = [
		{
			id: "sub_alice_project_neuroflow",
			roundId: "rnd_ai_qualifiers",
			participantId: "part_alice_ai",
			data: {
				project_name: "NeuroFlow Agent",
				repo_url: "https://github.com/alice/neuroflow",
				demo_video: "https://youtube.com/watch?v=sample123",
				description:
					"An autonomous agent system for distributed neural architecture search and continuous model fine-tuning.",
			},
			createdAt: now,
			updatedAt: now,
		},
		{
			id: "sub_bob_project_synthgrid",
			roundId: "rnd_ai_qualifiers",
			participantId: "part_bob_ai",
			data: {
				project_name: "SynthGrid UI",
				repo_url: "https://github.com/bob/synthgrid",
				demo_video: "https://youtube.com/watch?v=sample456",
				description:
					"A zero-overhead canvas rendering engine for real-time AI node graphs.",
			},
			createdAt: now,
			updatedAt: now,
		},
	];

	for (const s of submissionsData) {
		await db
			.insert(schema.submission)
			.values(s)
			.onConflictDoUpdate({
				target: schema.submission.id,
				set: {
					data: s.data,
					updatedAt: now,
				},
			});
	}

	// 10. Seed Judgements
	console.log("  → Seeding Judgements...");
	const judgementsData = [
		{
			id: "judg_chief_alice_sub",
			submissionId: "sub_alice_project_neuroflow",
			jurorId: "jur_chief_qualifiers",
			data: {
				scores: {
					innovation: 9,
					execution: 9,
					utility: 8,
				},
				feedback:
					"Exceptional architecture with great test coverage and clear execution.",
			},
			createdAt: now,
		},
	];

	for (const j of judgementsData) {
		await db
			.insert(schema.judgement)
			.values(j)
			.onConflictDoUpdate({
				target: schema.judgement.id,
				set: {
					data: j.data,
				},
			});
	}

	// 11. Seed Invites
	console.log("  → Seeding Sample Invites...");
	const memberInvitesData = [
		{
			id: "inv_mem_sample_01",
			email: "collaborator@kontest.dev",
			orgId: "org_acme_innovations",
			role: "member" as const,
			status: "pending" as const,
			invitedBy: "mem_host_acme",
			createdAt: now,
		},
	];

	for (const mi of memberInvitesData) {
		await db.insert(schema.memberInvite).values(mi).onConflictDoNothing();
	}

	console.log("✅ Kontest Database Seed completed successfully!");
}

// Allow direct CLI execution: `bun packages/db/src/seed.ts`
if (import.meta.main) {
	seed()
		.then(() => {
			process.exit(0);
		})
		.catch((err) => {
			console.error("❌ Error during database seeding:", err);
			process.exit(1);
		});
}
