/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, Select, Cascader, notification } from 'antd';
import { GalleryContent, GalleryImageCard } from '../../../components';
import * as func from '../../../providers/functions';

const MechanicFormScreen = props => {
    const { row, form: { getFieldDecorator, validateFields, setFieldsValue, getFieldValue, resetFields }, visible, _utils: { locations } } = props;

    const [images, setImages] = useState({ names: [], links: [] });
    const [method, setMethod] = useState('');
    const [location, setLocation] = useState(row.location || {});
    const [locOptions, setLocOptions] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (row.id) {
            setModalTitle('Edit mechanic');
            setMethod('put');
            setImages({
                names: row.images ? row.images.split(',') : [],
                links: row.images ? row.image_links : []
            });
        } else {
            setModalTitle('Add mechanic');
            setMethod('post');
        }

        // set location options
        setLocOptions(func.locationOptions(locations));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setFormLocation = (e) => {
        setLocation({ region: e[0], city: e[1], area: e[2] });
    }

    const uploadSuccess = (data) => {
        images.names.push(data.name);
        images.links.push(data.link);

        setImages(images);
        setFieldsValue({ name: getFieldValue('name') });
    }
    const remove = (image) => {
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
                v['location'] = location;
                v['certifications'] = v.certifications.join(',');
                v['contact_phones'] = v.contact_phones.join(',');
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
                                <Form.Item label="Contact number/s" help="Separate each value with a comma (,)">
                                    {getFieldDecorator('contact_phones', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.id && row.contact_phones.split(',')
                                    })(
                                        <Select mode="tags" tokenSeparators={[',']} dropdownMenuStyle={{ display: 'none' }} autoComplete="off" size="large" disabled={submitting} />
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
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Certificatons" help="Separate each value with a comma (,)">
                                    {getFieldDecorator('certifications', {
                                        // rules: [{ required: true, message: <span /> }],
                                        initialValue: row.id && (row.certifications.split(',') || [])
                                    })(
                                        <Select mode="tags" tokenSeparators={[',']} dropdownMenuStyle={{ display: 'none' }} autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Location (Region / City / Area)">
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
                    <div className="col-12 col-lg-4">
                        {!getFieldValue('name') && (
                            <div className="alert alert-primary"><i className="fa fa-exclamation-circle"></i> Enter <b>mechanic name</b> to activate image/s upload</div>
                        )}
                        {getFieldValue('name') && (
                            <GalleryContent
                                folder="mechanics" listType="picture" multiple={true} showUploadList={false} uploadSuccess={uploadSuccess}
                                uploadData={{ name: getFieldValue('name') }}
                            />
                        )}
                        <div className="clearfix" />
                        {images.links.map((link, i) => (
                            <GalleryImageCard imgLink={link} img={images.names[i]} onRemove={e => remove(e)} folder="mechanics" />
                        ))}
                    </div>
                </div>
            </Form>
        </Modal>
    );

};

const MechanicForm = Form.create()(MechanicFormScreen);
export default MechanicForm;