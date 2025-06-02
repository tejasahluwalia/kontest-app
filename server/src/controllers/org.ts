import Elysia, { error, t } from "elysia";
import { model } from "@server/database/model";
import { betterAuth } from "@server/middlewares/auth-middleware";
import { checkCallBelongsToOrg, createCall, deleteCall, getCallBySlug, updateCall } from "@server/services/call";
import {
  checkOrgAvailability,
  createOrg,
  checkOrgMembership,
  getOrgsByUserId,
  getOrgById,
} from "@server/services/org";

export const orgHostController = new Elysia({
  name: "orgHostController",
  prefix: "/:orgSlug",
})
  .use(betterAuth)
  .guard(
    {
      auth: true,
      query: t.Object({
        orgId: model.select.org.id,
      }),
    },
    (app) =>
      app
        .resolve(async ({ error, user, query: { orgId } }) => {
          const result = await checkOrgMembership({
            userId: user.id,
            orgId,
          });
          if (!result) {
            return error(403, "Forbidden: You are not a member of this org");
          }
          return {
            isOrgMember: true,
          };
        })
        .get("/", async ({ params, set, query: { orgId } }) => {
          const org = await getOrgById(orgId);
          if (!org) {
            set.status = 404;
            return error(404, "Org not found");
          }
          return org;
        })
        .post(
          "/calls/create",
          async ({ body, params, user, set }) => {
            const newCall = await createCall(body);
            set.status = 201;
            return newCall.id;
          },
          {
            body: t.Object({
              name: model.insert.call.name,
              slug: model.insert.call.slug,
              schema: model.insert.call.schema,
              orgId: model.insert.call.orgId,
            }),
          },
        )
        .group(
          "/calls/:callSlug",
          {
            query: t.Object({
              orgId: model.select.org.id,
              callId: model.select.call.id,
            }),
          },
          (app) =>
            app
              .resolve(async ({ error, params, user, query: { orgId, callId } }) => {
                const result = await checkCallBelongsToOrg({
                  callId,
                  orgId,
                });
                if (!result) {
                  return error(403, "Forbidden: This call does not belong to this org");
                }
                return {
                  isCallBelongsToOrg: result,
                };
              })
              .get(
                "/",
                async ({
                  params,
                  user,
                  set,
                  query: { orgId, callId },
                }) => {
                  const call = await getCallBySlug({
                    orgId,
                    callId,
                  });
                  if (!call) {
                    set.status = 404;
                    return error(404, "Call not found");
                  }
                  return call;
                },
              )
              .delete(
                "/",
                async ({ params, user, set, query: { orgId, callId } }) => {
                  await deleteCall(callId);
                  return;
                },
              )
              .post(
                "/update",
                async ({ body, params, user, set }) => {
                  if (!body.id) {
                    set.status = 400;
                    return error(400, "Missing call ID");
                  }
                  const updatedCall = await updateCall(body.id, body);
                  set.status = 200;
                  return updatedCall;
                },
                {
                  body: t.Object({
                    id: model.insert.call.id,
                    name: model.insert.call.name,
                    slug: model.insert.call.slug,
                    schema: model.insert.call.schema,
                    orgId: model.insert.call.orgId,
                  }),
                },
              )
        ),
  );

export const orgController = new Elysia({
  name: "orgController",
  prefix: "/api/orgs",
})
  .use(betterAuth)
  .guard(
    {
      auth: true,
    },
    (app) =>
      app
        .get("/", async ({ set, user, session, error, ...ctx }) => {
          return await getOrgsByUserId(user.id);
        })
        .get(
          "/checkAvailability/:slug",
          async ({ set, user, session, error, ...ctx }) => {
            const isAvailable = await checkOrgAvailability(
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
            const newOrg = await createOrg(
              body.name,
              body.slug,
              user.id,
            );
            set.status = 201;
            return newOrg;
          },
          {
            body: t.Object({
              name: model.insert.org.name,
              slug: model.insert.org.slug,
            }),
          },
        )
        .use(orgHostController),
  );
