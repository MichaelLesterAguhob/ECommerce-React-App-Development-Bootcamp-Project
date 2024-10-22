import { useContext, useEffect, useId, useState } from 'react';
import UserContext from '../UserContext';
import UserView from '../components/UserView';

export default function ProductCatalog() {
    const {user} = useContext(UserContext);
    const [products, setProducts] = useState([]);

    useEffect(() => { 
        
        let URL = user.isAdmin ? 'http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/products/all' : 'http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/products/active'
        fetch(URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            if(data !== null) {
                setProducts(data);
            }
        })
    })

    return (
        <UserView productsData={products} />
    )
}