import Link from 'next/link';
import { Container, Row, Col, Button, Form, Image } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import styles from '../styles/pages/LandingPage.module.css';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('E-mail inválido').required('Obrigatório!'),
  password: Yup.string().required('Obrigatório!').min(8, 'Mínimo 8 caracteres.'),
});

export default function Home() {
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
                  }}
                  validationSchema={validationSchema}
                >
                  {({ handleChange, handleSubmit, values, errors, isValid }) => (
                    <Form onSubmit={handleSubmit}>
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
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-4" controlId="formLoginPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"
                              onChange={handleChange}
                              value={values.password}
                              name="password"
                              isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                          </Form.Group>

                          <Button type="submit" variant="info">
                            Signin
                          </Button>
                        </Col>
                      </Row>

                      <Row className="mt-4">
                        <Col>
                          <Link href="">
                            <a>Forgot my password</a>
                          </Link>
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <Link href="">
                            <a>Create my account</a>
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
    </div>
  )
}
