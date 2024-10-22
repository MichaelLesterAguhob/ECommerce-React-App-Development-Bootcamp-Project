
import { useState, useEffect } from 'react';
import {Card, Carousel, Button, Container} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProductView = () => {

    const [product, setProduct] = useState({});
    const {id} = useParams();

    useEffect(() => {
        fetch(`http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/products/${id}`)
        .then(res=>res.json())
        .then(data => {
            setProduct(data);
        })
    }, [id])


    return (
        <Container className='mt-5 pt-5'>
            <Card style={{ minHeight: '500px', height: '500px' }}> 
                <Card.Body>
                    <Container style={{minHeight: '70%'}}>
                        Space for Image
                    </Container>
                        <Card.Title style={{minHeight: '12%'}}>{product.name}</Card.Title>
                        <Card.Subtitle style={{minHeight: '18%'}}>{product.description}</Card.Subtitle>
                </Card.Body>
                <Card.Footer>
                    <Container className='d-flex justify-content-between'>
                        <Card.Text>&#8369; {product.price}</Card.Text>
                        <Card.Text>Total Sold: </Card.Text>
                    </Container>
                    <Button>Add to cart</Button>
                </Card.Footer>
            </Card>
        </Container>
    )
}


export default ProductView;