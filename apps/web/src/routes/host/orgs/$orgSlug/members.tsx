import { createForm } from "@tanstack/solid-form";
import { queryOptions, useMutation, useQuery } from "@tanstack/solid-query";
import EllipsisIcon from "lucide-solid/icons/ellipsis";
import type * as schema from "packages/database/schema";
import { createMemo, createSignal } from "solid-js";
import z from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectErrorMessage,
	SelectItem,
	SelectLabel,
	SelectPortal,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Tabs,
	TabsContent,
	TabsIndicator,
	TabsList,
	TabsTrigger,
} from "~/components/ui/tabs";
import {
	TextField,
	TextFieldErrorMessage,
	TextFieldInput,
	TextFieldLabel,
} from "~/components/ui/text-field";
import server from "~/lib/server-api";

const fetchMembers = async (orgId: string) => {
	const { data, error } = await server.api.host.orgs({ orgId }).members.get();

	if (error)
		switch (error.status) {
			case 422:
				// Error type will be narrow down
				throw error.value;

			default:
				throw error.value;
		}

	return { members: data };
};

const fetchMembersQueryOptions = (orgId: string) =>
	queryOptions({
		queryKey: ["members", { orgId }],
		queryFn: () => fetchMembers(orgId),
	});

const fetchInvites = async (orgId: string) => {
	const { data, error } = await server.api.host
		.orgs({ orgId })
		.members.invites.get();

	if (error)
		switch (error.status) {
			case 422:
				// Error type will be narrow down
				throw error.value;

			default:
				throw error.value;
		}

	return { invites: data };
};

const fetchInvitesQueryOptions = (orgId: string) =>
	queryOptions({
		queryKey: ["invites", { orgId }],
		queryFn: () => fetchInvites(orgId),
	});

export const Route = createFileRoute({
	component: RouteComponent,
	loader: async ({ context: { auth, queryClient, member } }) => {
		queryClient.ensureQueryData(fetchMembersQueryOptions(member.org.id));
		queryClient.ensureQueryData(fetchInvitesQueryOptions(member.org.id));
		return {
			currUser: auth.user,
			orgId: member.org.id,
		};
	},
});

