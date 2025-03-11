import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import betterAuthView from "./lib/auth-view";
import { userMiddleware, userInfo } from "./middlewares/auth-middleware";

const app = new Elysia()
  .use(cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }))
  .all("/api/auth/*", betterAuthView)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);