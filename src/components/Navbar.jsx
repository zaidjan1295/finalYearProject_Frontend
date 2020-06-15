import React from "react";
import {
    Link
} from "react-router-dom";
import {Navbar, Nav} from 'react-bootstrap';

const NavbarTop = () => {
    return(
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>
                <Link to="/" style={{ color: '#fff' }}>Query Page</Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
                {/* Dummy Left Side Nav */}
            </Nav>
            <Nav.Link>
                <Link to="/queryPage" style={{ color: '#fff' }}>Query Page</Link>
            </Nav.Link>
        </Navbar>
    );
}

export default NavbarTop;