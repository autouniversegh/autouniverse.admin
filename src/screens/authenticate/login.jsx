import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
import { Card, CardBody, CardGroup, Col, Container, Row } from 'reactstrap';
import * as func from '../../providers/functions';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false, errMessage: ''
        };
    }

    _submit = (e) => {
        e.preventDefault();
        const { form: { validateFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                this.setState({ submitting: true, errMessage: '' });
                func.post('auths/login', v).then(res => {
                    this.setState({ submitting: false });
                    if (res.status === 200) {
                        const user = res.user;
                        if (user.admin === 1) {
                            func.setStorage('token', res.token);
                            func.setStorageJson('user', user);
                            window.location.replace('/');
                        } else {
                            this.setState({ errMessage: 'You do not have access to this panel' });
                        }
                    } else {
                        this.setState({ errMessage: res.message });
                    }
                });
            }
        });
    }

    render() {
        const { form: { getFieldDecorator } } = this.props;
        const { submitting, errMessage } = this.state;

        return (
            <Form className={errMessage ? 'animated shake' : ''} hideRequiredMark={false} onSubmit={this._submit}>
                <div className="app flex-row align-items-center">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md="8">
                                {errMessage && (<div className="alert alert-danger">{errMessage}</div>)}
                                <CardGroup>
                                    <Card className="p-4">
                                        <CardBody>
                                            <h1>Login</h1>
                                            <p className="text-muted">Sign In to your account</p>
                                            <Form.Item colon={false} label={null}>
                                                {getFieldDecorator('username', {
                                                    rules: [{ required: true, message: <span /> }]
                                                })(
                                                    <Input autoComplete="off" size="large" addonBefore={<i className="icon-user"></i>} placeholder="Username" disabled={submitting} />
                                                )}
                                            </Form.Item>
                                            <Form.Item colon={false} label={null}>
                                                {getFieldDecorator('password', {
                                                    rules: [{ required: true, message: <span /> }]
                                                })(
                                                    <Input.Password autoComplete="off" size="large" addonBefore={<i className="icon-lock"></i>} placeholder="Password" disabled={submitting} />
                                                )}
                                            </Form.Item>
                                            <Row>
                                                <Col xs="6">
                                                    <Button htmlType="submit" type="primary" block className="px-4" loading={submitting}>Login</Button>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                    <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                                        <CardBody className="text-center">
                                            <div>
                                                <h2 className="text-white">AutoUniverse Admin</h2>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </CardGroup>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </Form>
        )
    }

}

const Login = Form.create()(LoginForm);
export default Login;