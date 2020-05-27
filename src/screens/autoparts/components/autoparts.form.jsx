/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, Select, notification } from 'antd';

import * as func from '../../../providers/functions';
import { GalleryContent, GalleryImageCard } from '../../../components';

const AutopartFormScreen = props => {
    const { row, form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue, resetFields }, visible, _utils: { cars } } = props;

    const [images, setImages] = useState({ names: [], links: [] });
    const [method, setMethod] = useState('');
    const [dealers, setDealers] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (row.id) {
            setModalTitle('Edit autopart');
            setMethod('put');
            setImages({
                names: row.images ? row.images.split(',') : [],
                links: row.images ? row.image_links : []
            });
        } else {
            setModalTitle('Add autopart');
            setMethod('post');
        }

        func.get('dealers', { status: 1 }).then(res => {
            if (res.status === 200) {
                setDealers(res.data);
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadSuccess = (data) => {
        images.names.push(data.name);
        images.links.push(data.link);

        setImages(images);
        setFieldsValue({ name: getFieldValue('name') });
    }
    const removeImage = (image) => {
        let i = images.names.indexOf(image);
        images.names.splice(i, 1);
        images.links.splice(i, 1);

        setImages(images);
        setFieldsValue({ name: getFieldValue('name') });
    }

    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                setSubmitting(true);
                v['images'] = images.names;
                func[method](`autoparts${method === 'put' ? `/${row.uuid}` : ''}`, v).then((res) => {
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
        <Modal visible={visible} title={modalTitle} onCancel={() => props.onCancel()} destroyOnClose={true} width={1200} maskClosable={false}
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
                    <div className="col-12 col-lg-8">
                        <div className="row row-xs">
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Dealer">
                                    {getFieldDecorator('dealer', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.id && row.dealer.uuid
                                    })(
                                        <Select optionFilterProp="children" size="large" showSearch={true} disabled={submitting}>
                                            {dealers.map(del => (
                                                <Select.Option value={del.uuid}>{del.name}</Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
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
                                <Form.Item label="Car make">
                                    {getFieldDecorator('car', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.car
                                    })(
                                        <Select showSearch optionFilterProp="children" size="large" placeholder="Choose a car make" disabled={submitting}>
                                            {Object.keys(cars).map(car => (
                                                <Select.Option value={car}>{car}</Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Car model">
                                    {getFieldDecorator('car_model', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.car_model
                                    })(
                                        <Select showSearch optionFilterProp="children" size="large" placeholder="Choose a car model" disabled={!getFieldValue('car') || submitting}>
                                            {getFieldValue('car') && cars[getFieldValue('car')].map(car => (
                                                <Select.Option value={car}>{car}</Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Car year">
                                    {getFieldDecorator('car_year', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.car_year
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Part source">
                                    {getFieldDecorator('source', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.source
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Price">
                                    {getFieldDecorator('price', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.price
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} addonBefore="GHS" />
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
                    <div className="col-12 col-lg-4">
                        {!getFieldValue('name') && (
                            <div className="alert alert-primary"><i className="fa fa-exclamation-circle"></i> Enter <b>autopart name</b> to activate image/s upload</div>
                        )}
                        {getFieldValue('name') && (
                            <GalleryContent
                                folder="autoparts" listType="picture" multiple={true} showUploadList={false} uploadSuccess={uploadSuccess}
                                uploadData={{ name: getFieldValue('name') }}
                            />
                        )}
                        <div className="clearfix" />
                        {images.links.map((link, i) => (
                            <GalleryImageCard imgLink={link} img={images.names[i]} onRemove={e => removeImage(e)} folder="autoparts" />
                        ))}
                    </div>
                </div>
            </Form>
        </Modal>
    );

};

const AutopartForm = Form.create()(AutopartFormScreen);
export default AutopartForm;