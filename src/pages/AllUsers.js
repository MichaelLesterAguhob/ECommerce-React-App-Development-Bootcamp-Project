import { useState, useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";


export default function AllUsers() {

    const token = localStorage.getItem('token');
    const [users, setUsers] = useState([]);

    let isNotified = false;
    setInterval(() => {
        if(!navigator.onLine && isNotified === false) {
            isNotified = true
            Swal.fire({
                title: 'No internet connection!',
                icon: 'error'
            })
        } 
    }, 1000)

    useEffect(()=>{
        if(!navigator.onLine) {
            Swal.fire({
                title: 'No internet connection!sdfg',
                icon: 'error'
            })
        }
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/all-users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.length > 0) {
                setUsers(data.map(user => {
                        return (
                            <tr key={user._id}>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.mobileNo}</td>
                                <td className={user.isAdmin ? "text-primary" : "text-muted"}>{user.isAdmin ? "ADMIN":"Not Admin"}</td>
                                <td className="d-flex gap-2">
                                    <button className="btn btn-primary">Set as Admin</button>
                                    <button className="btn btn-danger">Remove</button>
                                </td>
                            </tr>
                        )   
                }))
            }
        })
    }, [])

    return (

        <Container className="mt-5 pt-5 mb-5">
            <h1>All Users</h1>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile No.</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {users}
                </tbody>
            </Table>
        </Container>
    )
}










