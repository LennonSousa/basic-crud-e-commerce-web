import { useState } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Button, Form, Image, Modal, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../services/api';

import styles from '../styles/pages/LandingPage.module.css';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required!'),
  email: Yup.string().email('Invalid e-mail').required('Required!'),
});

export default function Register() {
  const [showModalConfirmEmail, setShowModalConfirmEmail] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const handleCloseModalConfirmEmail = () => setShowModalConfirmEmail(false);
  const handleShowModalConfirmEmail = () => setShowModalConfirmEmail(true);

  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col sm={10} className={`${styles.formContainer} col-11`}>
            <Row>
              <Col md={6} className="mt-1 mb-4">
                <Image fluid src="/assets/images/undraw_sign_in_re_o58h.svg" alt="Register" />
              </Col>

              <Col md={6} className="mt-1 mb-1">
                <Formik
                  initialValues={{
                    name: '',
                    email: '',
                  }}
                  onSubmit={async values => {
                    setIsWaiting(true);

                    try {

                      const res = await api.post('users/new', {
                        name: values.name,
                        email: values.email,
                      },
                        {
                          validateStatus: function (status) {
                            return status < 500; // Resolve only if the status code is less than 500
                          }
                        }
                      );

                      if (res.status === 201) {
                        setModalTitle("Confirm your e-mail");
                        setModalMessage("We sent you an email.");
                        handleShowModalConfirmEmail();

                        values.name = '';
                        values.email = '';
                      }
                      else {
                        setModalTitle("Error");
                        setModalMessage("User already exists and activated.");
                        handleShowModalConfirmEmail();
                        setIsWaiting(false);
                      }
                    }
                    catch {
                      setModalTitle("Error");
                      setModalMessage("Something went wrong");
                      handleShowModalConfirmEmail();
                    }

                    setIsWaiting(false);
                  }}
                  validationSchema={validationSchema}
                  validateOnChange={false}
                >
                  {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col>
                          <Form.Group className="mb-4" controlId="formSignupName">
                            <Form.Label>Your name</Form.Label>
                            <Form.Control type="text"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.name}
                              name="name"
                              isInvalid={!!errors.name && touched.name}
                            />
                            {touched.name && <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>}
                          </Form.Group>

                          <Form.Group className="mb-4" controlId="formSignupEmail">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control type="text"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                              name="email"
                              isInvalid={!!errors.email && touched.email}
                            />
                            {touched.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                          </Form.Group>

                          <Button type="submit" variant="info" disabled={isValid ? false : true}>
                            {
                              isWaiting ? <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              /> : "Register"
                            }
                          </Button>
                        </Col>
                      </Row>

                      <Row className="mt-4">
                        <Col>
                          <Link href="/">
                            <a>I already have an account</a>
                          </Link>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <Modal show={showModalConfirmEmail} onHide={handleCloseModalConfirmEmail}>
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mt-4 mb-4 justify-content-center align-items-center text-center">
            <Col sm={5} className="mb-3">
              <p>{modalMessage}</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalConfirmEmail}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
