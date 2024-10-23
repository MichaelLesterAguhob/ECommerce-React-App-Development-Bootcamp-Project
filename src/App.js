
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import {UserProvider} from './UserContext';
import NavBar from './components/NavBar';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import ProductCatalog from './pages/ProductCatalog';
import ProductView from './pages/ProductView';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    })

    function unsetUser() {
        localStorage.clear();
    }

    useEffect(() => {
        if(localStorage.getItem("token") !== null)
        {
            fetch(`http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/users/details`, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
            })
            .then(res => res.json())
            .then(data => {
                setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin
                });
            })
        } else { 
            setUser({
                id: null,
                isAdmin: null
            })
        }
            
    }, []);

  return (
    <UserProvider value={{user, setUser, unsetUser}}>
      <Router>
        <NavBar />
        <Container>
          <Routes>
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/register" element={<Register />} />
             <Route path="/login" element={<Login />} />
             <Route path="/logout" element={<Logout />} />
            <Route path="/products/:id" element={<ProductView />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/details" element={<Profile />} />
            {/* <Route path="*" element={<Error />} /> */}
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
