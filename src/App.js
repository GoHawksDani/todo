import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import VisibilityFilters from "./components/VisibilityFilters";
import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import styles from "./style.module.css";
import Paper from "@material-ui/core/Paper";
import fire from "./config/fire-config";
import githubLogo from './github-logo.png';

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({})

    fire.auth()
        .onAuthStateChanged((user) => {
            if (user) {
                setLoggedIn(true)
                setUser(user);
            } else {
                setLoggedIn(false)
            }
        })

    const handleLogout = () => {
        fire.auth()
            .signOut()
            .then(() => {
                console.log("user logged out")
            });
    }

    function handleGithubLogin() {
        fire
            .auth()
            .signInWithPopup(new fire.auth.GithubAuthProvider())
            .then((response) => {
                setUser(response.user);
                setLoggedIn(true);
                console.log(user);
            });
    }

  return (
      <Router>
          <Paper className={styles.menuContainer} square>
              <Link to="/" className={styles.menuItem}>
                  <span className={styles.noSelect}>Todos</span>
                  <div className={styles.circle}/>
              </Link>
              <Link to="/add_todo" className={styles.menuItem}>
                  <span className={styles.noSelect}>Add new Todo</span>
                  <div className={styles.circle}/>
              </Link>
              {!loggedIn ?
                  <div className={styles.menuContainerRight}>
                      <a className={styles.menuItemRightGithub} onClick={handleGithubLogin} href={'#void'}>
                          <img src={githubLogo} alt={'github logo'} className={styles.githubLogoImg} />
                      </a>
                  </div>
                  :
                  <div className={styles.menuContainerRight}>
                      <div className={styles.loggedInUserContainer}>
                          <p className={styles.loggedInUserNameEmail}>{user ? user.displayName ? user.displayName : user.email : ''}</p>
                          {user.photoURL ? <img src={user.photoURL} alt={'photo of user'} className={styles.userPhoto} /> : null }
                      </div>
                      <a onClick={handleLogout} className={styles.menuItemRight}>Log out</a>
                  </div>
              }
          </Paper>

              <Switch>
                  <Route path="/add_todo">
                      <AddTodo />
                  </Route>
                  <Route path="/">
                      <div>
                          <TodoList />
                          <VisibilityFilters />
                      </div>
                  </Route>
              </Switch>
      </Router>
  );
}