import React, { useEffect, useState } from "react";
import { useLazyQuery, gql, useMutation } from "@apollo/client";

const GetAllTodosQuery = gql`
  query GetAllTodos {
    getTodos {
      id
      title
      user {
        id
        name
      }
    }
  }
`;
const AddTodo = gql`
  mutation AddTodo($todo: AddTodoInput!) {
    addTodo(todo: $todo) {
      title
    }
  }
`;
const DeleteTodo = gql`
  mutation DeleteTodo($deleteTodoId: ID!) {
    deleteTodo(id: $deleteTodoId) {
      title
    }
  }
`;

const App = () => {
  const [todoId, setTodoId] = useState("");
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState("");
  const [userId, setUserId] = useState("");
  const [todos, setTodos] = useState([]);
  const [addTodo] = useMutation(AddTodo);
  const [deleteTodo] = useMutation(DeleteTodo);
  const [getTodos, { loading, data }] = useLazyQuery(GetAllTodosQuery, {
    fetchPolicy: "network-only", // Doesn't check cache before making a network request , used for first execution
    // fetchPolicy: "cache-and-network", // makes request to both server and cache and also keeps the catched data updated with server data
    nextFetchPolicy: "cache-first", // Used for subsequent executions
    /*
    By default, the useQuery hook checks the Apollo Client cache to see if all 
    the data you requested is already available locally. If all data is available 
    locally, useQuery returns that data and doesn't query your GraphQL server. 
    This cache-first policy is Apollo Client's default fetch policy.
    */
  });
  const [clicked, setClicked] = useState(false);

  // useEffect(() => {
  //   if (data) {
  //     setTodos(data.getTodos);
  //     console.log("got data");
  //   }
  // }, [data]);

  const fetchData = async () => {
    setClicked(true);
    await getTodos();
    console.log("data", data);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!todoId) {
      alert("enter some input");
      return;
    }
    try {
      const { data } = await deleteTodo({
        variables: {
          deleteTodoId: todoId,
        },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title || !completed || !userId) {
      alert("enter input");
      return;
    }
    try {
      const { data } = await addTodo({
        variables: {
          todo: {
            title: title,
            completed: Boolean(completed),
            userId: userId,
          },
        },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading && clicked) return <h1>Loading...</h1>;

  return (
    <div>
      <button onClick={fetchData}>Fetch Todos</button>
      <form onSubmit={(e) => handleDelete(e)}>
        <input value={todoId} onChange={(e) => setTodoId(e.target.value)} />
        <button>delete todo</button>
      </form>
      <form onSubmit={(e) => handleAddTodo(e)}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input
          value={completed}
          onChange={(e) => setCompleted(e.target.value)}
        />
        <input value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button>add todo</button>
      </form>
      {clicked && data && (
        <table>
          <tbody>
            {data.getTodos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{todo?.user?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;

/*
import React from "react";
import { useQuery, gql } from "@apollo/client";

const GetAllTodos = gql`
  query GetAllTodos {
    getTodos {
      id
      title
      user {
        id
        name
      }
    }
  }
`;

const App = () => {
  const { loading, data } = useQuery(GetAllTodos);
  if (loading) return <h1>Loading...</h1>;
  console.log(data.getTodos);
  return (
    <table>
      <tbody>
        {data.getTodos.map((todo) => {
          return (
            <tr key={todo.id}>
              <td>{todo.title}</td>
              <td>{todo?.user?.name}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default App;
*/

/*
"useQuery" is used for executing queries immediately when the component is rendered,
while "useLazyQuery" is used for executing queries on demand.
*/
