import { createContext } from "@template/trpc/context";
import { createExpressMiddleware } from "@template/trpc/middlewares/express/trpcExressMiddleware";
import { appRouter } from "@template/trpc/routers/root";
import cors from "cors";
import express from "express";

import swaggerUi from "swagger-ui-express";

import { createOpenApiExpressMiddleware } from "@template/trpc/middlewares/openapi/expressMiddleware";
import { openApiDocument } from "@template/trpc/openapi";

const port: number = 3002 as const;

// Initialize the express engine
const app: express.Application = express();

app.use(cors());

// Handle incoming tRPC requests
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

// Handle incoming OpenAPI requests
app.use("/api", createOpenApiExpressMiddleware({ router: appRouter, createContext }));

// Serve Swagger UI with our OpenAPI schema
app.use("/", swaggerUi.serve);
app.get("/", swaggerUi.setup(openApiDocument));

// Server setup
app.listen(port, () => {
  console.log(`started server on [::]:${port}, url: http://localhost:${port}`);
});
