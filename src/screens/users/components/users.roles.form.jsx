import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, notification, Tree, Select } from 'antd';
import * as func from '../../../providers/functions';

const UsersRolesFormScreen = props => {
    const { row, form: { getFieldDecorator, validateFields, resetFields }, utils: { menus }, modalShow, defaultImage } = props;

    const [checkedKeys, setCheckedKeys] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalAction, setModalAction] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (row.id) {
            setModalTitle('Edit role');
            setModalAction('update');
            setCheckedKeys(row.data.split(','));
        } else {
            setModalTitle('Add role');
            setModalAction('insert');
        }
        setTimeout(() => {
            window.init();
        }, 100);
    }, [row, defaultImage]);

    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                v['id'] = row.id;
                v['data'] = checkedKeys.join(',');
                func.post(`users/roles_${modalAction}`, v).then((res) => {
                    setSubmitting(false);
                    if (res.status === 200) {
                        props.onOK(modalAction, res.data);
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
        <Modal visible={modalShow} title={modalTitle} onCancel={() => props.onCancel()} destroyOnClose={true} width={600} maskClosable={false}
            footer={[
                <Button key="back" disabled={submitting} onClick={() => props.onCancel()}>
                    Close
                </Button>,
                <Button key="submit" type="primary" loading={submitting} onClick={submit}>
                    {modalAction}
                </Button>
            ]}
            style={{ top: 20 }} className={`${errMessage ? 'animated shake' : ''}`}
        >
            <Form hideRequiredMark={false}>
                {errMessage && (<div className="alert alert-danger">{errMessage}</div>)}
                <div className="row row-xs">
                    <div className="col-12 col-lg-8">
                        <Form.Item colon={false} label="Name">
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: <span /> }],
                                initialValue: row.name
                            })(
                                <Input autoComplete="off" size="large" disabled={submitting} />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-12 col-lg-4">
                        <Form.Item colon={false} label="Status">
                            {getFieldDecorator('status', {
                                rules: [{ required: true, message: <span /> }],
                                initialValue: row.id ? row.status : 1
                            })(
                                <Select size="large" placeholder="Choose one" disabled={submitting}>
                                    <Select.Option value={1}>Active</Select.Option>
                                    <Select.Option value={0}>Inactive</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-12 col-lg-12">
                        <div id="scroll" data-spy="scroll" data-target="#navExample1" className="pos-relative ht-400 bg-gray-100 pd-20">
                            <Tree checkable={true} selectable={false} onCheck={(e) => setCheckedKeys(e.checked)} defaultCheckedKeys={checkedKeys} defaultExpandAll={true} checkStrictly={true}
                            >
                                <Tree.TreeNode title="All roles" key="*" disabled={submitting}></Tree.TreeNode>
                                {menus.map(menu => (
                                    menu.code && (
                                        <Tree.TreeNode title={menu.name} key={menu.code} disabled={submitting}>
                                            {menu.subs.map(sub => (
                                                <Tree.TreeNode title={sub['name']} key={sub['code']} disabled={submitting}>
                                                    {sub.rules.map(sab => (
                                                        <Tree.TreeNode title={sab['name']} key={sab['code']} disabled={submitting}></Tree.TreeNode>
                                                    ))}
                                                </Tree.TreeNode>
                                            ))}
                                        </Tree.TreeNode>
                                    )
                                ))}
                            </Tree>
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    );

};

const UsersRolesForm = Form.create()(UsersRolesFormScreen);
export default UsersRolesForm;