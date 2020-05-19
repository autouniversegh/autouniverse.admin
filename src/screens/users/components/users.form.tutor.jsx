import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Select, notification } from 'antd';
import * as func from '../../../providers/functions';

const UsersFormTutorScreen = props => {
    const { row, form: { getFieldDecorator, getFieldValue, validateFields, resetFields }, visible } = props;

    const [courses, setCourses] = useState([]);
    const [schools, setSchools] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (row.tutor.id) {
            setModalTitle('Edit tutor');
            getDepartments();
            getCourses();
        } else {
            setModalTitle('Make tutor');
        }
        func.post('schools', { status: 1, orderby: 'name_asc' }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setSchools(res.result);
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [row]);

    const getDepartments = () => {
        setTimeout(() => {
            setLoading(true);
            let school = getFieldValue('school');
            func.post('academy/departments', { status: 1, school, orderby: 'name_asc' }).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    setDepartments(res.result);
                }
            });
        }, 100);
    }

    const getCourses = () => {
        setTimeout(() => {
            let school = getFieldValue('school');
            let department = getFieldValue('department');
            if (school && department) {
                setLoading(true);
                func.post('academy/courses', { status: 1, school, department, orderby: 'title_asc' }).then(res => {
                    setLoading(false);
                    if (res.status === 200) {
                        setCourses(res.result);
                    }
                });
            }
        }, 100);
    }


    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                setSubmitting(true);
                v['user'] = row.id;
                v['courses'] = v['courses'].join(',');
                func.post(`users/makeTutor`, v).then((res) => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        props.onOK(res.data);
                        props.onCancel();
                        resetFields();
                        notification.success({ message: res.result });
                    } else {
                        setErrMessage(res.result);
                    }
                });
            }
        });
    }

    return (
        <Modal visible={visible} title={modalTitle} onCancel={() => props.onCancel()} destroyOnClose={true} width={700} maskClosable={false}
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
                {errMessage && (<div className="alert alert-danger">{errMessage}</div>)}
                <div className="row row-xs">
                    <div className="col-12 col-lg-6">
                        <Form.Item colon={false} label="School">
                            {getFieldDecorator('school', {
                                rules: [{ required: true, message: <span /> }],
                                initialValue: row.tutor.id && row.tutor.school.id
                            })(
                                <Select size="large" placeholder="Choose one" showSearch={true} optionFilterProp="children" disabled={submitting || loading} loading={loading} onChange={getDepartments}>
                                    {schools.map(sch => (
                                        <Select.Option key={sch.id} value={sch.id}>{sch.name}</Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-12 col-lg-6">
                        <Form.Item colon={false} label="Department">
                            {getFieldDecorator('department', {
                                rules: [{ required: true, message: <span /> }],
                                initialValue: row.tutor.id && row.tutor.department.id
                            })(
                                <Select size="large" placeholder="Choose one" showSearch={true} optionFilterProp="children" disabled={submitting || loading} loading={loading} onChange={getCourses}>
                                    {departments.map(dep => (
                                        <Select.Option key={dep.id} value={dep.id}>{dep.name}</Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-12 col-lg-12">
                        <Form.Item colon={false} label="Courses">
                            {getFieldDecorator('courses', {
                                rules: [{ required: true, message: <span /> }],
                                initialValue: row.tutor.id && row.tutor.courses.map(crs => { return crs.id; })
                            })(
                                <Select size="large" mode="multiple" placeholder="Choose one" optionFilterProp="children" disabled={submitting || loading} loading={loading}>
                                    {courses.map(crs => (
                                        <Select.Option key={crs.id} value={crs.id}>{crs.title}</Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                </div>
            </Form>
        </Modal>
    );

};

const UsersFormTutor = Form.create()(UsersFormTutorScreen);
export default UsersFormTutor;