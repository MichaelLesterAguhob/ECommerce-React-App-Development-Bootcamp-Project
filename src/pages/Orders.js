import { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
import Swal from "sweetalert2";

export default function Orders() {
    const token = localStorage.getItem('token');
    const [orders, setOrders] = useState([]);

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
        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            // if(data.orders.length > 0) {
                setOrders(data.orders)
            // }
        })
    }, [token]);

    return (
        <>
        <Container className="mt-5 pt-4">
            <Container className="pb-4">
                <h1>Your Orders</h1>
            </Container>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ordered Items</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    (orders)?
                    orders.map((order, index) => (
                        <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>
                                <ol>
                                    {order.productOrdered.map(prod => (
                                        <li key={prod.productId._id}><h6>{prod.productId.name}</h6>
                                             <ul style={{listStyle: 'none'}} className="text-success">
                                                <li> price: &#8369; {prod.productId.price.toLocaleString()}</li>
                                                <li> qnty: x{prod.quantity}</li>
                                                <li> subtotal: &#8369; {prod.subtotal.toLocaleString()}</li>
                                            </ul>
                                        </li>
                                    ))}
                                </ol>
                            </td>
                            <td className="text-primary">&#8369; {order.totalPrice.toLocaleString()}</td>
                            <td>{new Date(order.orderedOn).toLocaleString()}</td>
                            <td className={order.status === "Pending" ? "text-danger" : "text-success"}>{order.status}</td>
                        </tr>
                    ))
                    :
                    <tr>
                        <td colSpan={5} className="text-center">No Orders Youret</td>
                    </tr>
                }
                 
                </tbody>
            </Table>
        </Container>
        </>
    );
}
