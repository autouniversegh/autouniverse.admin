/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, Select, notification } from 'antd';

import * as func from '../../../providers/functions';

const UsersFormScreen = props => {
    const defaultImage = '/assets/noimage.jpg';
    const { row, form: { getFieldDecorator, validateFields, resetFields }, visible, access } = props;

    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [method, setMethod] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (row.id) {
            setModalTitle('Edit user');
            setMethod('put');
            setImage(row.avatar ? row.avatar_link : defaultImage);
        } else {
            setModalTitle('Add user');
            setMethod('post');
            setImage(defaultImage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addImage = (e) => {
        var target = e.target.files[0];
        var imageInput = document.getElementById('image');
        var image = imageInput.files[0];
        var reader = new FileReader();
        reader.onload = function (r) {
            setFile(target);
            setImage(reader.result);
        }
        reader.readAsDataURL(image);
    }
    const removeImage = () => {
        if (method === 'post') {
            setFile(null);
            setImage(defaultImage);
        } else {
            setFile(null);
            setImage(row.image_link);
        }
    }

    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                setSubmitting(true);
                var imoge = row.image || '';
                if (file) {
                    func.postFile('upload', { folder: 'users', 'file': file, name: v.name, resize: '800,800' }).then(res => {
                        if (res.status === 200) {
                            imoge = res.data[0];
                            submitGo(v, imoge);
                        } else {
                            setSubmitting(false);
                            if (res.status === 412) {
                                setErrMessage(res.data.join('<br />'));
                            } else {
                                setErrMessage(res.message);
                            }
                        }
                    });
                } else {
                    submitGo(v, imoge);
                }
            }
        });
    }

    const submitGo = (v, imoge) => {
        v['avatar'] = imoge;
        v['phone'] = `+233${v.phone.replace(/^0/, '')}`;
        v['admin'] = props.params.admin;
        func[method](`users${method === 'put' ? `/${row.uuid}` : ''}`, v).then((res) => {
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

    return (
        <Modal visible={visible} title={modalTitle} onCancel={() => props.onCancel()} destroyOnClose={true} width={1200} maskClosable={false}
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
                {errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: errMessage }} />)}
                <div className="row">
                    <div className="col-12 col-lg-3">
                        <img className="img-thumbnail img-circle" src={image} alt={row.name} width="100%" />
                        <input type="file" name="image" id="image" accept="image/*" onChange={addImage} className="hide" />
                        <div className="row row-xs">
                            <div className="col-12">
                                <Button type="dark" size="small" block className="mg-b-5" onClick={() => window.$('#image').click()}>Choose avatar</Button>
                            </div>
                            <div className="col-12">
                                {file && (<Button type="danger" size="small" block onClick={removeImage}>Remove image</Button>)}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-9">
                        <div className="row row-xs">
                            <div className="col-12 col-lg-12">
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
                                <Form.Item label="Email">
                                    {getFieldDecorator('email', {
                                        rules: [{ required: true, message: <span /> }, { type: 'email' }],
                                        initialValue: row.email
                                    })(
                                        <Input autoComplete="off" size="large" autoFocus disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Phone">
                                    {getFieldDecorator('phone', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.phone && row.phone.split('+233')[1]
                                    })(
                                        <Input addonBefore="+233" placeholder="26XXXXXXX" maxLength={9} autoComplete="off" size="large" autoFocus disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            {props.params.admin === 1 && (
                                <div className="col-12 col-lg-6">
                                    <Form.Item label="Access">
                                        {getFieldDecorator('access', {
                                            rules: [{ required: true, message: <span /> }],
                                            initialValue: row.id && row.access.uuid
                                        })(
                                            <Select showSearch autoComplete="off" size="large" disabled={submitting}>
                                                {access.map(ctg => (
                                                    <Select.Option value={ctg.uuid} key={ctg.uuid}>{ctg.name}</Select.Option>
                                                ))}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                            )}

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
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    );

};

const UsersForm = Form.create()(UsersFormScreen);
export default UsersForm;