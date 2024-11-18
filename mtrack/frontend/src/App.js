import Index from './pages/Index';
import LoginMenu from './components/LoginMenu';
import SignupMenu from './components/SignupMenu';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SignOut, SignIn, UserPlus } from '@phosphor-icons/react';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setLoggedIn(true);
      setEmail(email);
      // TODO: actually get the name from the database
    }
  }, []);

  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('email');
    window.location.href = '/login';
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div className="bg-zinc-900 min-h-screen flex flex-col text-white p-4 md:p-8">
          <div className="mb-4">
            <div className='flex flex-row gap-2 justify-between items-center'>
              <div className='flex flex-col'>
                <h1 className="text-4xl font-bold">MTrack</h1>
                <p className="text-xl font-light">Your personal medication tracker</p>
              </div>
              {loggedIn ? (
                <button onClick={handleSignOut} className="flex items-center gap-2 bg-red-700 p-2 rounded">
                  <SignOut size={24} />
                  <p className='hidden md:block'>Sign Out</p>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { window.location.href = '/login'; }} className="flex items-center gap-2 bg-green-900 p-2 rounded">
                    <SignIn size={24} />
                    <p className='hidden md:block'>Sign In</p>
                  </button>
                  <button onClick={() => { window.location.href = '/signup'; }} className="flex items-center gap-2 bg-blue-900 p-2 rounded">
                    <UserPlus size={24} />
                    <p className='hidden md:block'>Sign Up</p>
                  </button>
                </div>
              )}
            </div>

            <hr className="border-t border-gray-700 w-full my-4" />
          </div>
          <Routes>
            <Route path="/" element={<Index loggedIn={loggedIn} name={name} email={email} />} />
            <Route path="/login" element={<LoginMenu loggedIn={loggedIn} setLoggedIn={setLoggedIn} setEmail={setEmail} setName={setName} />} />
            <Route path="/signup" element={<SignupMenu loggedIn={loggedIn} setLoggedIn={setLoggedIn} setEmail={setEmail} setName={setName} />} />
            <Route path="/dashboard" element={<Dashboard loggedIn={loggedIn} email={email} name={name} />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </div>
      </BrowserRouter >
    </div >
  );
}

export default App;
