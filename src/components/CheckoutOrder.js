
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import { useEffect } from "react";

export default function CheckoutOrder({isEmpty, setRefresh, showModal, confirmCheckout, setAction}) {
    const token = localStorage.getItem("token");
    
    useEffect(() => {
        if(confirmCheckout === true) {
            checkoutOrder();
        }
    }, [confirmCheckout])


    function checkoutOrder() {

        if(!navigator.onLine) {
            Swal.fire({
                title: "No internet connection!",
                icon: "error"
            })
            return
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json', 
                    Authorization: `Bearer ${token}`
                }
        })
        .then(res => res.json())
        .then(data => {
           if(data.message === "Ordered Successfully") {
                setRefresh(true);
                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    timer: 1000,
                    timerProgressBar: true 
                })
                //will navigate to orders
           } else if(data.message === "No cart found") {
                Swal.fire({
                    title: data.message,
                    icon: 'warning',
                    timer: 1000,
                    timerProgressBar: true 
                })
           } else {
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    timer: 1000,
                    timerProgressBar: true 
                })
           }
        })
    }

   return(
            isEmpty === true?
            <Button className="btn btn-success" disabled>Checkout Order</Button>
             :
            <Button className="btn btn-success" onClick={() => {showModal(true); setAction('checkout')}}>Checkout Order</Button>

   )
}