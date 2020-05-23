/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, Select, notification, Tree } from 'antd';

import * as func from '../../../providers/functions';

const UsersAccessFormScreen = props => {
    const { row, form: { getFieldDecorator, validateFields, resetFields }, visible, _utils: { navigation } } = props;
    const menus = func.chunk(navigation.items, 3);

    const [method, setMethod] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [checkedKeys, setCheckedKeys] = useState([]);

    useEffect(() => {
        if (row.id) {
            setModalTitle('Edit category');
            setMethod('put');
            setCheckedKeys(row.access.split(','));
        } else {
            setModalTitle('Add category');
            setMethod('post');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addModule = (checkedKeys, inf) => {
        setCheckedKeys(checkedKeys.checked);
    }
    const checkModule = (mod) => {
        const adata = checkedKeys;
        if (func.inArray(mod, adata) === true || func.inArray('a', adata) === true) {
            return true;
        }
        return false;
    }

    const submit = e => {
        e.preventDefault();
        validateFields((err, v) => {
            if (!err) {
                setErrMessage('');
                setSubmitting(true);
                v['access'] = checkedKeys.join(',');
                func[method](`users-access${method === 'put' ? `/${row.uuid}` : ''}`, v).then((res) => {
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
                    <div className="col-12 col-lg-4">
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
                            <div className="col-12 col-lg-12">
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
                    <div className="col-12 col-lg-8">
                        <div className="bg-gray-100">

                            <Tree checkable={true} selectable={false} onCheck={addModule} defaultExpandAll={true} defaultCheckedKeys={[]} checkStrictly={true}
                            >
                                <div className="row">
                                    {menus.map(items => (
                                        <div className="col-4">
                                            {items.map(menu => (
                                                menu.code && (
                                                    <Tree.TreeNode title={menu.name} key={menu.code} disabled={submitting}>
                                                        {menu.children.length > 0 && (
                                                            menu.children.map(sub => (
                                                                <Tree.TreeNode title={sub.name} key={sub.code} checked={true} disabled={submitting}></Tree.TreeNode>
                                                            ))
                                                        )}
                                                    </Tree.TreeNode>
                                                )
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                            </Tree>
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    );

};

const UsersAccessForm = Form.create()(UsersAccessFormScreen);
export default UsersAccessForm;