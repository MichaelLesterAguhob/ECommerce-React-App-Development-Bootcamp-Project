
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import {UserProvider} from './UserContext';
import NavBar from './components/NavBar';
import Register from './pages/Register';
import Login from './pages/Login';


function App() {
    const [user, setUser] = useState({
        id: null
    })

    const unsetUser = () => {
        localStorage.clear();
    }

    useEffect(() => {
            fetch(``, {
            headers: {
                Authorizations: `Bearer ${ localStorage.getItem('token') }`
            }
            })
            .then(res => res.json())
            .then(data => {
                if (typeof data.user !== "undefined") {
                    setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin
                    });
                } else {
                    setUser({
                    id: null
                    });
                }
            })
        }, []);

  return (
    <UserProvider value={{user, setUser, unsetUser}}>
      <Router>
        <NavBar />
        <Container>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/register" element={<Register />} />
             <Route path="/login" element={<Login />} />
            {/* <Route path="/logout" element={<Logout />} /> */}
            {/* <Route path="*" element={<Error />} /> */}
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
