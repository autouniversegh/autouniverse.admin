import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Select, notification } from 'antd';
import * as func from '../../../providers/functions';

const UsersFormScreen = props => {
    const { row, form: { getFieldDecorator, validateFields, resetFields }, visible, defaultImage } = props;

    const [roles, setRoles] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if ((row.role || {}).id) {
            setModalTitle('UnMake admin');
        } else {
            setModalTitle('Make admin');
        }

        setSubmitting(true);
        func.post('users/roles', { status: 1 }).then(res => {
            setSubmitting(false);
            if (res.status === 200) {
                setRoles(res.result);
            }
        });
    }, [row, defaultImage]);


    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                setSubmitting(true);
                v['id'] = row.id;
                func.post(`users/makeAdmin`, v).then((res) => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        props.onOK(res.data);
                        props.onCancel();
                        resetFields();
                        notification.success({ message: res.result });
                    } else {
                        setErrMessage(res.result);
                    }
                });
            }
        });
    }

    return (
        <Modal visible={visible} title={modalTitle} onCancel={() => props.onCancel()} destroyOnClose={true} width={500} maskClosable={false}
            footer={[
                <Button key="back" disabled={submitting} onClick={() => props.onCancel()}>
                    Close
                </Button>,
                <Button key="submit" type="primary" loading={submitting} onClick={submit}>
                    Submit
                </Button>
            ]}
            style={{ top: 20 }} className={`${errMessage ? 'animated shake' : ''}`}
        >
            <Form hideRequiredMark={false}>
                {errMessage && (<div className="alert alert-danger">{errMessage}</div>)}
                <div className="row row-xs">
                    <div className="col-12 col-lg-12">
                        <Form.Item colon={false} label="Role">
                            {getFieldDecorator('role', {
                                rules: [{ required: true, message: <span /> }],
                                initialValue: row.role.id || 0
                            })(
                                <Select size="large" placeholder="Choose one" disabled={submitting}>
                                    <Select.Option value={0}>No role</Select.Option>
                                    {roles.map(rol => (
                                        <Select.Option key={rol.id} value={rol.id}>{rol.name}</Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    );

};

const UsersForm = Form.create()(UsersFormScreen);
export default UsersForm;