function RouteComponent() {
	const { currUser, orgId } = Route.useLoaderData()();
	const { queryClient } = Route.useRouteContext()();

	const membersQuery = useQuery(() => fetchMembersQueryOptions(orgId));
	const members = createMemo(() => {
		if (membersQuery.data) {
			return membersQuery.data.members;
		} else {
			return [];
		}
	});

	const invitesQuery = useQuery(() => fetchInvitesQueryOptions(orgId));
	const invites = createMemo(() => {
		if (invitesQuery.data) {
			return invitesQuery.data.invites;
		} else {
			return [];
		}
	});

	const cancelInviteMutation = useMutation(() => ({
		mutationFn: async ({ inviteId }: { inviteId: string }) => {
			await server.api.host
				.orgs({ orgId })
				.members.invites({ inviteId })
				.delete();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["invites"] });
		},
	}));

	const deleteMemberMutation = useMutation(() => ({
		mutationFn: async ({
			memberId,
		}: {
			memberId: typeof schema.member.$inferSelect.id;
		}) => {
			await server.api.host.orgs({ orgId }).members({ memberId }).delete();
		},
		onSuccess: (_, { memberId }) => {
			queryClient.invalidateQueries({ queryKey: ["members"] });
		},
	}));

	const changeMemberRoleMutation = useMutation(() => ({
		mutationFn: async ({
			memberId,
			newRole,
		}: {
			memberId: typeof schema.member.$inferSelect.id;
			newRole: typeof schema.member.$inferSelect.role;
		}) => {
			await server.api.host
				.orgs({ orgId })
				.members({ memberId })
				.patch({ role: newRole });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["members"] });
		},
	}));

	function handleDeleteMember(memberId: typeof schema.member.$inferSelect.id) {
		deleteMemberMutation.mutate({ memberId });
	}

	function handleChangeMemberRole(
		memberId: typeof schema.member.$inferSelect.id,
		newRole: typeof schema.member.$inferSelect.role,
	) {
		changeMemberRoleMutation.mutate({ memberId, newRole });
	}

	async function handleCancelInvite(inviteId: string) {
		cancelInviteMutation.mutate({ inviteId });
	}

	function displayRole(role: string) {
		return role === "admin" ? "Admin" : "Member";
	}

	return (
		<div>
			<div class="mb-6 flex items-end justify-between w-full">
				<h1 class="scroll-m-20 text-2xl font-semibold tracking-tight">
					Organization members
				</h1>
				<AddMemberDialog orgId={orgId} />
			</div>
			<div>
				<Tabs>
					<TabsList>
						<TabsTrigger value="team-members">Team members</TabsTrigger>
						<TabsTrigger value="pending-invites">Pending invites</TabsTrigger>
						<TabsIndicator />
					</TabsList>
					<TabsContent value="team-members" class="flex-col space-y-2">
						<ul>
							{members().map((member) => (
								<li>
									<Card>
										<CardContent class="flex justify-between">
											<div class="flex items-center space-x-2">
												<div class="flex flex-col space-y-2">
													<span class="max-w-[128px] truncate text-sm leading-none font-medium">
														{member.user.name}
													</span>
													<span class="max-w-[128px] truncate text-sm leading-none font-medium text-muted-foreground">
														{member.user.email}
													</span>
												</div>
											</div>
											<div class="flex space-x-2 items-center">
												<span class="text-muted-foreground text-sm">
													{displayRole(member.role)}
												</span>
												<DropdownMenu>
													<DropdownMenuTrigger<typeof Button>
														as={(props) => (
															<Button
																{...props}
																variant="ghost"
																size="icon"
																class="size-8"
															>
																<EllipsisIcon size={18} />
															</Button>
														)}
													/>
													<DropdownMenuPortal>
														<DropdownMenuContent>
															<DropdownMenuItem
																onClick={() => handleDeleteMember(member.id)}
															>
																<span class="text-xs text-destructive">
																	{member.user.id === currUser.id
																		? "Leave"
																		: "Remove user"}
																</span>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenuPortal>
												</DropdownMenu>
											</div>
										</CardContent>
									</Card>
								</li>
							))}
						</ul>
					</TabsContent>
					<TabsContent value="pending-invites" class="flex-col space-y-2">
						{invites().map((invite) => (
							<Card>
								<CardContent class="flex justify-between">
									<div class="flex items-center space-x-2">
										<div class="flex flex-col space-y-2">
											<span class="max-w-[128px] truncate text-sm leading-none font-medium">
												{invite.email}
											</span>
											<span class="max-w-[128px] truncate text-sm leading-none font-medium text-muted-foreground">
												{new Date(invite.createdAt).toLocaleDateString("en", {
													day: "numeric",
													month: "long",
													year: "numeric",
												})}
											</span>
										</div>
									</div>
									<div class="flex items-center space-x-2">
										<span class="text-muted-foreground text-sm">
											{displayRole(invite.role)}
										</span>
										<DropdownMenu>
											<DropdownMenuTrigger<typeof Button>
												as={(props) => (
													<Button
														variant="ghost"
														{...props}
														size="icon"
														class="size-8"
													>
														<EllipsisIcon size={18} />
													</Button>
												)}
											/>
											<DropdownMenuPortal>
												<DropdownMenuContent>
													<DropdownMenuItem
														onClick={() => handleCancelInvite(invite.id)}
													>
														<span class="text-xs text-destructive">
															Cancel invite
														</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenuPortal>
										</DropdownMenu>
									</div>
								</CardContent>
							</Card>
						))}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

function AddMemberDialog(props: {
	orgId: typeof schema.memberInvite.$inferSelect.orgId;
}) {
	const [dialogOpen, setDialogOpen] = createSignal(false);
	const { queryClient } = Route.useRouteContext()();

	const createInviteMutation = useMutation(() => ({
		mutationFn: (newInvite: {
			email: typeof schema.memberInvite.$inferInsert.email;
			role: typeof schema.memberInvite.$inferInsert.role;
		}) =>
			server.api.host.orgs({ orgId: props.orgId }).members.invites.post({
				...newInvite,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["invites"] });
		},
	}));
	const createInvite = createInviteMutation.mutate;

	const form = createForm(() => ({
		defaultValues: {
			email: "",
			role: "member" as "member" | "admin" | null,
		},
		onSubmit: async ({ value }) => {
			createInvite({
				email: value.email,
				role: value.role || "member",
			});
			setDialogOpen(false);
		},
	}));

	return (
		<Dialog open={dialogOpen()} onOpenChange={setDialogOpen}>
			<DialogTrigger>
				<Button>Add member</Button>
			</DialogTrigger>
			<DialogPortal>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add a new member to your organization</DialogTitle>
					</DialogHeader>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						<div class="grid gap-4 my-4">
							<form.Field
								name="email"
								validators={{
									onChange: z.string().email(),
								}}
							>
								{(field) => (
									<div>
										<TextField
											id={field().name}
											name={field().name}
											required
											validationState={
												field().state.meta.isValid ? "valid" : "invalid"
											}
											onChange={(e) => field().handleChange(e)}
											onBlur={field().handleBlur}
											value={field().state.value}
										>
											<TextFieldLabel>Email</TextFieldLabel>
											<TextFieldInput />
											<TextFieldErrorMessage>
												{field()
													.state.meta.errors.map((e) => e?.message)
													.join(", ")}
											</TextFieldErrorMessage>
										</TextField>
									</div>
								)}
							</form.Field>

							<form.Field name="role">
								{(field) => (
									<Select
										options={["admin", "member"]}
										value={field().state.value}
										onChange={field().handleChange}
										defaultValue={"member" as const}
										disallowEmptySelection={false}
										name="role"
										onBlur={field().handleBlur}
										itemComponent={(props) => (
											<SelectItem item={props.item}>
												{props.item.rawValue}
											</SelectItem>
										)}
									>
										<SelectLabel>Role</SelectLabel>
										<SelectTrigger class="w-[180px]" aria-label="Member role">
											<SelectValue<string>>
												{(state) => state.selectedOption()}
											</SelectValue>
										</SelectTrigger>
										<SelectErrorMessage>
											{field().state.meta.errors}
										</SelectErrorMessage>
										<SelectPortal>
											<SelectContent />
										</SelectPortal>
									</Select>
								)}
							</form.Field>
						</div>
						<form.Subscribe
							selector={(state) => ({
								canSubmit: state.canSubmit,
								isSubmitting: state.isSubmitting,
							})}
						>
							{(state) => {
								return (
									<Button type="submit" disabled={!state().canSubmit}>
										{state().isSubmitting ? "..." : "Submit"}
									</Button>
								);
							}}
						</form.Subscribe>
					</form>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
}
