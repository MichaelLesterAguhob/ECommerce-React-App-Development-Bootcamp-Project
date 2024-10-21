import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {

	const {user} = useContext(UserContext);

	const [firstName, setFirstName] = useState("");
	const [lastName, setlastName] = useState("");
	const [email, setEmail] = useState("");
	const [mobileNo, setmobileNo] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

    const [isActive, setIsActive] = useState(false);

	function clearInputs() {
        setFirstName('');
        setlastName('');
        setmobileNo('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

	function registerUser(e) {
		// Prevents page redirection via form submission
		e.preventDefault();
		fetch('http://localhost:4008/b8/users/register',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                mobileNo: mobileNo
            })
		})
		.then(res => res.json())
		.then(data => {
            if(data.message === "User registered successfully"){
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                //  <Navigate to='/login'/>
                Swal.fire({
                    title: "Success!",
                    icon: "success",
                    text: "Registered Successfully"
                });
            } 
            else if(data.message === "Email already exists."){
                Swal.fire({
                    title: "Invalid!",
                    icon: "warning",
                    text: "Email Already Used!" 
                });
            } 
            else if(data.message === "Invalid email format."){
                Swal.fire({
                    title: "Invalid!",
                    icon: "warning",
                    text: "Invalid Email Format!" 
                });
            } 
            else if(data.message === "Mobile number is invalid."){
                Swal.fire({
                    title: "Invalid!",
                    icon: "warning",
                    text: "Mobile number is invalid!" 
                });
            } 
            else if(data.message === "Password must be atleast 8 characters long."){
                Swal.fire({
                    title: "Invalid!",
                    icon: "warning",
                    text: " Password must be atleast 8 characters long." 
                });
            } 
            else {
                console.log(data);
                Swal.fire({
                    title: "Something went wrong.",
                    icon: "error",
                    text: "Contact Admin"
                });
            }
		})
	}
    
   

	useEffect(()=>{
		if((firstName !== "" && lastName !== "" && email !== "" && password !=="" && confirmPassword !=="") && mobileNo !== "" && (password === confirmPassword)){
			setIsActive(true)
		} else {
			setIsActive(false)
		}
	},[firstName, lastName, email, mobileNo, password, confirmPassword])

	return (

		(user.id !== null) ?
		    <Navigate to="/" />
		:
			<Form onSubmit={(e) => registerUser(e)}>
			<h1 className="my-5 text-center">Register</h1>

                <Form.Group>
					<Form.Label>First Name:</Form.Label>
					<Form.Control 
					type="text"
					placeholder="Enter First Name" 
					required 
					value={firstName} 
					onChange={e => {setFirstName(e.target.value)}}/>
				</Form.Group>
                <Form.Group>
					<Form.Label>Last Name:</Form.Label>
					<Form.Control 
					type="text"
					placeholder="Enter Last Name" 
					required 
					value={lastName} 
					onChange={e => {setlastName(e.target.value)}}/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Email:</Form.Label>
					<Form.Control 
					type="email"
					placeholder="Enter Email" 
					required 
					value={email} 
					onChange={e => {setEmail(e.target.value)}}/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Mobile Number:</Form.Label>
					<Form.Control 
					type="text"
					placeholder="Enter Mobile Number" 
					required 
					value={mobileNo} 
					onChange={e => {setmobileNo(e.target.value)}}/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Password:</Form.Label>
					<Form.Control 
					type="password" 
					placeholder="Enter Password" 
					required 
					value={password} 
					onChange={e => {setPassword(e.target.value)}}/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Confirm Password:</Form.Label>
					<Form.Control 
					type="password" 
					placeholder="Confirm Password" 
					required 
					value={confirmPassword} 
					onChange={e => {setConfirmPassword(e.target.value)}}/>
				</Form.Group>
				{
					isActive ? 
                    <Button variant="primary" type="submit">Submit</Button>
					: 
                    <Button variant="primary" disabled>Submit</Button>
				}
			</Form>
		
		)
}