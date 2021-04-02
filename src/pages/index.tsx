import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, Row, Col, Button, Form, Image, Modal, Spinner, Toast } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

import { AuthContext } from '../contexts/authContext';

import styles from '../styles/pages/LandingPage.module.css';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid e-mail').required('Required!'),
  password: Yup.string().required('Required!').min(8, 'Minimum 8 characters.'),
});

const resetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid e-mail').required('Required!'),
});

export default function Home() {
  const router = useRouter();
  const { signed, handleLogin } = useContext(AuthContext);

  const [showModalConfirmEmail, setShowModalConfirmEmail] = useState(false);

  const handleCloseModalConfirmEmail = () => setShowModalConfirmEmail(false);
  const handleShowModalConfirmEmail = () => setShowModalConfirmEmail(true);

  const [showModalResetPassword, setShowModalResetPassword] = useState(false);

  const handleCloseModalResetPassword = () => setShowModalResetPassword(false);
  const handleShowModalResetPassword = () => setShowModalResetPassword(true);

  const [errorMessageLogin, setErrorMessageLogin] = useState('');
  const [waitingLogin, setWaitingLogin] = useState(false);

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
                    setWaitingLogin(true);

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
                    catch { }

                    setWaitingLogin(false);
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
                                  waitingLogin ? <Spinner
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
                          <button className={`btn btn-link ${styles.formBtnLink}`} onClick={handleShowModalResetPassword}>Forgot my password</button>
                        </Col>

                        <Toast onClose={toggleShowLogin} show={showErrorLogin} animation={false} autohide>
                          <Toast.Header style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
                            <FaLock />
                            <strong className="mr-auto">Nice try</strong>
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

      <Modal show={showModalConfirmEmail} onHide={handleCloseModalConfirmEmail}>
        <Modal.Header>
          <Modal.Title>
            Finish your profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mt-4 mb-4 justify-content-center align-items-center text-center">
            <Col sm={5} className="mb-3">
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info">
            Save
          </Button>
          <Button variant="secondary" onClick={handleCloseModalConfirmEmail}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
          }}
          validationSchema={resetPasswordValidationSchema}
          isInitialValid={false}
        >
          {({ handleChange, handleSubmit, values, errors, isValid, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row>
                  <Col>
                    <Form.Group className="mb-4" controlId="formLogintEmail">
                      <Form.Label>Your e-mail</Form.Label>
                      <Form.Control type="text"
                        onChange={handleChange}
                        value={values.email}
                        name="email"
                        isInvalid={!!errors.email}
                      />
                      {touched.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="info" disabled={isValid ? false : true} type="submit">
                  Send e-mail
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
