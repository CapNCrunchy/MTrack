import Index from './pages/Index';
import LoginMenu from './components/LoginMenu';
import SignupMenu from './components/SignupMenu';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: 'http://localhost:8000', // "https://mtracker.pythonanywhere.com"
});


function App() {

  const [loggedIn, setLoggedIn] = useState();

  useEffect(() => {
    api.get('/api/user')
      .then(function (res) {
        setLoggedIn(true);
      })
      .catch(function (err) {
        setLoggedIn(false);
      })
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <div className="bg-zinc-900 min-h-screen flex flex-col text-white p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Index loggedIn={loggedIn} setLoggedIn={setLoggedIn} api={api} />}>
              <Route path="login" element={<LoginMenu setLoggedIn={setLoggedIn} api={api} />} />
              <Route path="signup" element={<SignupMenu setLoggedIn={setLoggedIn} api={api} />} />
              <Route path="dashboard" element={<Dashboard loggedIn={loggedIn} api={api} />} />
              <Route path="calendar" element={<Calendar />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter >
    </div >
  );
}

export default App;
