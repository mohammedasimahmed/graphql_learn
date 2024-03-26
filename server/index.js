const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
let TODOS = require("./todo");
const USERS = require("./users");
const { typeDefs } = require("./schema");

const resolvers = {
  Todo: {
    user: (todo) => USERS.find((user) => todo.userId === user.id),
  },
  User: {
    todo: (user) => TODOS.find((todo) => todo.id === user.id),
  },
  Query: {
    getTodos: () => TODOS,
    getAllUsers: () => USERS,
    getUserById: (_, { id }) => {
      return USERS.find((user) => user.id === Number(id));
    },
  },
  Mutation: {
    deleteTodo: (_, { id }) => {
      let deletedTodo;
      let NewTodos = TODOS.filter((todo) => {
        if (todo.id === Number(id)) {
          deletedTodo = todo;
        } else return todo;
      });
      TODOS = NewTodos;
      return deletedTodo;
    },
    addTodo: (_, args) => {
      let id = (TODOS.length + 1).toString();
      let newTodo = { id, ...args.todo };
      TODOS.push(newTodo);
      return newTodo;
    },
  },
};

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers,
  });

  app.use(bodyParser.json());
  app.use(cors());
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen("8000", () => console.log("Server started at port 8000"));
}

startServer();

/*
    --> graphql server should know what operations you will perform on it like we have routes in express,
    we have schemas in graphql in TypeDef.
    
    -->In the Todo Schema we have id: ID! means id can be anything and id field is compulsory
    
    -->type Query is for getting data.

    --> type Todo is like schema in mongodb

*/
