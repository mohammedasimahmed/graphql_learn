exports.typeDefs = `
type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    phone: String!
    website: String!
    todo: Todo
}

type Todo {
    id: ID!
    title: String!
    completed: Boolean
    userId:ID!
    user: User
}

type Query {
    getTodos: [Todo]
    getAllUsers: [User]
    getUserById(id: ID!): User
}

type Mutation {
    deleteTodo(id:ID!): Todo
    addTodo(todo:AddTodoInput!): Todo
}

input AddTodoInput{
    title: String!
    completed: Boolean!
    userId:ID!
}

`;
