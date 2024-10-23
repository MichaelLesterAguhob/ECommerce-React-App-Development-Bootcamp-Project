import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Button, Container } from "react-bootstrap";

export default function AddToCart({product, quantity, setQuantity}) {
    const token = localStorage.getItem("token");
    
    const [productId, setProductId] = useState('');
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        setProductId(product._id);
    }, [product._id])

    useEffect(() => {
        if(quantity < 0) {
            setQuantity(1);
        } else {
            let stotal = quantity * product.price;
            setSubtotal(stotal);   
        }
    }, [quantity])

    function addToCart(){
        fetch(`http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/cart/add-to-cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity,
                subtotal: subtotal
            })
        })
        .then(res=>res.json())
        .then(data => {
            if(data.message === "Item added to cart successfully") {
                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    timer: 1500,
                    timerProgressBar: true
                })
                setQuantity(0);
            } else {
                Swal.fire({
                    title: 'Please enter quantity',
                    icon: 'warning',
                    timer: 1500,
                    timerProgressBar: true
                })
            }
        })
    }

   return(
    <Button onClick={() => addToCart()}>Add to Cart</Button>

   )
}