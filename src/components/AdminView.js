
import { useState, useEffect } from "react";
import React from "react";
import {Button, Col, Container, Form, Table} from "react-bootstrap";
import Swal from "sweetalert2";
import EditProduct from "./EditProduct";
import AddProduct from "./AddProduct";

const AdminView = ({productsData, reloadProduct}) => {
    const [products, setProducts] = useState([]);
    const [toSearch, setToSearch] = useState("");
    const [searchMode, setSearchMode] = useState(false);

    function archiveProduct(productId) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/archive`, {
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
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/activate`, {
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

    useEffect(() => {
            if(searchMode && toSearch === "") {
                reloadProduct();
                setSearchMode(false);
            } 
   }, [toSearch])

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
                        <EditProduct product={product} reloadProduct={reloadProduct}/>
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

    
    function searchProduct(e) {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/search-by-name`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: toSearch
            }),
        })
        .then(res => res.json())
        .then(data => {
            if(data.length > 0) {
                setProducts(data.map((product, index) => {
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
                                <EditProduct product={product} reloadProduct={reloadProduct}/>
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
                setSearchMode(true);
            } else {
                Swal.fire({
                    title: "Product not found!",
                    icon: "warning",
                    text: "Try another keyword"
                })
            }
        })
    }

    return (
        <Container className="mt-5 mb-5 p-0 pt-3">
            <h1>Products</h1>
            <Container className="mb-2">
                <Col xs={12} sm={10} md={8} lg={6}>
                    <Form onSubmit={e => searchProduct(e)}>
                        <Form.Group className="d-flex gap-2">
                            <Form.Label className="d-flex my-auto">Search</Form.Label>
                            <Form.Control 
                                type='text'
                                required
                                placeholder="Search here..."
                                value={toSearch}
                                onChange={(e) => setToSearch(e.target.value)}
                            />
                            <Button className="btn btn-primary btn-sm" type="submit">Search</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Container>
            <Container className="mt-3 p-0 mb-2 d-md-flex justify-content-end">
                <AddProduct reloadProduct={reloadProduct}/>
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