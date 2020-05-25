/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, notification, Upload } from 'antd';

import * as func from '../../providers/functions';

const GalleryFormScreen = props => {
    const { form: { resetFields }, visible } = props;

    const [method, setMethod] = useState('');
    const [images, setImages] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setModalTitle('Add images to gallery');
        setMethod('post');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = e => {
        e.preventDefault();
        setErrMessage('');
        setSubmitting(true);
        func[method](`gallery`, { images: Object.values(images) }).then((res) => {
            setSubmitting(false);
            if (res.status === 200) {
                props.onOK();
                props.onCancel();
                setImages([]);
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

    const upProps = {
        multiple: true,
        accept: 'image/*',
        name: 'file[0]',
        action: `${func.api.apiURL}upload`,
        data: { folder: 'gallery' },
        headers: {
            'x-access-token': func.api.apiKey + '.' + func.api.apiToken
        },
        onChange(e) {
            if (e.file.status === 'done') {
                if (e.file.response.status === 200) {
                    images[e.file.response.data[0]] = e.file.response.data[0];
                    setImages(images);
                }
            }
        },
        onRemove(e) {
            func.delte(`upload/gallery/${e.response.data[0]}`);
        }
    }

    return (
        <Modal visible={visible} title={modalTitle} onCancel={() => props.onCancel()} destroyOnClose={true} width={900} maskClosable={false}
            footer={[
                <Button key="back" disabled={submitting} onClick={() => props.onCancel()}>
                    Close
                </Button>,
                <Button key="submit" type="dark" loading={submitting} onClick={submit}>
                    Submit
                </Button>
            ]}
            style={{ top: 20 }} className={`${errMessage ? 'animated shake' : ''}`}
        >
            <Form hideRequiredMark={false}>
                {errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: errMessage }} />)}
                <Upload.Dragger {...upProps} style={{ width: '100%' }}>
                    <div>&nbsp;</div>
                    <p className="ant-upload-drag-icon">
                        <i className="fa fa-upload fa-2x text-primary"></i>
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <div>&nbsp;</div>
                </Upload.Dragger>
            </Form>
        </Modal>
    );

};

const GalleryForm = Form.create()(GalleryFormScreen);
export default GalleryForm;