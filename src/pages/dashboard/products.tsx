import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { Formik } from 'formik';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Modal, Row, Spinner, Toast } from 'react-bootstrap';
import { FaPlus, FaTimes } from 'react-icons/fa';
import * as Yup from 'yup';

import PageHeader from '../../components/PageHeader';
import ProductItem from '../../components/Products';
import { AuthContext } from '../../contexts/authContext';
import { ProductsContext } from '../../contexts/productsContext';

import api from '../../services/api';
import styles from '../../styles/pages/Products.module.css';
import InputMask from '../../components/InputMask';


const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    description: Yup.string().required('Required!'),
    price: Yup.string().required('Required'),
});

export default function Products() {
    const router = useRouter();

    const { loading } = useContext(AuthContext);
    const { products, handleProducts } = useContext(ProductsContext);

    const [showModalProduct, setShowModalProduct] = useState(false);

    const [price, setPrice] = useState(0.00);

    const handleCloseModalProduct = () => setShowModalProduct(false);
    const handleShowModalProduct = () => { setShowModalProduct(true); setImagesToSave([]); setImagesPreview([]) };

    const [imagesToSave, setImagesToSave] = useState<File[]>([]);
    const [imagesPreview, setImagesPreview] = useState<string[]>([]);

    const [productSaving, setProductSaving] = useState(false);

    const [showErrorProduct, setShowErrorProduct] = useState(false);
    const toggleShowErrorProduct = () => setShowErrorProduct(!showErrorProduct);

    useEffect(() => {
        if (!loading) {
            api.get('products',
                {
                    validateStatus: function (status) {
                        return status < 500; // Resolve only if the status code is less than 500.
                    },
                }
            ).then(res => {
                if (res.status === 401) {
                    return router.replace('/');
                }

                handleProducts(res.data);
            })
                .catch(err => {
                    console.log('error get products');
                    console.log(err);
                });
        }

    }, [loading]);

    function handleImages(event: ChangeEvent<HTMLInputElement>) {
        const image = event.target.files[0];

        setImagesToSave([...imagesToSave, image]);

        const imagesToPreview = URL.createObjectURL(image);

        setImagesPreview([...imagesPreview, imagesToPreview]);
    }

    function handleDeleteImagePreview(indexToDelete: number) {
        setImagesToSave(imagesToSave.filter((image, index) => {
            return index !== indexToDelete
        }));

        setImagesPreview(imagesPreview.filter((image, index) => {
            return index !== indexToDelete
        }));
    }

    return (
        <>
            <PageHeader />
            <Container className="content-page">
                <Row>
                    <Col>
                        <Button title="Create a product" onClick={handleShowModalProduct} variant="outline-info">
                            <FaPlus /> Product
                        </Button>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-3" style={{ minHeight: 800 }}>
                    <Col>
                        <ListGroup>
                            {
                                products.map((product, index) => {
                                    return <ProductItem key={product.id} product={product} />
                                })
                            }
                        </ListGroup>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModalProduct} onHide={handleCloseModalProduct}>
                <Modal.Header>
                    <Modal.Title>Create a product</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={{
                        name: '',
                        description: '',
                        price: 0,
                    }}
                    onSubmit={async values => {
                        setProductSaving(true);

                        try {
                            const data = new FormData();

                            data.append('name', values.name);
                            data.append('description', values.description);
                            data.append('price', String(values.price));

                            imagesToSave.forEach(image => {
                                data.append('images', image);
                            });

                            await api.post('products', data);

                            const res = await api.get('products');

                            handleProducts(res.data);

                            handleCloseModalProduct();

                            setPrice(0);
                        }
                        catch {
                            toggleShowErrorProduct();
                        }

                        setProductSaving(false);
                    }}
                    validationSchema={validationSchema}
                    isInitialValid={false}
                >
                    {({ handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Row className="mb-3">
                                    {
                                        imagesPreview.map((image, index) => {
                                            return (
                                                <div key={index} className={styles.imagePreviewContainer}>
                                                    <button
                                                        type="button"
                                                        title="Delete image"
                                                        onClick={() => { handleDeleteImagePreview(index) }}
                                                    >
                                                        <FaTimes size={14} />
                                                    </button>
                                                    <img
                                                        src={image}
                                                        className={styles.imagePreview}
                                                        alt={`Image Preview ${index}`}
                                                    />
                                                </div>
                                            )
                                        })
                                    }

                                    <label htmlFor="image[]" className={styles.productImageButton}>
                                        <Row>
                                            <Col>
                                                <FaPlus />
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col>
                                                Image
                                                </Col>
                                        </Row>
                                        <input type="file" accept=".jpg, .jpeg, .png" onChange={handleImages} id="image[]" />
                                    </label>
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

                                        <Form.Row className="mt-4">
                                            <Col className="col-4">
                                                <InputMask
                                                    mask="currency"
                                                    prefix="$"
                                                    defaultValue={Intl.NumberFormat('us', { minimumFractionDigits: 2 }).format(price)}
                                                    onBlur={(e: any) => {
                                                        setPrice(e.target.value);
                                                        setFieldValue('price', Number(e.target.value.replace('.', '').replace(',', '.')))
                                                    }}
                                                    name="price"
                                                />
                                                {touched.price && <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>}
                                            </Col>
                                        </Form.Row>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <div
                                    aria-live="polite"
                                    aria-atomic="true"
                                    style={{
                                        position: 'absolute',
                                        left: 10,
                                        bottom: 10,
                                        zIndex: 9999
                                    }}
                                >
                                    <Toast onClose={toggleShowErrorProduct} show={showErrorProduct} animation={false} autohide delay={5000}>
                                        <Toast.Header style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
                                            <FaTimes />
                                            <strong className="mr-auto">Error</strong>
                                        </Toast.Header>
                                        <Toast.Body>Error to save</Toast.Body>
                                    </Toast>
                                </div>
                                <Button variant="info" disabled={isValid ? false : true} type="submit">
                                    {
                                        productSaving ? <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : "Create"
                                    }
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { token } = context.req.cookies;

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const res = await api.get('/users/authenticated',
        {
            validateStatus: function (status) {
                return status < 500; // Resolve only if the status code is less than 500.
            },
            headers: { Authorization: `Bearer ${token}` }
        }
    );

    if (res.status === 401) { // Not authorized!
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {},
    }
}