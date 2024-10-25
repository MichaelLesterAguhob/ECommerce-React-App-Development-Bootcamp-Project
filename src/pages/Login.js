import { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import UserContext from '../UserContext';


export default function Login() {

	const { user, setUser } = useContext(UserContext);

	const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);


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

    function authenticate(e) {
        e.preventDefault();

        if(!navigator.onLine) {
            Swal.fire({
                title: "No internet connection!",
                icon: "error"
            })
            return;
        }
     
		fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`,{
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: email,
			password: password
		})
	})
	.then(res => res.json())
	.then(data => {
		
		if(data.access){
			localStorage.setItem('token', data.access);
			retrieveUserDetails(data.access);
			Swal.fire({
        	    title: "Login Successful",
        	    icon: "success",
        	    text: "Welcome to Ecommerce! Site",
                timer: 2000,
                timerProgressBar: true
        	});
            // <Navigate to="/" />
		} 
        else if(data.message === "Invalid Email"){
			Swal.fire({
                title: "Invalid",
                icon: "warning",
                text: "Invalid Email Format!",
                timer: 1500,
                timerProgressBar: true
            });
		}
        else if(data.message === "Email and password do not match"){
			Swal.fire({
                title: "Login Failed",
                icon: "error",
                text: "Email and password do not match!",
                timer: 1500,
                timerProgressBar: true
            });
		}
        else {
			Swal.fire({
                title: "Authentication failed",
                icon: "error",
                text: "Check your login details and try again.",
                timer: 1500,
                timerProgressBar: true
            });
		}
	})

	setEmail('');
	setPassword('');

    }


    const retrieveUserDetails = (token) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin
            });
        })
    };

    useEffect(() => {
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);

   
    return (
    	    (user.id !== null && localStorage.getItem('token') !== null) ?
		        <Navigate to="/" />
			:
            <Row className='d-flex justify-content-center mt-5'>
                <Col xs={12} sm={10} md={8} lg={6} 
                    className='p-4 rounded mt-5'
                    style={{border: '1px solid #6C757D'}}>
                    <Form onSubmit={(e) => authenticate(e)}>
                        <h1 className="my-5 text-center">Login</h1>
                        <Form.Group controlId="userEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className='mt-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Container className='d-flex justify-content-center mt-5 gap-4'>
                            { isActive ? 
                                <Button className="btn btn-primary" type="submit" id="submitBtn">
                                    Login
                                </Button>
                                : 
                                <Button variant="secondary" type="submit" id="submitBtn" disabled>
                                    Login
                                </Button>
                            }
                            <Link className="btn btn-success" to="/register">
                                    Go to Register
                            </Link>
                        </Container>
                    </Form>
                </Col>
            </Row>
    )
}