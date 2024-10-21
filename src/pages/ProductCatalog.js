import { useContext, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import {Navigate} from 'react-router-dom'

export default function ProductCatalog() {
   
    const {user} = useContext(UserContext);

    return (
        user.id === null ?
        <Navigate to="/login"/>
        :
        <Row>
            <Col className="mt-5 pt-5 text-center mx-auto">
                <h1>Welcome to Ecommerce App</h1>
                <Link className="btn btn-primary" to="/games">Browse Product</Link>
            </Col>
        </Row>
    )
}