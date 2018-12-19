import "reflect-metadata";

import * as express from 'express';
import * as session from "express-session";
import * as connectRedis from 'connect-redis';
import { ApolloServer } from 'apollo-server-express';
import * as cors from 'cors';

import { createTypeormConn } from "./createTypeormConn";
import { createSchema } from "./createSchema";
import { redis } from "./redis";

const PORT = 4000;
const SESSION_SECRET = "asd123asda"
const RedisStore = connectRedis(session);

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000'
}

const startServer = async () => {
    const app = express();

    await createTypeormConn();

    app.use(cors(corsOptions))

    app.use(
        session({
            store: new RedisStore({
                client: redis as any,
            }),
            name: "qid",
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365
            }
        })
    )

    const server = new ApolloServer(
        {
            schema: createSchema(),
            context: ({ req }: any) => ({
                req
            })
        }
    );

    server.applyMiddleware({ app, cors: corsOptions });
    app.listen({ port: PORT }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    )
}

startServer();