import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";

export default function AddToCart({product, inputQnty}) {
    const token = localStorage.getItem("token");
    const [productId, setProductId] = useState('');
  
    
    useEffect(() => {
        setProductId(product._id);
    }, [product._id])


    function addToCart(){
        if(!navigator.onLine) {
            Swal.fire({
                title: "No internet connection!",
                icon: "error"
            })
            return;
        }
        
        let quantity = 0;
        if(inputQnty.current) {
            quantity = parseInt(inputQnty.current.value)
        }

        if(!quantity || quantity <= 0) {
            return (
                Swal.fire({
                    title: 'Please enter quantity12121',
                    icon: 'warning',
                    timer: 1500,
                    timerProgressBar: true
                })
            )
        } else {
            let subtotal = quantity * product.price;
            fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
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
                    inputQnty.current.value = 1;
                    Swal.fire({
                        title: data.message,
                        icon: 'success',
                        timer: 1500,
                        timerProgressBar: true
                    })
                } else {
                    console.log(data)
                    Swal.fire({
                        title: 'Please enter quantity',
                        icon: 'warning',
                        timer: 1500,
                        timerProgressBar: true
                    })
                }
            })
        }
        
    }

   return(
    <Button onClick={() => addToCart()} className="ms-auto addToCartBtn">Add to Cart</Button>

   )
}