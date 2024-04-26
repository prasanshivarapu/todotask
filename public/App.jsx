// App.js
// import React from "react";
import { Provider } from "react-redux";
import store from "./components/store";
// import TodoList from "./TodoList";
import TodoList from "./components/todoList3";
import "./index.css";
import "./App.css";
import TodoList2 from "./components/todoList2";
import MyComponent from "./components/Mycomponent";

function App() {
    return (
        <Provider store={store}>
            {/* <TodoList2 /> */}
            {/* <TodoList /> */}
            {/* <TodoList /> */}
            <MyComponent />
        </Provider>
    );
}

export default App;
