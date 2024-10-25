
import { useState, useEffect } from 'react';
import { Container, Toast } from 'react-bootstrap';
import Swal from 'sweetalert2';
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
    
    let isNotified = false;

    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    })

    setInterval(() => {
        if(!navigator.onLine) {
            if(!isNotified) {
                Swal.fire({
                    title: "No internet connection!",
                    icon: "error"
                })
                isNotified = true;
            }
            return;
        } else {
            isNotified = false;
        }
    }, 1000)
        

    function unsetUser() {
        localStorage.clear();
    }

    useEffect(() => {
        if(!navigator.onLine) {
                Swal.fire({
                    title: "No internet connection!",
                    icon: "error"
                })
                return;
        }
        if(localStorage.getItem("token") !== null)
        {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
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
