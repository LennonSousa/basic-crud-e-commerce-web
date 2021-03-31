import Link from 'next/link';
import { Container, Row, Col, Button, Form, Image } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import styles from '../styles/pages/LandingPage.module.css';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required!'),
  email: Yup.string().email('Invalid e-mail').required('Required!'),
});

export default function Home() {
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
                  }}
                  validationSchema={validationSchema}
                  isInitialValid={false}
                >
                  {({ handleChange, handleSubmit, values, errors, isValid, touched }) => (
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col>
                          <Form.Group className="mb-4" controlId="formSignupEmail">
                            <Form.Label>Your e-mail</Form.Label>
                            <Form.Control type="text"
                              onChange={handleChange}
                              value={values.name}
                              name="name"
                              isInvalid={!!errors.name}
                            />
                            {touched.name && <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>}
                          </Form.Group>

                          <Form.Group className="mb-4" controlId="formLoginPassword">
                            <Form.Label>Your e-mail</Form.Label>
                            <Form.Control type="text"
                              onChange={handleChange}
                              value={values.email}
                              name="email"
                              isInvalid={!!errors.email}
                            />
                            {touched.email && <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>}
                          </Form.Group>

                          <Button type="submit" variant="info" disabled={isValid ? false : true}>
                            Register
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
    </div>
  )
}
