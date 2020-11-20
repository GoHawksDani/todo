import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import Todo from "./Todo";
import { getTodosByVisibilityFilter } from "../redux/selectors";
import fire from "../config/fire-config";

const TodoList = () => {
    const [userId, setUserId] = useState('');
    const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        fire.auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    setUserId(user.uid);
                }
            });
        if(userId) {
                fire.firestore()
                    .collection("todos")
                    .doc(userId)
                    .collection('userTodos')
                    .get()
                    .then(function(querySnapshot) {
                            querySnapshot.forEach(doc => {
                                if (doc.exists) {
                                    const todo = {
                                        id: doc.id,
                                        title: doc.data().title,
                                        body: doc.data().body,
                                        deadline: doc.data().deadline,
                                        completed: doc.data().completed,
                                    };
                                    setTodoList(prev => [...prev, todo]);
                                } else {
                                    console.log("No such document!");
                                }
                            }
                        )})
                    .catch(function(error) {
                        console.log("Error getting document:", error);
                    });
        }
    }, [userId]);

    return(
        <ul className="todo-list">
            {todoList && todoList.length
                ? todoList.map((todo) => {
                    return <Todo key={`todo-${todo.id}`} todo={todo} userId={userId}/>;
                })
                : "No todos, yay!"}
        </ul>
    );
};

const mapStateToProps = state => {
    const { visibilityFilter } = state;
    const todos = getTodosByVisibilityFilter(state, visibilityFilter);
    return { todos };
};

export default connect(mapStateToProps)(TodoList);