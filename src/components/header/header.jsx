import React from 'react';
import { Container, Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';

const Header = () => {
    // const headerContainerStyle = {
    //     width: '40%',
    //     margin: '0 auto',
    //     backgroundColor: 'black',
    //     padding: '20px',
    // };

    return (
        // <div id="section" style={headerContainerStyle}>
            <div className="header1 po-relative bg-dark" style={{ width: '40%', margin: '0 auto' }}>
                <Container>
                    <Navbar className="navbar-expand-lg h2-nav">
                        <NavbarBrand href="#">🥚 😢</NavbarBrand>
                        <Nav navbar className="ms-auto mt-2 mt-lg-0">
                            <NavItem><a className="btn btn-outline-info" href="/">Home</a></NavItem>
                        </Nav>
                    </Navbar>
                </Container>
            </div>
        /* </div> */
    );
}

export default Header