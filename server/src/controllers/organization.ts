import Elysia, { error, t } from "elysia";
import { model } from "@server/database/model";
import { betterAuth } from "@server/middlewares/auth-middleware";
import { checkContestBelongsToOrganization, createContest, getContestBySlug } from "@server/services/contest";
import {
  checkOrganizationAvailability,
  createOrganization,
  checkOrganizationMembership,
  getOrganizationsByUserId,
  getOrganizationById,
} from "@server/services/organization";

export const organizationHostController = new Elysia({
  name: "organizationHostController",
  prefix: "/:organizationSlug",
})
  .use(betterAuth)
  .guard(
    {
      auth: true,
      query: t.Object({
        organizationId: model.select.organization.id,
      }),
    },
    (app) =>
      app
        .resolve(async ({ error, user, query: { organizationId } }) => {
          const result = await checkOrganizationMembership({
            userId: user.id,
            organizationId,
          });
          if (!result) {
            return error(403, "Forbidden: You are not a member of this organization");
          }
          return {
            isOrganizationMember: true,
          };
        })
        .get("/", async ({ params, set, query: { organizationId } }) => {
          const organization = await getOrganizationById(organizationId);
          if (!organization) {
            set.status = 404;
            return error(404, "Organization not found");
          }
          return organization;
        })
        .post(
          "/contests/create",
          async ({ body, params, user, set }) => {
            const newContest = await createContest(body);
            set.status = 201;
            return newContest.id;
          },
          {
            body: t.Object({
              name: model.insert.contest.name,
              slug: model.insert.contest.slug,
              schema: model.insert.contest.schema,
              organizationId: model.insert.contest.organizationId,
            }),
          },
        )
        .guard(
          {
            query: t.Object({
              organizationId: model.select.organization.id,
              contestId: model.select.contest.id,
            }),
          },
          (app) =>
            app
              .resolve(async ({ error, params, user, query: { organizationId, contestId } }) => {
                const result = await checkContestBelongsToOrganization({
                  contestId,
                  organizationId,
                });
                if (!result) {
                  return error(403, "Forbidden: This contest does not belong to this organization");
                }
                return {
                  isContestBelongsToOrganization: result,
                };
              })
              .get(
                "/contests/:contestSlug",
                async ({
                  params,
                  user,
                set,
                query: { organizationId, contestId },
              }) => {
                const contest = await getContestBySlug({
                  organizationId,
                  contestId,
                });
                if (!contest) {
                  set.status = 404;
                  return error(404, "Contest not found");
                }
                return contest;
              },
            ),
        ),
  );

export const organizationController = new Elysia({
  name: "organizationController",
  prefix: "/api/organizations",
})
  .use(betterAuth)
  .guard(
    {
      auth: true,
    },
    (app) =>
      app
        .get("/", async ({ set, user, session, error, ...ctx }) => {
          return await getOrganizationsByUserId(user.id);
        })
        .get(
          "/checkAvailability/:slug",
          async ({ set, user, session, error, ...ctx }) => {
            const isAvailable = await checkOrganizationAvailability(
              ctx.params.slug,
            );
            return {
              isAvailable,
            };
          },
        )
        .post(
          "/create",
          async ({ body, user, set }) => {
            const newOrganization = await createOrganization(
              body.name,
              body.slug,
              user.id,
            );
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
        .use(organizationHostController),
  );
