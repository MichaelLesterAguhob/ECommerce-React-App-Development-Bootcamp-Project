import { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext';
import { Table, Container } from "react-bootstrap";

export default function Orders() {
    const token = localStorage.getItem('token');
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/orders/my-orders`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            const orderPromises = data.orders.map(order => {
                const productPromises = order.productOrdered.map(item => 
                    fetch(`http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/products/${item.productId}`)
                        .then(res => res.json())
                        .then(prodDetails => ({
                            productId: item.productId,
                            name: prodDetails.name
                        }))
                );

                return Promise.all(productPromises).then(productDetails => ({
                    ...order,
                    productDetails
                }));
            });
            return Promise.all(orderPromises);
        })
        .then(ordersWithProducts => {
            setOrders(ordersWithProducts);
        })
        .catch(err => console.error(err));
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
                    {orders.map((order, index) => (
                        <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>
                                <ol>
                                    {order.productDetails.map(prod => (
                                        <li key={prod.productId}>{prod.name}</li>
                                    ))}
                                </ol>
                            </td>
                            <td>&#8369; {order.totalPrice.toLocaleString()}</td>
                            <td>{new Date(order.orderedOn).toLocaleString()}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
        </>
    );
}