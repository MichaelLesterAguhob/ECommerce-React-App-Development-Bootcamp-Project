import { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext';
import { Button, Container, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import CheckoutOrder from "../components/CheckoutOrder";

export default function Cart() {
    const { user } = useContext(UserContext);
    const token = localStorage.getItem('token');
    const [cartItems, setCartitems] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isEmpty, setIsEmpty] = useState(true);

    function addQnty(productId) {
        let itemQnty = document.getElementById(productId);
        itemQnty.value = parseInt(itemQnty.value) + 1;
        setTimeout(() =>{
            updateQuantity(productId, itemQnty.value);
        }, 500)
    
    }

    function subtractQnty(productId) {
        let itemQnty = document.getElementById(productId);
        if (parseInt(itemQnty.value) > 1) {
            itemQnty.value = parseInt(itemQnty.value) - 1;
            setTimeout(() =>{
                updateQuantity(productId, itemQnty.value);
            }, 500)
        } else {
            itemQnty.value = 1;
        }
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            const cartItems = data.cart[0].cartItems;

            if (cartItems.length !== 0) {
                const productPromises = cartItems.map(item => 
                    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`)
                    .then(res => res.json())
                    .then(product => ({
                        ...item,
                        ...product
                    }))
                );

                Promise.all(productPromises).then(updatedItems => {
                    setCartitems(updatedItems.map((item, index) => (
                        <tr key={item.productId}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>
                                <input 
                                    id={item.productId}
                                    type="number" 
                                    className="form-control-sm text-center" 
                                    defaultValue={item.quantity}
                                    style={{ width: '50px', border: 'none', backgroundColor: 'wheat' }}
                                    readOnly
                                />
                                <Button className="btn btn-sm btn-success mx-2" onClick={() => addQnty(item.productId)}>+</Button>
                                <Button className="btn btn-sm btn-warning" onClick={() => subtractQnty(item.productId)}>-</Button>
                            </td>
                            <td>&#8369; {item.subtotal.toLocaleString()}</td>
                            <td>
                                <Button 
                                    style={{ border: 'none' }}
                                    className="btn btn-sm text-dark btn-warning"
                                    onClick={() => { removeItems(item.productId) }}
                                >
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    )));
                });
                setTotalPrice(data.cart[0].totalPrice.toLocaleString());
                setIsEmpty(false);
                setRefresh(false);
            } else {
                setIsEmpty(true);
                setTotalPrice(data.cart[0].totalPrice.toLocaleString());
            }
        });
    }, [token, refresh]);

    function updateQuantity(productId, newQnty) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: productId,
                newQuantity: newQnty
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Item quantity updated successfully") {
                setRefresh(true);
            }
        });
    }

    function clearAllCartItems() {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Cart cleared successfully") {
                setRefresh(true);
                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    timer: 1500,
                    timerProgressBar: true 
                });
            } else {
                Swal.fire({
                    title: data.message,
                    icon: 'error',
                    timer: 1500,
                    timerProgressBar: true 
                });
            }
        });
    }

    function removeItems(itemToremove) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${itemToremove}/remove-from-cart`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Item removed from cart successfully") {
                setRefresh(true);
                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true 
                });
            } else {
                Swal.fire({
                    title: data.message,
                    icon: 'error',
                    timer: 1000,
                    timerProgressBar: true 
                });
            }
        });
    }

    return (
        user.isAdmin ? 
        <Navigate to="/" /> 
        : 
        <Container className="mt-5 pt-5">
            <div className="d-flex justify-content-between">
                <h1>Your Cart</h1>
                <Button 
                    className="btn btn-danger my-auto" 
                    style={{ height: '40px' }} 
                    onClick={clearAllCartItems} 
                    disabled={isEmpty}
                >
                    Delete ALL
                </Button>
            </div>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isEmpty ? (
                        <tr>
                            <td colSpan={5} className="text-center">No items in cart.</td>
                        </tr>
                    ) : (
                        cartItems 
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <th className="text-sm-center text-md-end text-primary" colSpan={5} style={{ fontSize: '20px' }}>
                            Total: &#8369; {totalPrice}
                        </th>
                    </tr>
                </tfoot>
            </Table>
            <CheckoutOrder isEmpty={isEmpty} setRefresh={setRefresh} />
        </Container>
    );
}
