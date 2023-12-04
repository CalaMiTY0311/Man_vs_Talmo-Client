import React from 'react';
import { Container, Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';

const Header = () => {
    return (
        <div className="header1 po-relative bg-dark" style={{ width: '30%', margin: '0 auto' }}>
            <Container>
                <Navbar className="navbar-expand-lg h2-nav">
                    <NavbarBrand style={{ color: '#ffffff' }}>🥚Man vs 탈모😢</NavbarBrand>
                    <Nav navbar className="ms-auto mt-2 mt-lg-0">
                        <NavItem><a className="btn btn-outline-info" href="/">Home</a></NavItem>
                    </Nav>
                </Navbar>
            </Container>
        </div>
    );
}

export default Header;