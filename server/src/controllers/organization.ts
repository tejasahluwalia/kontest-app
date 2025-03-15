import Elysia, { error, t } from "elysia";
import { model } from "@server/database/model";
import { betterAuth } from "@server/middlewares/auth-middleware";
import { createContest, getContestBySlug } from "@server/services/contest";
import { checkOrganizationAvailability, createOrganization, checkOrganizationMembership, getOrganizationsByUserId } from "@server/services/organization";

export const organizationOwnerController = new Elysia({ name: "organizationOwnerController", prefix: "/:organizationSlug" })
    .use(betterAuth)
    .guard({
        auth: true,
    }, app => app
        .resolve(async ({ error, params, user }) => {
            if (!params.organizationSlug) {
                return error(400, "Missing organization slug");
            }
            const result = await checkOrganizationMembership(user.id, params.organizationSlug);
            if (!result.success) {
                return error(result.status, result.error);
            }
            return { isOrganizationMember: result.success, organization: result.organization };
        })
        .get(
            "/",
            async ({ params, set, organization }) => {
                if (!organization) {
                    set.status = 404;
                    return error(404, "Organization not found");
                }
                return organization;
            },
        )
        .post(
            "/contests",
            async ({ body, params, user, set, organization }) => {

                if (!organization) {
                    set.status = 404;
                    return error(404, "Organization not found");
                }
                set.status = 201;

                return await createContest(
                    body.name,
                    body.slug,
                    organization.id,
                    body.schema
                );
            },
            {
                body: t.Object({
                    name: t.String(),
                    slug: t.String(),
                    schema: t.Optional(t.Any()),
                }),
            },
        )
        .get(
            "/contests/:contestSlug",
            async ({ params, user, set }) => {
                // Check if user is a member of the organization
                const result = await checkOrganizationMembership(
                    user.id,
                    params.organizationSlug
                );

                if (!result.success) {
                    set.status = result.status;
                    return error(result.status, result.error);
                }

                const contest = await getContestBySlug(result.organization.id, params.contestSlug);
                if (!contest) {
                    set.status = 404;
                    return error(404, "Contest not found");
                }
                return contest;
            },
        ))


export const organizationController = new Elysia({ name: "organizationController", prefix: "/api/organizations" })
    .use(betterAuth)
    .guard({
        auth: true,
    }, app => app
        .get(
            "/",
            async ({ set, user, session, error, ...ctx }) => {
                return await getOrganizationsByUserId(user.id);
            },
        )
        .get(
            "/checkAvailability/:slug",
            async ({ set, user, session, error, ...ctx }) => {
                const isAvailable = await checkOrganizationAvailability(ctx.params.slug);
                return {
                    isAvailable,
                };
            },
        )
        .post(
            "/create",
            async ({ body, user, set }) => {
                const newOrganization = await createOrganization(body.name, body.slug, user.id);
                set.status = 201;
                return newOrganization;
            },
            {
                body: t.Object({
                    name: model.insert.organization.name,
                    slug: model.insert.organization.slug,
                }),
            },
        )
        .use(organizationOwnerController))


