import { useState, useContext, isValidElement } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Container, Row, Col, Button, Form, Image, Modal, Spinner, Toast, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

import { AuthContext } from '../contexts/authContext';

import api from '../services/api';

import styles from '../styles/pages/LandingPage.module.css';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid e-mail').required('Required!'),
  password: Yup.string().required('Required!').min(8, 'Minimum 8 characters.'),
});

const resetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid e-mail').required('Required!'),
});

export default function Home() {
  const { signed, handleLogin } = useContext(AuthContext);

  const [showModalResetPassword, setShowModalResetPassword] = useState(false);

  const handleCloseModalResetPassword = () => setShowModalResetPassword(false);
  const handleShowModalResetPassword = () => setShowModalResetPassword(true);

  const [errorMessageLogin, setErrorMessageLogin] = useState('');
  const [isWaitingLogin, setIsWaitingLogin] = useState(false);

  const [sentEmail, setSentEmail] = useState(false);
  const [messageReset, setMessageReset] = useState('');
  const [isMessageResetSuccess, setIsMessageResetSuccess] = useState(false);
  const [isWaitingReset, setIsWaitingReset] = useState(false);

  const [showErrorLogin, setShowErrorLogin] = useState(false);

  const toggleShowLogin = () => setShowErrorLogin(!showErrorLogin);

  return (
    <div className={styles.pageContainer}>
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col sm={10} className={`${styles.formContainer} col-11`}>
            <Row>
              <Col md={6} className="mt-1 mb-4">
                <Image fluid src="/assets/images/undraw_healthy_options_sdo3.svg" alt="Login" />
              </Col>

              <Col md={6} className="mt-1 mb-1">
                <Formik
                  initialValues={{
                    email: '',
                    password: '',
                  }}
                  onSubmit={async values => {
                    setIsWaitingLogin(true);

                    try {
                      const resLogin = await handleLogin(values.email, values.password);

                      if (!resLogin) {
                        setShowErrorLogin(true);
                        setErrorMessageLogin("Incorrect e-mail or password!");
                        toggleShowLogin();
                      }
                      else if (resLogin === "error") {
                        setShowErrorLogin(true);
                        setErrorMessageLogin("Connection error!");
                        toggleShowLogin();
                      }
                    }
                    catch {
                      setShowErrorLogin(true);
                      setErrorMessageLogin("Connection error!");
                      toggleShowLogin();
                    }

                    setIsWaitingLogin(false);
                  }}
                  validationSchema={validationSchema}
                  validateOnChange={false}
                >
                  {({ handleBlur, handleChange, handleSubmit, values, errors, isValid, touched }) => (
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col>
                          <Form.Group className="mb-4" controlId="formLogintEmail">
                            <Form.Label>Your e-mail</Form.Label>
                            <Form.Control type="text"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                              name="email"
                              isInvalid={!!errors.email && touched.email}
                            />
                            {touched.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                          </Form.Group>

                          <Form.Group className="mb-4" controlId="formLoginPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.password}
                              name="password"
                              isInvalid={!!errors.password && touched.password}
                            />
                            {touched.password && <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>}
                          </Form.Group>

                          <Button type="submit" variant="info" disabled={isValid ? false : true}>
                            {
                              signed ? <FaCheckCircle /> :
                                (
                                  isWaitingLogin ? <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  /> : "Sign in"
                                )
                            }
                          </Button>
                        </Col>
                      </Row>

                      <Row className="mt-4">
                        <Col>
                          <button className={`btn btn-link ${styles.formBtnLink}`} type="button" onClick={handleShowModalResetPassword}>Forgot my password</button>
                        </Col>

                        <Toast onClose={toggleShowLogin} show={showErrorLogin} animation={false} autohide>
                          <Toast.Header style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
                            <FaLock />
                            <strong className="mr-auto"> Nice try</strong>
                          </Toast.Header>
                          <Toast.Body>{errorMessageLogin}</Toast.Body>
                        </Toast>
                      </Row>

                      <Row>
                        <Col>
                          <Link href="/register">
                            <a>Create an account</a>
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

      <Modal show={showModalResetPassword} onHide={handleCloseModalResetPassword}>
        <Modal.Header>
          <Modal.Title>
            Reset your password
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            email: '',
          }}
          onSubmit={async values => {
            setSentEmail(false);
            setIsWaitingReset(true);

            try {

              const res = await api.post('users/reset', {
                email: values.email,
              },
                {
                  validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                  }
                }
              );

              if (res.status === 201) {
                setIsMessageResetSuccess(true);
                setMessageReset("We sent you an email. Verify your e-mail");

                values.email = '';
              }
              else {
                setIsMessageResetSuccess(false);
                setMessageReset("User dosen't exists!");
              }
            }
            catch {
              setIsMessageResetSuccess(false);
              setMessageReset("Something went wrong");
            }

            setSentEmail(true);
            setIsWaitingReset(false);
          }}
          validationSchema={resetPasswordValidationSchema}
          validateOnChange={false}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row>
                  <Col>
                    <Form.Group className="mb-4" controlId="formResetEmail">
                      <Form.Label>Your e-mail</Form.Label>
                      <Form.Control type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        name="email"
                        isInvalid={!!errors.email && touched.email}
                      />
                      {touched.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                    </Form.Group>
                  </Col>
                </Row>
                {
                  sentEmail && <Row>
                    <Col>
                      <Alert variant={isMessageResetSuccess ? "success" : "danger"}>
                        {messageReset}
                      </Alert>
                    </Col>
                  </Row>
                }
              </Modal.Body>
              <Modal.Footer>
                <Button variant="info" disabled={isValid ? false : true} type="submit">
                  {
                    isWaitingReset ? <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> : "Send email"
                  }
                </Button>
                <Button variant="secondary" onClick={handleCloseModalResetPassword}>
                  Close
              </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.req.cookies;

  if (token) {
    try {
      const res = await api.get('/users/authenticated',
        {
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500.
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.status === 202) { // Alread authenticated!
        return {
          redirect: {
            destination: '/dashboard/products',
            permanent: false,
          },
        }
      }
    }
    catch { }
  }

  return {
    props: {},
  }
}
