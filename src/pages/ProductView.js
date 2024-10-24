
import { useState, useEffect, useContext } from 'react';
import  UserContext from '../UserContext';
import {Card, Container} from 'react-bootstrap';
import { useParams, Link} from 'react-router-dom';
import AddToCart from '../components/AddToCart';

const ProductView = () => {

    const {user} = useContext(UserContext);
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(0);
    const {id} = useParams();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`)
        .then(res=>res.json())
        .then(data => {
            setProduct(data);
        })
    }, [id])


    useEffect(() => {
        if(quantity < 0) {
            setQuantity(1);
        } 
    }, [quantity])

    return (
        <Container className='mt-5 pt-5'>
            <Link className='btn btn-secondary mb-2' to="/">Back</Link>
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
                        {
                            user.id ?
                            <>
                                <Container className='d-flex gap-2'>
                                    <p className='my-auto'>Quantity:</p>
                                    <input 
                                        type="number"
                                        style={{width: '70px'}}
                                        className='text-center form-control'
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        />
                                    <AddToCart  product={product} quantity={quantity} setQuantity={setQuantity}/>
                                </Container>
                            </>
                            :
                            <Link className='btn btn-primary' to="/login">Login to add to cart</Link>
                        }
                </Card.Footer>
            </Card>
        </Container>
    )
}


export default ProductView;