import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { Link, NavLink } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavbar() {
	const { user } = useContext(UserContext);

	return(
		<Navbar bg="secondary" expand="lg" fixed="top">
			<Container fluid>
			    <Navbar.Brand as={Link} to="/" className='text-light'>Ecommerce</Navbar.Brand>
			    <Navbar.Toggle aria-controls="basic-navbar-nav" />
			    <Navbar.Collapse id="basic-navbar-nav">
				    <Nav className="ms-auto" >
				        <Nav.Link className='text-light' as={NavLink} to="/" exact="true">Products</Nav.Link>
                        {
                            user.isAdmin === false ?
                            <>
                                <Nav.Link className='text-light' as={NavLink} to="/cart" exact="true">Cart</Nav.Link>
                                <Nav.Link className='text-light' as={NavLink} to="/orders" exact="true">Orders</Nav.Link>
                            </>
                            :
                            null
                        }
                        { 
                            user.isAdmin ?
                            <Nav.Link className='text-light' as={Link} to="/all-users">Users</Nav.Link>
                            :
                            null
                        }
				        {
                            user.id ? 
								<>  
                                    <Nav.Link className='text-light' as={Link} to="/details">Profile</Nav.Link>
									<Nav.Link className='text-center text-light bg-danger rounded mx-lg-5' as={Link} to="/logout">Logout</Nav.Link>
								</>
							: 
								<>
									<Nav.Link className='text-light' as={Link} to="/login">Login</Nav.Link>
									<Nav.Link className='text-light' as={Link} to="/register">Register</Nav.Link>
								</>
						}
				    </Nav>
			    </Navbar.Collapse>
			</Container>
		</Navbar>
		)
}