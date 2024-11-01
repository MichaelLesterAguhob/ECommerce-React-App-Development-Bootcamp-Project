import { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';
import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ProductCatalog() {
    const {user} = useContext(UserContext);
    const [products, setProducts] = useState([]);
    
    let isNotified = false;
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

    useEffect(() => { 
        if(!navigator.onLine) {
            Swal.fire({
                title: "No internet connection!",
                icon: "error"
            })
            return;
     }
        let URL = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/products/all` : `${process.env.REACT_APP_API_BASE_URL}/products/active`
        fetch(URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            if(data !== null) {
                setProducts(data);
            }
        })
    },[user])


    const reloadProduct = () => {
        let URL = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/products/all` : `${process.env.REACT_APP_API_BASE_URL}/products/active`
        fetch(URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            if(data !== null) {
                setProducts(data);
            }
        })
    }

    return (
        user.isAdmin ?
            <Container>
                <AdminView productsData={products} reloadProduct={reloadProduct}/>
            </Container>
        :
            <Container fluid className='pt-3 pb-3'>
                <UserView productsData={products} reloadProduct={reloadProduct}/>
            </Container>
    )
}