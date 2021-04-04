import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Container, Row, Col, Button, Form, Image, Modal, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../services/api';
import { User } from '../components/Users';

import styles from '../styles/pages/LandingPage.module.css';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required!'),
  email: Yup.string().email('Invalid e-mail').required('Required!'),
  password: Yup.string().required('Required!').min(8, 'Minimum 8 characters.'),
  passwordRepeat: Yup.string().required('Required!').min(8, 'Minimum 8 characters.'),
});

export default function Confirm({ userConfirmed, tokenConfirmed, error }) {
  const router = useRouter();

  const [user, setUser] = useState<User>();

  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [showLoginPageButton, setShowLoginPageButton] = useState(false);

  const handleCloseModalConfirm = () => setShowModalConfirm(false);
  const handleShowModalConfirm = () => setShowModalConfirm(true);

  useEffect(() => {
    if (error) {
      setModalTitle("Error");
      setModalMessage("User e-mail or token dosen't exists.");

      setShowLoginPageButton(true);
      handleShowModalConfirm();
    }
    else if (userConfirmed && tokenConfirmed) {
      setUser(userConfirmed);
    }
  }, [userConfirmed, error]);

  return (
    <div className={styles.pageContainer}>
      <Container>
        {
          !error && user && tokenConfirmed && <Row className="justify-content-center align-items-center">
            <Col sm={10} className={`${styles.formContainer} col-11`}>
              <Row>
                <Col md={6} className="mt-1 mb-4">
                  <Image fluid src="/assets/images/undraw_welcome_3gvl.svg" alt="Register" />
                </Col>

                <Col md={6} className="mt-1 mb-1">
                  <Formik
                    initialValues={{
                      name: user.name,
                      email: user.email,
                      password: '',
                      passwordRepeat: '',
                    }}
                    onSubmit={async values => {
                      setIsWaiting(true);

                      try {
                        await api.put(`users/${user.id}`, {
                          name: values.name,
                          password: values.password,
                        },
                          {
                            headers: { Authorization: `Bearer ${tokenConfirmed}` }
                          }
                        );

                        setModalTitle("Success!");
                        setModalMessage("Your profile has been successfully created.");

                        setShowLoginPageButton(true);
                        handleShowModalConfirm();
                      }
                      catch {
                        setModalTitle("Error");
                        setModalMessage("Something went wrong.");

                        setShowLoginPageButton(false);
                        handleShowModalConfirm();
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
                            <Form.Group className="mb-4" controlId="formConfirmName">
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

                            <Form.Group className="mb-4" controlId="formConfirmEmail">
                              <Form.Label>E-mail</Form.Label>
                              <Form.Control type="text"
                                plaintext
                                disabled
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                name="email"
                                isInvalid={!!errors.email && touched.email}
                              />
                              {touched.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="formConfirmPassword">
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

                            <Form.Group className="mb-4" controlId="formConfirmPasswordRepeat">
                              <Form.Label>Repeat password</Form.Label>
                              <Form.Control type="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.passwordRepeat}
                                name="passwordRepeat"
                                isInvalid={touched.passwordRepeat && values.password !== values.passwordRepeat}
                              />
                              {
                                touched.passwordRepeat && values.password !== values.passwordRepeat &&
                                <Form.Control.Feedback type="invalid">Passwords must be the same.</Form.Control.Feedback>
                              }
                              {touched.passwordRepeat && <Form.Control.Feedback type="invalid">{errors.passwordRepeat}</Form.Control.Feedback>}

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
        }
      </Container>

      <Modal
        show={showModalConfirm}
        onHide={handleCloseModalConfirm}
        backdrop="static"
        keyboard={false}
      >
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
          {
            showLoginPageButton ? <Button variant="info"
              onClick={() => {
                router.replace('/');
              }}
            >
              Return to login page
          </Button> : <Button variant="secondary" onClick={handleCloseModalConfirm}>
              Close
          </Button>
          }
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let userConfirmed = null;
  let tokenConfirmed = null;
  let error = true;

  const { email, token } = context.query;

  if (!email && !token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  try {
    const res = await api.post('users/new/authenticate', {
      email,
      token,
    },
      {
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        }
      }
    );

    if (res.status === 201) {
      const { user, token } = res.data;

      userConfirmed = user;
      tokenConfirmed = token;

      error = false;
    }
  }
  catch { }

  return {
    props: {
      userConfirmed,
      tokenConfirmed,
      error,
    },
  }
}