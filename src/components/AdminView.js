
import { useState, useEffect } from "react";
import React from "react";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import ProductCard from "./ProductCard";
import Swal from "sweetalert2";

const AdminView = ({productsData, reloadProduct}) => {
    const [products, setProducts] = useState([]);
    // const [toSearch, setToSearch] = useState(""); - set for searching in admin addtional feature

    function archiveProduct(productId) {
        fetch(`http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/products/${productId}/archive`, {
            method: 'PATCH',
            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>res.json())
        .then(data => {
            if(data.success) {
                Swal.fire({
                    title: data.message,
                    icon: "success",
                    timer: 1000,
                    timerProgressBar: true
                })
                reloadProduct();
            } else if(data.message === "Product already archived"){
                Swal.fire({
                    title: data.message,
                    icon: "warning",
                    timer: 1000,
                    timerProgressBar: true
                })
            } else {
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    timer: 1000,
                    timerProgressBar: true
                })
            }
        })
    }

    function activateProduct(productId) {
        fetch(`http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/products/${productId}/activate`, {
            method: 'PATCH',
            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        })
        .then(res=>res.json())
        .then(data => {
            if(data.success) {
                Swal.fire({
                    title: data.message,
                    icon: "success",
                    timer: 1000,
                    timerProgressBar: true
                })
                reloadProduct();
            } else if(data.message === "Product already active"){
                Swal.fire({
                    title: data.message,
                    icon: "warning",
                    timer: 1000,
                    timerProgressBar: true
                })
            } else {
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    timer: 1000,
                    timerProgressBar: true
                })
            }
        })
    }

    useEffect( () => {
        setProducts(productsData.map((product, index) => {
            return(
                <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td className={product.isActive ? "text-success" : "text-danger"}>
                        {product.isActive ? "Active" : "Unvailable"}
                    </td>
                    <td>
                        <button 
                            className="btn btn-primary btn-sm me-2">
                            Edit
                        </button>
                        {
                            product.isActive === true ?
                                <button 
                                    className="btn btn-warning btn-sm" 
                                    onClick={() => archiveProduct(product._id)}>
                                    Archive
                                </button>
                            :
                            <button 
                                className="btn btn-success btn-sm me-2" 
                                onClick={() => activateProduct(product._id)}>
                                Activate
                            </button>
                        }
                    </td>
                </tr>
            )
        }))
    }, [productsData])

    /* set for searching in admin addtional feature
    function searchProduct(e) {
        e.preventDefault();

        fetch(`http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/products/search-by-name`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: toSearch
            }),
        })
        .then(res => res.json())
        .then(data => {
            if(data) {
                setProducts(data.map(product => {
                    return <ProductCard key={product._id} props={product}/>
                }))
                setSearchMode(true);
            } else {
                Swal.fire({
                    title: "Product not found!",
                    icon: "warning",
                    text: "Try another keyword"
                })
            }
        })
    } */

    return (
        <Container className="mt-5 pt-5">
            <Container className="mb-2">
                <Col xs={12} sm={10} md={8} lg={6}>
                    <Form>
                        <Form.Group className="d-flex gap-2">
                            <Form.Label className="d-flex my-auto">Search</Form.Label>
                            <Form.Control 
                                type='text'
                                required
                                placeholder="Search product"
                            />
                            <Button className="btn btn-primary btn-sm">Search</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Container>
            <Container>
                <Button className="btn btn-primary btn-sm mx-auto">Add Product</Button>
            </Container>
                
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products}
              </tbody>
            </Table>
        </Container>
    )

}

export default AdminView;