import Link from 'next/link';
import { Container, Row, Col, Nav, Navbar, Form, Button } from 'react-bootstrap';
import { FaDollyFlatbed, FaBoxOpen } from 'react-icons/fa';

import styles from '../styles/components/PageHeader.module.css'

export default function PageHeader() {
    return (
        <div className={`bg-dark ${styles.pageHeader}`}>
            <Container>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand>
                        <FaBoxOpen size={28}/>{' '}
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
                            <Button variant="outline-light" >Sair</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        </div>
    )
}