/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, notification } from 'antd';

import * as func from '../../providers/functions';
import { GalleryContent, GalleryImageCard } from '../../components';

const GalleryFormScreen = props => {
    const { visible } = props;

    const [method, setMethod] = useState('');
    const [images, setImages] = useState({ names: [], links: [] });
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setModalTitle('Add images to gallery');
        setMethod('post');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadSuccess = (data) => {
        images.names.push(data.name);
        images.links.push(data.link);

        setImages(images);
        setSubmitting(true); setSubmitting(false);
    }
    const remove = (image) => {
        let i = images.names.indexOf(image);
        images.names.splice(i, 1);
        images.links.splice(i, 1);

        setImages(images);
        setSubmitting(true); setSubmitting(false);
    }

    const submit = e => {
        e.preventDefault();
        setErrMessage('');
        setSubmitting(true);
        func[method](`gallery`, { images: images.names }).then((res) => {
            setSubmitting(false);
            if (res.status === 200) {
                props.onOK();
                props.onCancel();
                setImages({ names: [], links: [] });
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
            {errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: errMessage }} />)}
            <GalleryContent folder="gallery" multiple={true} showUploadList={false} uploadSuccess={uploadSuccess} />
            <div className="clearfix" />
            <div className="row">
                {images.links.map((link, i) => (
                    <div className="col-12 col-lg-12">
                        <GalleryImageCard imgLink={link} img={images.names[i]} onRemove={e => remove(e)} folder="gallery" />
                    </div>
                ))}
            </div>
        </Modal>
    );

};

const GalleryForm = Form.create()(GalleryFormScreen);
export default GalleryForm;