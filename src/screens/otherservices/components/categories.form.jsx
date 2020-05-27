/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, Select, notification } from 'antd';

import * as func from '../../../providers/functions';

const CategoriesFormScreen = props => {
    const { row, form: { getFieldDecorator, validateFields, resetFields }, visible } = props;

    const [method, setMethod] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (row.id) {
            setModalTitle('Edit category');
            setMethod('put');
        } else {
            setModalTitle('Add category');
            setMethod('post');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                setSubmitting(true);
                func[method](`otherservices-categories${method === 'put' ? `/${row.uuid}` : ''}`, v).then((res) => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        props.onOK(method, res.data);
                        props.onCancel();
                        resetFields();
                        notification.success({ message: res.message });
                    } else {
                        if (res.status === 412) {
                            setErrMessage(res.data.join('<br />'));
                        } else {
                            setErrMessage(res.message);
                        }
                    }
                });
            }
        });
    }

    return (
        <Modal visible={visible} title={modalTitle} onCancel={() => props.onCancel()} destroyOnClose={true} width={900} maskClosable={false}
            footer={[
                <Button key="back" type="danger" className="pull-left" disabled={submitting} onClick={() => props.onCancel()}>
                    Close
                </Button>,
                <Button key="submit" type="dark" loading={submitting} onClick={submit}>
                    Save
                </Button>
            ]}
            style={{ top: 20 }} className={`${errMessage ? 'animated shake' : ''}`}
        >
            <Form hideRequiredMark={false}>
                {errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: errMessage }} />)}
                <div className="row">
                    <div className="col-12 col-lg-12">
                        <div className="row row-xs">
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Name">
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.name
                                    })(
                                        <Input autoComplete="off" size="large" autoFocus disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Status">
                                    {getFieldDecorator('status', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.id ? row.status : 1
                                    })(
                                        <Select optionFilterProp="children" size="large" disabled={submitting}>
                                            <Select.Option value={1}>Active</Select.Option>
                                            <Select.Option value={0}>Not active</Select.Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-12">
                                <Form.Item label="Description">
                                    {getFieldDecorator('description', {
                                        initialValue: row.description
                                    })(
                                        <Input.TextArea rows={4} autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    );

};

const CategoriesForm = Form.create()(CategoriesFormScreen);
export default CategoriesForm;