import { useContext, useState, ChangeEvent, useEffect } from 'react';
import { Row, Col, Button, Form, Modal, ListGroup, Toast, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaPause, FaPlay, FaPencilAlt, FaTrashAlt, FaPlus, FaTimes, FaExclamationCircle, FaBackspace } from 'react-icons/fa';

import api from '../services/api';
import { ProductsContext } from '../contexts/productsContext';
import InputMask from '../components/InputMask';

import styles from '../styles/components/Products.module.css';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    paused: boolean;
    published_at: Date;
    images: ProductImage[];
}

interface ProductImage {
    id: string;
    path: string;
}

interface ProductsProps {
    product: Product;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    description: Yup.string().required('Required!'),
    price: Yup.string().required('Required'),
});

const ProductItem: React.FC<ProductsProps> = ({ product }) => {
    const { handleProducts } = useContext(ProductsContext);

    const [price, setPrice] = useState(0.00);

    const [showModalProduct, setShowModalProduct] = useState(false);

    const handleCloseModalProduct = () => setShowModalProduct(false);
    const handleShowModalProduct = () => setShowModalProduct(true);

    const [productSaving, setProductSaving] = useState(false);
    const [productPausing, setProductPausing] = useState(false);

    const [iconDelete, setIconDelete] = useState(true);
    const [iconDeleteConfirm, setIconDeleteConfirm] = useState(false);
    const [iconDeleting, setDeleting] = useState(false);

    const [productImageSaving, setProductImageSaving] = useState(false);

    const [iconImageDelete, setIconImageDelete] = useState(true);
    const [iconImageDeleteConfirm, setIconImageDeleteConfirm] = useState('');
    const [iconImageDeleting, setImageDeleting] = useState('');

    const [showErrorProduct, setShowErrorProduct] = useState(false);
    const toggleShowErrorProduct = () => setShowErrorProduct(!showErrorProduct);

    useEffect(() => {
        setPrice(product.price);
    }, [product.price]);

    const togglePauseProduct = async () => {
        setProductPausing(true);

        try {
            await api.put(`products/${product.id}`, {
                name: product.name,
                description: product.description,
                price: product.price,
                paused: !product.paused,
            });

            const res = await api.get('products');

            handleProducts(res.data);
        }
        catch (err) {
            console.log("Error to pause product");
            console.log(err);
        }

        setProductPausing(false);
    }

    async function deleteProduct() {
        if (iconDelete) {
            setIconDelete(false);
            setIconDeleteConfirm(true);
        }
        else if (iconDeleteConfirm) {
            setIconDeleteConfirm(false);
            setDeleting(true);

            try {
                await api.delete(`products/${product.id}`);

                const res = await api.get('products');

                handleProducts(res.data);
            }
            catch (err) {
                console.log("Error to delete product");
                console.log(err);
            }

            setDeleting(false);
            setIconDeleteConfirm(false);
            setIconDelete(true);
        }
    }

    async function handleCreateImage(event: ChangeEvent<HTMLInputElement>) {
        setProductImageSaving(true);

        try {
            const data = new FormData();

            const image = event.target.files[0];

            data.append('image', image);
            data.append('product', product.id);

            await api.post('product/images/', data);

            const res = await api.get('products');

            handleProducts(res.data);
        }
        catch (err) {
            console.log("Error to create product image");
            console.log(err);
        }

        setProductImageSaving(false);
    }

    async function handleDeleteImage(id: string) {
        if (iconImageDelete) {
            setIconImageDelete(false);
            setIconImageDeleteConfirm(id);
        }
        else if (iconImageDeleteConfirm) {
            setIconImageDeleteConfirm('');
            setImageDeleting(id);

            try {
                await api.delete(`product/images/${id}`);

                const res = await api.get('products');

                handleProducts(res.data);
            }
            catch (err) {
                console.log("Error to delete product image");
                console.log(err);
            }

            setImageDeleting('');
            setIconImageDeleteConfirm('');
            setIconImageDelete(true);
        }
    }

    return <ListGroup.Item action variant={product.paused ? "danger" : "light"} as="a">
        <Row className="align-items-center">
            <Col>{product.name}</Col>

            <Col sm={2}>
                <Button title={product.paused ? "Unpause product" : "Pause product"} variant="outline-danger" onClick={togglePauseProduct}>
                    {
                        productPausing ? <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /> : product.paused ? <FaPlay /> : <FaPause />
                    }
                </Button>
            </Col>

            <Col sm={2}>
                <Button title="Edit product" variant="outline-info" onClick={handleShowModalProduct}>
                    <FaPencilAlt />
                </Button>
            </Col>

            <Col sm={2}>
                {
                    iconDeleteConfirm && <Button
                        variant="danger"
                        onClick={() => { setIconDeleteConfirm(false); setIconDelete(true); }}
                        style={{ marginRight: 10 }}
                        title="Cancel delete"
                    >
                        <FaBackspace />
                    </Button>
                }

                <Button
                    title="Delete product"
                    variant={iconDelete ? "outline-danger" : "outline-warning"}
                    onClick={deleteProduct}
                >
                    {
                        iconDelete && <FaTrashAlt />
                    }

                    {
                        iconDeleteConfirm && <FaExclamationCircle />
                    }

                    {
                        iconDeleting && <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    }
                </Button>
            </Col>
        </Row>

        <Modal show={showModalProduct} onHide={handleCloseModalProduct}>
            <Modal.Header>
                <Modal.Title>Edit</Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={{
                    name: product.name,
                    description: product.description,
                    price: price,
                }}
                onSubmit={async values => {
                    setProductSaving(true);

                    try {
                        await api.put(`products/${product.id}`, {
                            name: values.name,
                            description: values.description,
                            price: values.price,
                            paused: product.paused,
                        });

                        const res = await api.get('products');

                        handleProducts(res.data);

                        handleCloseModalProduct();
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
                                    product.images.map((image, index) => {
                                        return (
                                            <div key={index} className={styles.imagePreviewContainer}>
                                                <Button
                                                    title="Delete image"
                                                    onClick={() => { handleDeleteImage(image.id) }}
                                                    variant={iconImageDelete ? "danger" : "warning"}
                                                >
                                                    {
                                                        (iconImageDelete || iconImageDeleteConfirm !== image.id) && <FaTrashAlt />
                                                    }

                                                    {
                                                        iconImageDeleteConfirm === image.id && <FaExclamationCircle />
                                                    }

                                                    {
                                                        iconImageDeleting === image.id && <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                    }
                                                </Button>

                                                {
                                                    iconImageDeleteConfirm === image.id && <Button
                                                        variant="danger"
                                                        onClick={() => { setIconImageDeleteConfirm(''); setIconImageDelete(true); }}
                                                        title="Cancel delete"
                                                        className={styles.imagePreviewContainerDeleteConfirmButton}
                                                    >
                                                        <FaBackspace />
                                                    </Button>
                                                }
                                                <img
                                                    src={image.path}
                                                    className={styles.imagePreview}
                                                    alt={`Product image ${image.id}`}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </Row>

                            <Row className="mb-3">
                                <label htmlFor="image[]" className={styles.productImageButton}>
                                    {
                                        productImageSaving ? <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : <>
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
                                        </>
                                    }
                                    <input type="file" onChange={handleCreateImage} id="image[]" />
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
                                    /> : "Save"
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
    </ListGroup.Item >
}

export default ProductItem;