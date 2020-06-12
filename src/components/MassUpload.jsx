/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, notification, Input } from 'antd';
import * as func from '../providers/functions';

const DealersUploadScreen = props => {
    const { form: { validateFields, resetFields }, visible, module } = props;

    const [file, setFile] = useState(null);
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setModalTitle(`Mass upload ${module}`);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formChange = (e) => {
        var target = e.target.files[0];
        var fileInput = document.getElementById('file');
        var image = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function (r) {
            setFile(target);
        }
        reader.readAsDataURL(image);
    }

    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                setSubmitting(true);
                func.postFile(`${module}/uploads`, { file }).then((res) => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        props.onOK('post', res.data);
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

    const instructions = {
        dealers: [
            '<b>CONTACT-NUMBERS</b>: Comma separated values', '<b>DELIVERY</b>: Yes/No', '<b>MAKES</b>: Comma separated values',
            '<b>PARTS</b>: Comma separated values', '<b>IMAGES</b>: Comma separated values and must be available in the Gallery'
        ],
        mechanics: [
            '<b>CONTACT-NUMBERS</b>: Comma separated values', '<b>INSURED</b>: Yes/No', '<b>CERTIFICATIONS</b>: Comma separated values', '<b>TYPES</b>: Comma separated values',
            '<b>MAKES</b>: Comma separated values', '<b>PARTS</b>: Comma separated values', '<b>IMAGES</b>: Comma separated values and must be available in the Gallery'
        ],
        emergencies: [
            '<b>CATEGORY</b>: Must be the ID of the categories extracted',
            '<b>CONTACT-NUMBERS</b>: Comma separated values', '<b>INSURED</b>: Yes/No', '<b>CERTIFICATIONS</b>: Comma separated values',
            '<b>IMAGES</b>: Comma separated values and must be available in the Gallery'
        ],
        autoparts: [
            '<b>DEALER</b>: Must be the ID of the dealers extracted',
            '<b>MAKE</b>: Must be the same from the original excel', '<b>MODEL</b>: Must be the model attached to the make', '<b>IMAGES</b>: Comma separated values and must be available in the Gallery'
        ]
    };

    return (
        <Modal visible={visible} title={modalTitle} onCancel={() => props.onCancel()} destroyOnClose={true} width={1200} maskClosable={false}
            footer={[
                <Button key="back" type="danger" className="pull-left" disabled={submitting} onClick={() => props.onCancel()}>
                    Close
                </Button>,
                <Button key="submit" type="dark" disabled={file ? false : true} loading={submitting} onClick={submit}>
                    Upload
                </Button>
            ]}
            style={{ top: 20 }} className={`${errMessage ? 'animated shake' : ''}`}
        >
            <div className="row">
                <div className="col-lg-8">
                    <Form hideRequiredMark={false}>
                        {errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: errMessage }} />)}
                        <div className="alert alert-info pd-5 text-center">
                            <a href={`/assets/sample.${module}.csv`} target="_blank" rel="noopener noreferrer">Download sample template here</a>
                        </div>
                        <img className="img-thumbnail mg-b-15" src={`/assets/sample.${module}.png`} alt="" />
                        <Input id="file" className="form-controls" type="file" onChange={formChange} />
                    </Form>
                </div>
                <div className="col-lg-4 mg-t-20s">
                    <h4>Instructions</h4>
                    <div className="bg-gray-100 pd-10">
                        {(instructions[module] || []).map(instruction => (
                            <div className="mg-b-5 small" dangerouslySetInnerHTML={{ __html: instruction }} />
                        ))}
                        <div className="text-centers text-danger">Must be a .csv file</div>
                    </div>
                </div>
            </div>
        </Modal>
    );

};

const DealersUpload = Form.create()(DealersUploadScreen);
export default DealersUpload;