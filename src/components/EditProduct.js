import { useState } from "react";
import {Modal, Button, Form, Container} from "react-bootstrap";
import Swal from "sweetalert2";

export default function EditProduct ({product, reloadProduct}) {

    const productId = product._id;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);

    const [showHideModal, setShowHideModal] = useState(false);

    const showModal = () => {
        setShowHideModal(true)
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
    }

    const hideModal = () => {
        setShowHideModal(false)
    }

    const updateProduct = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: price
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success === true) {
                Swal.fire({
                    title: data.message,
                    icon: "success",
                    timer: 1000,
                    timerProgressBar: true
                })
                hideModal();
            } else {
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    timer: 1000,
                    timerProgressBar: true
                })
                hideModal();
            }
            reloadProduct();
        })
    }

    return (
        <>
            <button 
                className="btn btn-primary btn-sm me-2"
                onClick={() =>  showModal()}
            >
                Edit
            </button>
            <Modal show={showHideModal} onHide={hideModal} className="mt-5">
                <Modal.Header closeButton> 
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => updateProduct(e)}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text"
                                required
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control 
                                type="text"
                                required
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                            />
                        </Form.Group>
                        <Container className="p-0 p-2 mt-3 d-flex gap-5 justify-content-end">
                            <Button className="btn btn-primary" type="submit">Update</Button>
                            <Button className="btn btn-warning" onClick={hideModal}>Cancel</Button>
                        </Container>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}




