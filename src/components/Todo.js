import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { toggleTodo } from "../redux/actions";
import fire from "../config/fire-config";

const Todo = ({ todo, userId }) => {
    const [completed, setCompleted] = useState(todo.completed);

    useEffect(() => {
        console.log(todo);
        setCompleted(todo.completed);
    }, []);

    const handleToggleTodo = () => {
        fire.firestore()
            .collection("todos")
            .doc(userId)
            .collection('userTodos')
            .doc(todo.id)
            .update({
                completed: true
            })
            .then(() => {
                console.log("doc updated");
                setCompleted(!completed);
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

    return (
        <li className="todo-item" onClick={handleToggleTodo}>
            <div className={"todoInternalContainer"}>
            <label className={cx(
                "todoLabel",
                todo && completed && "todo-item--completed")}>Title:
            <span className={cx(
                "todo-item__title",
                todo && completed && "todo-item--completed")}>{todo.title}</span>
            </label>
            <label className={cx(
                "todoLabel",
                todo && completed && "todo-item--completed")}>Description:
                <span
                className={cx(
                    "todo-item__text",
                    todo && completed && "todo-item--completed")}>
                {todo.body}
            </span>
            </label>
            <label className={cx(
                "todoLabel",
                todo && completed && "todo-item--completed")}>Deadline:
                <span className={todo && completed ? "todo-item--completed" : ""}>
                    {new Date(todo.deadline.seconds * 1000).toLocaleDateString("en-US")}
                </span>
            </label>
                <p>Checkmark icon</p>
                <p>Delete icon</p>
            </div>
        </li>
    );
}

export default connect(
    null,
    { toggleTodo }
)(Todo);