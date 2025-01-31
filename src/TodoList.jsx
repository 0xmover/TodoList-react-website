import React, { useState, useEffect } from "react";  
import "./styles.css"; // Import the custom CSS styles  

// Constants  
const TODO_LIST_OBJECT_ID = "0xe23e22d08e20de7bfa0961564c5433e7a89ab13d9cfcff1c8e5e5292bcf505e8";  
const PACKAGE_OBJECT_ID = "0x864fcf71e4c6004d8f95828a1524896023ffbf3ce683c0705c40032ebe3a394d";  
const FULLNODE_URL = "https://fullnode.testnet.sui.io:443";  
const SIGNER_ADDRESS = "0x2266f899ec322cbaf3a853501bd771be0b09bde792a2563d63b3c55bfa56a1ad"; // Replace with your actual signer address  

const TodoList = () => {  
  const [todos, setTodos] = useState([]);  
  const [newTodo, setNewTodo] = useState("");  

  // Fetch the current Todo List object from the blockchain  
  const fetchTodos = async () => {  
    try {  
      const response = await fetch(FULLNODE_URL, {  
        method: "POST",  
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify({  
          jsonrpc: "2.0",  
          id: 1,  
          method: "sui_getObject",  
          params: [TODO_LIST_OBJECT_ID], // Fetch the object ID representing the Todo List  
        }),  
      });  

      const data = await response.json();  
      console.log("Fetch Todos Response:", data); // Log the full response for debugging  

      if (data.error) {  
        console.error("Error fetching todos:", data.error.message);  
        return;  
      }  

      const items = data?.result?.details?.data?.fields?.items || [];  
      // Parse items into plain strings (if needed)  
      setTodos(items.map((item) => item.fields.value)); // Map to human-readable values  
    } catch (error) {  
      console.error("Error fetching todos:", error);  
    }  
  };  

  // Add a new todo item  
  const addTodo = async () => {  
    if (!newTodo.trim()) {  
      alert("Todo cannot be empty!");  
      return;  
    }  

    try {  
      // Make a moveCall to the "add" function in your Move contract using `unsafe_moveCall`  
      const response = await fetch(FULLNODE_URL, {  
        method: "POST",  
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify({  
          jsonrpc: "2.0",  
          id: 1,  
          method: "unsafe_moveCall",  
          params: {  
            signer: SIGNER_ADDRESS, // Your Sui wallet or signer address  
            package_object_id: PACKAGE_OBJECT_ID, // Sui package ID containing your module  
            module: "todo_list", // Module name  
            function: "add", // Function to call in the module  
            type_arguments: [], // No type arguments are required  
            arguments: [TODO_LIST_OBJECT_ID, `'${newTodo}'`], // Pass the object ID and the new todo item  
            gas_budget: '100000000', // Set a sufficient gas budget  
          },  
        }),  
      });  

      const data = await response.json();  
      console.log("Add Todo Response:", data); // Log response for debugging  

      if (data.error) {  
        console.error("Error adding todo:", data.error.message);  
        alert(`Failed to add Todo: ${data.error.message}`);  
        return;  
      }  

      setNewTodo(""); // Clear the input field  
      fetchTodos(); // Refresh the Todo list after adding  
    } catch (error) {  
      console.error("Error adding todo:", error);  
    }  
  };  

  // Remove a todo item by its index  
  const removeTodo = async (index) => {  
    try {  
      // Make a moveCall to the "remove" function in your Move contract using `unsafe_moveCall`  
      const response = await fetch(FULLNODE_URL, {  
        method: "POST",  
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify({  
          jsonrpc: "2.0",  
          id: 1,  
          method: "unsafe_moveCall",  
          params: {  
            signer: SIGNER_ADDRESS, // Your Sui wallet or signer address  
            package_object_id: PACKAGE_OBJECT_ID, // Sui package ID containing your module  
            module: "todo_list", // Module name  
            function: "remove", // Function to call in the module  
            type_arguments: [], // No type arguments are required  
            arguments: [TODO_LIST_OBJECT_ID, index], // Pass the list ID and the index to remove  
            gas_budget: 100000000, // Set a sufficient gas budget  
          },  
        }),  
      });  

      const data = await response.json();  
      console.log("Remove Todo Response:", data); // Log response for debugging  

      if (data.error) {  
        console.error("Error removing todo:", data.error.message);  
        alert(`Failed to remove Todo: ${data.error.message}`);  
        return;  
      }  

      fetchTodos(); // Refresh the Todo list after removal  
    } catch (error) {  
      console.error("Error removing todo:", error);  
    }  
  };  

  // Fetch the Todo list when the component loads  
  useEffect(() => {  
    fetchTodos();  
  }, []);  

  // Render the Todo List UI  
  return (  
    <div className="container">  
      <div className="todo-card">  
        <h1>Todo List</h1>  
        {/* Display the todos */}  
        <ul className="todo-list">  
          {todos.map((todo, index) => (  
            <li key={index} className="todo-item">  
              <span>{todo}</span>  
              <button onClick={() => removeTodo(index)}>Remove</button>  
            </li>  
          ))}  
        </ul>  
        {/* Input field and Add button */}  
        <div className="form-group">  
          <input  
            type="text"  
            value={newTodo}  
            onChange={(e) => setNewTodo(e.target.value)}  
            className="form-control"  
            placeholder="Add a new todo"  
          />  
          <button onClick={addTodo} className="add-button">  
            Add  
          </button>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default TodoList;