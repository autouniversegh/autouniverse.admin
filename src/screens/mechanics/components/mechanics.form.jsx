/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, Select, Cascader, notification } from 'antd';

import * as func from '../../../providers/functions';

const MechanicFormScreen = props => {
    const defaultImage = '/assets/noimage.jpg';
    const { row, form: { getFieldDecorator, validateFields, resetFields }, visible, _utils: { locations } } = props;

    const [file, setFile] = useState(null);
    const [image, setImage] = useState('');
    const [method, setMethod] = useState('');
    const [autoparts, setAutoparts] = useState([]);
    const [location, setLocation] = useState(row.location || {});
    const [locOptions, setLocOptions] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loadingParts, setLoadingParts] = useState(true);

    useEffect(() => {
        if (row.id) {
            setModalTitle('Edit autopart');
            setMethod('put');
            setImage(row.logo ? row.logo_link : defaultImage);
        } else {
            setModalTitle('Add autopart');
            setMethod('post');
            setImage(defaultImage);
        }
        
        func.get('autoparts', { status: 1 }).then(res => {
            setLoadingParts(false);
            if (res.status === 200) {
                setAutoparts(res.data);
            }
        });

        // set location options
        let lptions = [];
        Object.keys(locations).map(region => {
            let cities = [];
            Object.keys(locations[region]).map(city => {
                cities.push({ value: city, label: city });
            });
            lptions.push({ value: region, label: region, children: cities });
        });
        setLocOptions(lptions);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setFormLocation = (e) => {
        setLocation({ region: e[0], city: e[1] });
    }

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
            setImage(row.logo_link);
        }
    }

    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                setSubmitting(true);
                var imoge = row.logo || '';
                if (file) {
                    func.postFile('upload', { folder: 'mechanics', 'file': file, name: v.name, resize: '800,800' }).then(res => {
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
        v['logo'] = imoge;
        v['parts'] = v.parts.join(',');
        v['location'] = JSON.stringify(location);
        func[method](`mechanics${method === 'put' ? `/${row.uuid}` : ''}`, v).then((res) => {
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
                        <img className="img-thumbnail" src={image} alt={row.name} width="100%" />
                        <input type="file" name="image" id="image" accept="image/*" onChange={addImage} className="hide" />
                        <div className="row row-xs">
                            <div className="col-12">
                                <Button type="dark" size="small" block className="mg-b-5" onClick={() => window.$('#image').click()}>Choose logo</Button>
                            </div>
                            <div className="col-12">
                                {file && (<Button type="danger" size="small" block onClick={removeImage}>Remove logo</Button>)}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-9">
                        <div className="row row-xs">
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Name">
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.name
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Contact name">
                                    {getFieldDecorator('contact_name', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.contact_name
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Contact number/s">
                                    {getFieldDecorator('contact_phones', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.contact_phones
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Premises Insured">
                                    {getFieldDecorator('insurance', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.id ? row.insurance : 0
                                    })(
                                        <Select optionFilterProp="children" size="large" disabled={submitting}>
                                            <Select.Option value={1}>Yes</Select.Option>
                                            <Select.Option value={0}>No</Select.Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-12">
                                <Form.Item label="Parts">
                                    {getFieldDecorator('parts', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.id && row.parts.map(row => { return row.uuid; })
                                    })(
                                        <Select optionFilterProp="children" size="large" mode="multiple" showSearch={true} disabled={submitting || loadingParts}>
                                            {autoparts.map(part => (
                                                <Select.Option value={part.uuid}>{part.name} ({part.dealer.name})</Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Location (Region / City)">
                                    {getFieldDecorator('location', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: Object.values(row.location || {})
                                    })(
                                        <Cascader size="large" disabled={submitting} options={locOptions} onChange={(e) => setFormLocation(e)} />
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
                                <Form.Item label="Other comments">
                                    {getFieldDecorator('comments', {
                                        initialValue: row.comments
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

const MechanicForm = Form.create()(MechanicFormScreen);
export default MechanicForm;