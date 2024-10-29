import { useState } from "react";
import Swal from "sweetalert2";
import { Modal, Button, Form, Container } from "react-bootstrap";

export default function AddProduct({reloadProduct}) {
    const token = localStorage.getItem("token");
    const [images, setImages] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);

    const [showHideModal, setShowHideModal] = useState(false);

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

    const showModal = () => {
        setShowHideModal(true)
    }

    const hideModal = () => {
        setShowHideModal(false)
        setName("");
        setDescription("");
        setPrice(0);
        setImages([]);
    }

    const addProduct = async (e) => {
        e.preventDefault();

        if(!navigator.onLine) {
            Swal.fire({
                title: "No internet connection!",
                icon: "error"
            })
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        images.forEach(image => {
            formData.append('images', image);
        });

        await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
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
            } else if(data.message === "Product already exists"){
                Swal.fire({
                    title: data.message,
                    icon: "warning",
                    timer: 1000,
                    timerProgressBar: true
                })
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
            <Button className="btn btn-primary btn-sm" onClick={showModal}>Add Product</Button>
            <Modal show={showHideModal} onHide={hideModal}  className="mt-5" inert={!showHideModal}>
                <Modal.Header closeButton> 
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => addProduct(e)}>
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
                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <Form.Control 
                                type="file"
                                multiple
                                onChange={e => setImages(Array.from(e.target.files))}
                            />
                        </Form.Group>
                        <Container className="p-0 p-2 mt-3 d-flex gap-5 justify-content-end">
                            <Button className="btn btn-primary" type="submit">Add Product</Button>
                            <Button className="btn btn-warning" onClick={hideModal}>Cancel</Button>
                        </Container>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )


}

