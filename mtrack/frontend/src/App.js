import Index from "./pages/Index";
import LoginMenu from "./components/LoginMenu";
import SignupMenu from "./components/SignupMenu";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function getCSRFToken() {
    const name = "csrftoken";
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
}

const api = axios.create({
    baseURL: "http://localhost:8000", // "https://mtracker.pythonanywhere.com"
    withCredentials: true,
    headers: {
        "X-CSRFToken": getCSRFToken(),
    },
});

function App() {
    const [loggedIn, setLoggedIn] = useState();

    useEffect(() => {
        api.get("/api/csrf/")
            .then(() => console.log("CSRF token set successfully"))
            .catch(() => console.error("Failed to fetch CSRF token"));

        api.get("/api/user")
            .then(function (res) {
                setLoggedIn(true);
            })
            .catch(function (err) {
                setLoggedIn(false);
            });
    }, []);

    return (
        <div className="App">
            <BrowserRouter>
                <div className="bg-zinc-900 min-h-screen flex flex-col text-white p-4 md:p-8">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Index
                                    loggedIn={loggedIn}
                                    setLoggedIn={setLoggedIn}
                                    api={api}
                                />
                            }
                        >
                            <Route index element={<Home />} />
                            <Route
                                path="login"
                                element={
                                    <LoginMenu
                                        setLoggedIn={setLoggedIn}
                                        api={api}
                                    />
                                }
                            />
                            <Route
                                path="signup"
                                element={
                                    <SignupMenu
                                        setLoggedIn={setLoggedIn}
                                        api={api}
                                    />
                                }
                            />
                            <Route
                                path="dashboard"
                                element={
                                    <Dashboard loggedIn={loggedIn} api={api} />
                                }
                            />
                            <Route
                                path="calendar"
                                element={
                                    <Calendar loggedIn={loggedIn} api={api} />
                                }
                            />
                        </Route>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
