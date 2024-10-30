
import { useState, useEffect, useContext, useRef } from 'react';
import  UserContext from '../UserContext';
import {Button, Card, Carousel, Container} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useParams, Link} from 'react-router-dom';
import AddToCart from '../components/AddToCart';
import '../styles/productView.css'

const ProductView = () => {
    
    const {user} = useContext(UserContext);
    const [product, setProduct] = useState([]);
    const {id} = useParams();
    const inputQnty = useRef(null);
    const [photos, setPhotos] = useState([]);

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
            if(data.images.length > 0) {
                setPhotos(data.images.map((image, index) => {
                    return(
                        <Carousel.Item key={index} className='prodViewCarouselItem'>
                            <img 
                            src={`${process.env.REACT_APP_API_BASE_URL}/${image.imagePath}`}
                            alt='Product'
                            className="d-block img-fluid prodViewCarouoselImg mt-auto"
                            /> 
                        </Carousel.Item>
                    )
                }))
            }
        })
    }, [id])

   

    return (
        <Container className='mt-5 pt-4 mb-5' id='prodViewCont'>
            <Link className='btn btn-secondary mb-2' to="/">Back</Link>
            <Card id='prodViewCard'> 
                <Card.Body id='prodViewCardBody'>
                    <Container id='prodViewContCarousel'>
                        <Carousel interval={null} pause='hover' id='prodViewCarousel'>
                            {photos}
                        </Carousel>
                    </Container>
                        <Card.Title id='cardTitle'>{product.name}</Card.Title>
                        <Card.Subtitle id='cardSubTitle'>{product.description}</Card.Subtitle>
                </Card.Body>
                <Card.Footer>
                    <Container className='d-flex justify-content-between'>
                        <Card.Text>&#8369; {product.price}</Card.Text>
                        <Card.Text>Total Sold: </Card.Text>
                    </Container>
                        {
                            user.id ?
                            <>
                                <Container className='d-md-flex gap-2'>
                                    <Container className='d-flex gap-2 my-auto'>
                                        <p className='my-auto'>Quantity:</p>
                                        <input 
                                            type="number"
                                            style={{width: '50px', height: '30px'}}
                                            className='text-center form-control my-auto'    
                                            ref={inputQnty}
                                            />
                                            <Button 
                                                className='btn btn-success text-center d-flex justify-content-center my-auto' 
                                                style={{width: '30px', height: '30px', alignItems: 'center'}} 
                                                onClick={addQuantity}
                                            >+</Button>

                                            <Button 
                                                className='btn btn-warning text-center d-flex justify-content-center my-auto' 
                                                style={{width: '30px', height: '30px', alignItems: 'center'}} 
                                                onClick={subtQuantity}
                                            >-</Button>
                                        </Container>
                                    
                                
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