import "reflect-metadata";

import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { createTypeormConn } from "./createTypeormConn";
import { createSchema } from "./createSchema";

const PORT = 4000;


const startServer = async () => {
    const app = express();

    await createTypeormConn();
    const server = new ApolloServer(
        {
            schema: createSchema()
        }
    );
    server.applyMiddleware({ app });

    app.listen({ port: PORT }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    )
}

startServer();