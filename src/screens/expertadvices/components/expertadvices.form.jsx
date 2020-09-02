/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import faker from 'faker/locale/en';
import { Modal, Form, Button, Input, Select, notification } from 'antd';
import { GalleryContent, GalleryImageCard } from '../../../components';
import * as func from '../../../providers/functions';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const EmergenciesFormScreen = props => {
    const { form: { getFieldValue, getFieldDecorator, validateFields, setFieldsValue, resetFields }, visible, categories } = props;

    const [row, setRow] = useState({});
    const [images, setImages] = useState({ names: [], links: [] });
    const [method, setMethod] = useState('');
    const [content, setContent] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let row = props.row;
        setRow(row);
        if (row.id) {
            setModalTitle('Edit advice');
            setMethod('put');
            setImages({
                names: [row.image],
                links: row.image ? [row.image_link] : []
            });
        } else {
            setModalTitle('Add advice');
            setMethod('post');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadSuccess = (data) => {
        images.names.push(data.name);
        images.links.push(data.link);

        setImages(images);
        setFieldsValue({ name: getFieldValue('title') });
    }
    const removeImage = (image) => {
        let i = images.names.indexOf(image);
        images.names.splice(i, 1);
        images.links.splice(i, 1);

        setImages(images);
        setFieldsValue({ title: getFieldValue('title') });
    }

    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                setSubmitting(true);
                v['image'] = images.names[0];
                v['content'] = content;
                func[method](`expertadvices${method === 'put' ? `/${row.uuid}` : ''}`, v).then((res) => {
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

    const setFaker = () => {
        setRow({
            title: faker.lorem.words(), content: faker.lorem.paragraphs()
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
                            <div className="col-12 col-lg-12">
                                <Form.Item label="Title">
                                    {getFieldDecorator('title', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.title
                                    })(
                                        <Input autoComplete="off" size="large" autoFocus disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-6">
                                <Form.Item label="Category">
                                    {getFieldDecorator('category', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.id && row.category.uuid
                                    })(
                                        <Select showSearch autoComplete="off" size="large" disabled={submitting}>
                                            {categories.map(ctg => (
                                                <Select.Option value={ctg.uuid} key={ctg.uuid}>{ctg.name}</Select.Option>
                                            ))}
                                        </Select>
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
                                <SunEditor
                                    setOptions={{ height: 350 }}
                                    setContents={row.content}
                                    onChange={e => setContent(e)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        {func.api.space !== 'on' && method === 'post' && (
                            <Button key="submit" type="dark" size="small" block className="mg-b-15" onClick={setFaker}>
                                Use faker
                            </Button>
                        )}
                        {!getFieldValue('title') && (
                            <div className="alert alert-primary"><i className="fa fa-exclamation-circle"></i> Enter <b>title</b> to activate image/s upload</div>
                        )}
                        {getFieldValue('title') && (
                            <GalleryContent
                                folder="expertadvices" listType="picture" multiple={false} showUploadList={false} uploadSuccess={uploadSuccess}
                                uploadData={{ name: getFieldValue('title') }}
                            />
                        )}
                        <div className="clearfix" />
                        {images.links.map((link, i) => (
                            <GalleryImageCard imgLink={link} img={images.names[i]} onRemove={e => removeImage(e)} folder="expertadvices" />
                        ))}
                    </div>
                </div>
            </Form>
        </Modal>
    );

};

const EmergenciesForm = Form.create()(EmergenciesFormScreen);
export default EmergenciesForm;