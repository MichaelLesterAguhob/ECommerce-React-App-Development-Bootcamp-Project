
import { useState, useEffect } from "react";
import React from "react";
import {Row} from "react-bootstrap";
import ProductCard from "./ProductCard";


const UserView = ({productsData}) => {
    const [products, setProducts] = useState([]);

    // determine if product collection is not empty
    //use if
    useEffect( () => {
        setProducts(productsData.map(product => {
            return <ProductCard key={product._id} props={product}/>
        }))
    }, [productsData])

    return (
        <>
            <Row className="g-2 mt-4">
                {products}
            </Row>
        </>
    )

}

export default UserView;