import { Card, Carousel, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import  PropTypes  from "prop-types";
import './style/productCard.css'

export default function ProductCard({props}) {

    const { name, description, price, images, _id } = props;

    return (   
        <Col xs={12} sm={6} md={4} lg={3}>
            <Card className="productCards">
                <Card.Body className="productCardBody">
                    <Carousel className="productCarousel" interval={null} pause='hover'>
                        {
                            images.map((image, index) => {
                                return(
                                    <Carousel.Item key={index} className="productCarouselItem">
                                        <img 
                                            src={`${process.env.REACT_APP_API_BASE_URL}/${image.imagePath}`}
                                            className="d-block carouselImage"
                                            alt={`Slide ${index}`}
                                            />
                                    </Carousel.Item>
                                )
                            })
                        }
                    </Carousel>
                </Card.Body>
                <Card.Footer>
                    <Card.Title>{name}</Card.Title>
                    {/* <Card.Subtitle>Description: </Card.Subtitle> */}
                    <Card.Text className="productCardsText">{description}</Card.Text>
                    <div className="d-flex">
                        <Card.Subtitle className="my-auto productCardsPrice">Price: </Card.Subtitle> &nbsp;
                        <Card.Text className="my-auto price">&#8369;{price.toLocaleString()}</Card.Text>
                        <Link className="btn btn-primary ms-auto viewBtn" to={`/products/${_id}`} variant="primary">View</Link>
                    </div>
                </Card.Footer>
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

