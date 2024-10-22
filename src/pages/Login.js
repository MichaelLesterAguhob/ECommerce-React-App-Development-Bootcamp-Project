import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {

	const { user, setUser } = useContext(UserContext);

	const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);

    function authenticate(e) {
        e.preventDefault();
		fetch('http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/users/login',{
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
        	    text: "Welcome to Ecommerce! Site"
        	});
            <Navigate to="/" />
		} 
        else if(data.message === "Invalid Email"){
			Swal.fire({
                title: "Invalid",
                icon: "warning",
                text: "Invalid Email Format!"
            });
		}
        else if(data.message === "Email and password do not match"){
			Swal.fire({
                title: "Login Failed",
                icon: "error",
                text: "Email and password do not match!"
            });
		}
        else {
          
			Swal.fire({
                title: "Authentication failed",
                icon: "error",
                text: "Check your login details and try again."
            });
		}
	})

	setEmail('');
	setPassword('');

    }


    const retrieveUserDetails = (token) => {
        fetch('http://ec2-3-16-152-230.us-east-2.compute.amazonaws.com/b8/users/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
              id: data.user._id,
              isAdmin: data.isAdmin
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
    	(user.id !== null) ?

			<Navigate to="/" />

			:
	    	
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

	            <Form.Group controlId="password">
	                <Form.Label>Password</Form.Label>
	                <Form.Control 
	                    type="password" 
	                    placeholder="Password"
	                    value={password}
            			onChange={(e) => setPassword(e.target.value)}
	                    required
	                />
	            </Form.Group>

	             { isActive ? 
	                <Button variant="primary" type="submit" id="submitBtn">
	                    Login
	                </Button>
	                : 
	                <Button variant="secondary" type="submit" id="submitBtn" disabled>
	                    Login
	                </Button>
	            }
	        </Form>
    )
}