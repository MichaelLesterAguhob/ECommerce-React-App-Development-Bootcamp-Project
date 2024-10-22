import { Card, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import  PropTypes  from "prop-types";

export default function ProductCard({props}) {

    const { name, description, price, _id } = props;

    return (   
        <Col xs={12} sm={6} md={4}>
            <Card>
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Subtitle>Description: </Card.Subtitle>
                    <Card.Text>{description}</Card.Text>
                    <Card.Subtitle>Price: </Card.Subtitle>
                    <Card.Text>&#8369; {price}</Card.Text>
                    <Link className="btn btn-primary" to={`/products/${_id}`} variant="primary">Details</Link>
                </Card.Body>
            </Card>
         </Col>
    )
       

     
}

ProductCard.propTypes = {
    props: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    })
}

