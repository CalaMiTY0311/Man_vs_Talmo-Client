import React from 'react';
import { Container, Navbar, NavbarBrand } from 'reactstrap';

const Header = () => {
    return (
        <div className="header1 po-relative bg-dark" style={{ width: '400px', margin: '0 auto' }}>
            <Container>
                <Navbar className="navbar-expand-lg h2-nav text-center">
                    <NavbarBrand className="mx-auto" style={{ color: '#ffffff' }} href="/">🥚Man vs 탈모😢</NavbarBrand>
                </Navbar>
            </Container>
        </div>
    );
}

export default Header;
