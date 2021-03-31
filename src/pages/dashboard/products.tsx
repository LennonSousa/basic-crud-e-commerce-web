import { useState } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Button, Form, Image, Modal, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaPause, FaPlay, FaPencilAlt, FaTrashAlt, FaPlus } from 'react-icons/fa';

import PageHeader from '../../components/PageHeader';

import styles from '../../styles/pages/Products.module.css';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    description: Yup.string().required('Required!'),
    price: Yup.string().required('Required'),
});

export default function Home() {
    const [showModalProduct, setShowModalProduct] = useState(false);

    const handleCloseModalProduct = () => setShowModalProduct(false);
    const handleShowModalProduct = () => setShowModalProduct(true);

    return (
        <>
            <PageHeader />
            <Container className="content-page">
                <Row>
                    <Col>
                        <Button title="Create a product" onClick={handleShowModalProduct} variant="outline-info">
                            <FaPlus /> product
                        </Button>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3" style={{ minHeight: 800 }}>
                    <Col>
                        <ListGroup>
                            <ListGroup.Item action variant="danger" as="a">
                                <Row className="align-items-center">
                                    <Col>
                                        Product 01
                                    </Col>

                                    <Col sm={2}>
                                        <Button title="Pause product" variant="outline-danger">
                                            <FaPlay />
                                        </Button>
                                    </Col>

                                    <Col sm={2}>
                                        <Button title="Edit product" variant="outline-info">
                                            <FaPencilAlt />
                                        </Button>
                                    </Col>

                                    <Col sm={2}>
                                        <Button title="Delete product" variant="outline-info">
                                            <FaTrashAlt />
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item action variant="light" as="a">
                                <Row className="align-items-center">
                                    <Col>
                                        Product 01
                                    </Col>

                                    <Col sm={2}>
                                        <Button title="Pause product" variant="outline-info">
                                            <FaPause />
                                        </Button>
                                    </Col>

                                    <Col sm={2}>
                                        <Button title="Edit product" variant="outline-info">
                                            <FaPencilAlt />
                                        </Button>
                                    </Col>

                                    <Col sm={2}>
                                        <Button title="Delete product" variant="outline-info">
                                            <FaTrashAlt />
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModalProduct} onHide={handleCloseModalProduct}>
                <Modal.Header>
                    <Modal.Title>
                        Create a product
          </Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={{
                        name: '',
                        description: '',
                        price: 0,
                    }}
                    onSubmit={async values => {
                    }}
                    validationSchema={validationSchema}
                    isInitialValid={false}
                >
                    {({ handleChange, handleSubmit, values, errors, isValid, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Row className="mb-3">
                                    <Col>
                                        <Button title="Add a product image" variant="secondary">
                                            <Row>
                                                <Col>
                                                    <FaPlus />
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col>
                                                    image
                                                </Col>
                                            </Row>
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-4" controlId="formLogintEmail">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.name}
                                                name="name"
                                                isInvalid={!!errors.name}
                                            />
                                            {touched.name && <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>}
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="formLogintEmail">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control type="text"
                                                as="textarea"
                                                rows={3}
                                                onChange={handleChange}
                                                value={values.description}
                                                name="description"
                                                isInvalid={!!errors.description}
                                            />
                                            {touched.description && <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>}
                                        </Form.Group>

                                        <Form.Group className="mb-4" controlId="formLogintEmail">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.price}
                                                name="price"
                                                isInvalid={!!errors.price}
                                            />
                                            {touched.price && <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="info" disabled={isValid ? false : true} type="submit">
                                    Create
                                </Button>
                                <Button variant="secondary" onClick={handleCloseModalProduct}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    )
}