import React, {useEffect, useRef, useState} from 'react';
import { connect } from 'react-redux'
import { addTodo } from '../redux/actions'
import styles from '../style.module.css'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import fire from "../config/fire-config";

const AddTodo = () => {
    const [newTodoBody, setNewTodoBody] = useState('');
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [selectedDeadline, setSelectedDeadline] = useState('2020-11-18');
    const [userId, setUserId] = useState('');
    const [notification, setNotification] = useState('');

    const addTodoBtnRef = useRef(null);

    useEffect(() => {
        fire.auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    setUserId(user.uid);
                }
            });
    }, []);

    const handleAddTodo = () => {
        if(newTodoTitle && newTodoBody && selectedDeadline) {
            const docData = {
                title: newTodoTitle,
                body: newTodoBody,
                deadline: fire.firestore.Timestamp.fromDate(new Date(selectedDeadline)),
                completed: false
            }
            fire.firestore()
                .collection('todos')
                .doc(userId)
                .collection('userTodos')
                .add(docData).then(() => {
                setNewTodoBody('');
                setNewTodoTitle('');
                setNotification('TODO ADDED');
                setTimeout(() => {
                    setNotification('')
                }, 1000);
            })
        }
    }

    const handleDateChange = (date) => {
        const mm = date.getMonth() + 1; // getMonth() is zero-based
        const dd = date.getDate();

        const formattedDate = date.getFullYear() +
                    '-' + ((mm>9 ? '' : '0') + mm) +
                    '-' + ((dd>9 ? '' : '0') + dd);

        setSelectedDeadline(formattedDate);
    };

    const handleOnMouseEnter = () => {
        if(newTodoTitle && newTodoBody) {
            addTodoBtnRef.current.className = styles.positiveAddTodoButton;
        } else {
            addTodoBtnRef.current.className = styles.disabledAddTodoButton;
        }
    }

    const handleOnMouseLeave = () => {
        addTodoBtnRef.current.className = styles.neutralAddTodoButton;
    }

    return(
        <div className={styles.addTodoContainer}>
            {notification ? <p className={styles.addedTodoNoti}>{notification}</p> : null}
                <label className={styles.addTodoLabels}>Title:
                    <input placeholder={'title of the Todo'}
                       type={'text'}
                           className={styles.addTodoTitleInput}
                       onChange={e => setNewTodoTitle(e.target.value)}
                       value={newTodoTitle} />
                </label>
            <label className={styles.addTodoLabels}>
                Description:
                <textarea placeholder={'short description of the Todo'}
                          cols={40}
                          rows={5}
                          onChange={e => setNewTodoBody(e.target.value)}
                          value={newTodoBody}
                          className={styles.addTodoTextarea}/>
            </label>
            <div className={styles.datePickerContainer}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date picker inline"
                        value={selectedDeadline}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
            </div>

            <button ref={addTodoBtnRef}
                    className={styles.neutralAddTodoButton}
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                    onClick={handleAddTodo}>Add Todo</button>
        </div>
    );
}

export default connect(
    null,
    { addTodo }
)(AddTodo)