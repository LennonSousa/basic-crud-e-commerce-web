import Link from 'next/link';
import { useContext } from 'react';
import { Button, Col, Container, Form, Nav, Navbar, Row } from 'react-bootstrap';
import { FaBoxOpen, FaDollyFlatbed } from 'react-icons/fa';

import { AuthContext } from '../contexts/authContext';
import styles from '../styles/components/PageHeader.module.css';

export default function PageHeader() {
    const { handleLogout } = useContext(AuthContext);
    return (
        <div className={`bg-dark ${styles.pageHeader}`}>
            <Container>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand>
                        <FaBoxOpen size={28} />{' '}
                    Basic crud E-commerce
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Link href="/dashboard">
                                <a>
                                    <Row className="justify-content-center text-center">
                                        <Col sm={10}>
                                            <FaDollyFlatbed />
                                        </Col>

                                        <Col>
                                            Products
                                </Col>
                                    </Row>
                                </a>
                            </Link>
                        </Nav>

                        <Form inline>
                            <Button variant="outline-light" onClick={handleLogout} >Sign out</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        </div>
    )
}