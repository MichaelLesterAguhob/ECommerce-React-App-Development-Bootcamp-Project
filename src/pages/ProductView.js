
import { useState, useEffect, useContext, useRef } from 'react';
import  UserContext from '../UserContext';
import {Button, Card, Container, Toast} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useParams, Link} from 'react-router-dom';
import AddToCart from '../components/AddToCart';

const ProductView = () => {
    
    const {user} = useContext(UserContext);
    const [product, setProduct] = useState({});
    const {id} = useParams();
    const inputQnty = useRef(null);
    
    let isNotified = false;
    setInterval(() => {
        if(!navigator.onLine) {
            if(!isNotified) {
                Swal.fire({
                    title: "No internet connection!",
                    icon: "error"
                })
                isNotified = true;
            }
            return;
        } else {
            isNotified = false;
        }
    }, 1000)

    if(inputQnty.current) {
        inputQnty.current.value = 1
    }

    const addQuantity = () => {
        if(inputQnty.current) {
            inputQnty.current.value = parseInt(inputQnty.current.value) + 1;
        }
    }

    const subtQuantity = () => {
        if(inputQnty.current) {
            if(inputQnty.current.value > 1) inputQnty.current.value = parseInt(inputQnty.current.value) - 1;
        }
    }

    useEffect(() => {
        if(!navigator.onLine) {
          
                Swal.fire({
                    title: "No internet connection!",
                    icon: "error"
                })
            return;
        }
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`)
        .then(res=>res.json())
        .then(data => {
            setProduct(data);
        })
    }, [])

    return (
        <Container className='mt-5 pt-5 mb-5' >
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
                                        style={{width: '50px', height: '30px'}}
                                        className='text-center form-control my-auto'    
                                        ref={inputQnty}
                                        />
                                        <Button className='btn btn-success text-center d-flex justify-content-center my-auto' style={{width: '30px', height: '30px', alignItems: 'center'}} onClick={addQuantity}>+</Button>
                                        <Button className='btn btn-warning text-center d-flex justify-content-center my-auto' style={{width: '30px', height: '30px', alignItems: 'center'}} onClick={subtQuantity}>-</Button>
                                
                                    <AddToCart  product={product} inputQnty={inputQnty}/>
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