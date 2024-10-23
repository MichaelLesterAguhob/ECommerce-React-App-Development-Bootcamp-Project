
import { useState, useEffect, useContext, useRef } from 'react';
import  UserContext from '../UserContext';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import { useParams, Link} from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Profile() {

    const token = localStorage.getItem('token');
    const [fname, setFname] = useState("")
    const [Lname, setLname] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [password, setPassword] = useState("")

    const fnameRef = useRef(null);
    const btnSave = useRef(null);
    const [editMode, setEditMode] = useState(false);
    useEffect(() => {
        if (fnameRef.current) {
            if (editMode) {
                btnSave.current.removeAttribute('disabled');
                fnameRef.current.removeAttribute('readOnly');
                fnameRef.current.focus();
            } else {
                fnameRef.current.setAttribute('readOnly', 'true');
                btnSave.current.setAttribute('disabled', 'true');
            }
        }
    }, [editMode])

    

    useEffect(() => {
        fetch('http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/users/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setFname(data.user.firstName);
            setLname(data.user.lastName);
            setEmail(data.user.email);
            setMobile(data.user.mobileNo);
            setPassword(data.user.password)
        })
    }, [])

    return (
        <Container className='mt-5 pt-5 pb-5' >
                    <h1 className='d-flex justify-content-md-center mb-3'>Your Profile</h1>
                <Row className='d-flex justify-content-center'>
                    <Col xs={12} sm={10} md={8} lg={6} 
                        className='p-4 rounded'
                        style={{border: '1px solid #6C757D'}}>
                        <Form className='m-auto'>
                            <Form.Group>
                                <Form.Label>First Name: </Form.Label>
                                <Form.Control 
                                    type='text'
                                    ref={fnameRef}
                                    value={fname}
                                    onChange={e => setFname(e.target.value)}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Last Name: </Form.Label>
                                <Form.Control 
                                    type='text'
                                    value={Lname}
                                    onChange={e => setLname(e.target.value)}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email: </Form.Label>
                                <Form.Control 
                                    type='text'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Mobile: </Form.Label>
                                <Form.Control 
                                    type='text'
                                    value={mobile}
                                    onChange={e => setMobile(e.target.value)}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password: </Form.Label>
                                <Form.Control 
                                    type='password'
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    readOnly
                                />
                            </Form.Group>
                            <Container className='d-flex justify-content-end gap-3'>
                                <Button className='btn btn-success mt-3' disabled ref={btnSave}>Save Changes</Button>

                                {
                                    editMode ? 
                                    <Button className='btn btn-warning mt-3' onClick={e => setEditMode(false)}>Cancel Editing</Button>
                                    : 
                                    <Button className='btn btn-primary mt-3' onClick={e => setEditMode(true)}>Edit Details</Button>
                                }
                            </Container>
                        </Form>
                    </Col>
                </Row>
        </Container>
    )
}
