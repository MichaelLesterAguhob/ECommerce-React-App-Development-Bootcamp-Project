
import { useState, useEffect } from "react";
import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import ProductCard from "./ProductCard";
import Swal from "sweetalert2";

const UserView = ({productsData, reloadProduct}) => {
    const [products, setProducts] = useState([]);
    const [toSearch, setToSearch] = useState("");
    const [searchMode, setSearchMode] = useState(false);

    useEffect(() => {
            if(searchMode && toSearch === "") {
                    reloadProduct();
                    setSearchMode(false);
                }
    }, [searchMode, toSearch])

    useEffect( () => {
        setProducts(productsData.map(product => {
            return <ProductCard key={product._id} props={product}/>
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
    }

    return (
        <>
            <Row className="mt-5">
                <Col  xs={12} sm={6} lg={6} className="mt-2">
                    <Form onSubmit={(e) => {searchProduct(e)}}>
                        <Form.Group className="d-flex gap-2">
                            <Form.Label className="my-2">Search</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter product keyword"
                                required
                                value={toSearch}
                                onChange={e => {setToSearch(e.target.value)}}
                                />
                            <Button type="submit">Search</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row className="g-2 mt-4">
                {products}
            </Row>
        </>
    )

}

export default UserView;