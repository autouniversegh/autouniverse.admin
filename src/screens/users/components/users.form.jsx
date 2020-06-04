/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, Select, notification } from 'antd';
import { GalleryImageCard, GalleryContent } from '../../../components';
import * as func from '../../../providers/functions';

const UsersFormScreen = props => {
    const { row, form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue, resetFields }, visible, access, type } = props;

    const [images, setImages] = useState({ name: '', link: '' });
    const [method, setMethod] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (row.id) {
            setModalTitle(`${type === 'reset' ? 'Reset' : 'Edit'} user`);
            setMethod('put');
            setImages({
                name: row.avatar ? row.avatar : '',
                link: row.avatar ? row.avatar_link : ''
            });
        } else {
            setModalTitle('Add user');
            setMethod('post');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadSuccess = (data) => {
        images['name'] = data.name;
        images['link'] = data.link;

        setImages(images);
        setFieldsValue({ name: getFieldValue('name') });
    }
    const removeImage = () => {
        images['name'] = ''
        images['link'] = '';

        setImages(images);
        setFieldsValue({ name: getFieldValue('name') });
    }

    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                setSubmitting(true);
                if(type === 'reset') {
                    func.put(`users/${row.uuid}/resets`, v).then((res) => {
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
                }else{
                    v['avatar'] = images.name;
                    v['admin'] = row.admin;
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
            }
        });
    }

    return (
        <Modal visible={visible} title={modalTitle} onCancel={() => props.onCancel()} destroyOnClose={true} width={type === 'reset' ? 500 : 1200} maskClosable={false}
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

                {type === '' && (
                    <div className="row">

                        <div className="col-12 col-lg-3">
                            {!getFieldValue('name') && (
                                <div className="alert alert-primary"><i className="fa fa-exclamation-circle"></i> Enter <b>user name</b> to activate image/s upload</div>
                            )}
                            {getFieldValue('name') && (
                                <GalleryContent
                                    folder="users" listType="picture-card" multiple={false} showUploadList={false} uploadSuccess={uploadSuccess}
                                    uploadData={{ name: getFieldValue('name'), resizes: '800,800' }}
                                />
                            )}
                            <div className="clearfix" />
                            <GalleryImageCard imgLink={images.link} img={images.name} onRemove={e => removeImage(e)} folder="users" />
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
                                            <Input autoComplete="off" size="large" disabled={submitting} />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <Form.Item label="Phone">
                                        {getFieldDecorator('phone', {
                                            rules: [{ required: true, message: <span /> }],
                                            initialValue: row.phone
                                        })(
                                            <Input placeholder="26XXXXXXX" maxLength={10} autoComplete="off" size="large" disabled={submitting} />
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
                )}

                {type === 'reset' && (
                    <Form.Item label="New password">
                        {getFieldDecorator('newPassword', {
                            rules: [{ required: true, message: <span /> }]
                        })(
                            <Input autoComplete="off" size="large" disabled={submitting} />
                        )}
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );

};

const UsersForm = Form.create()(UsersFormScreen);
export default UsersForm;