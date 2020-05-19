import React, { Component } from 'react';
import { Modal, Button, Form, Input, Select, Pagination, notification, Popconfirm } from 'antd';
import * as func from '../../providers/functions';

const limit = 12;
const rowStatus = [<label className="badge badge-warning">Inactive</label>, <label className="badge badge-success">Active</label>];

class SetupLevelsScreen extends Component {

    state = {
        loading: false,
        data: [], row: {}, istatus: '%', iname: '', icategory: '%', modalTitle: '', modalAction: '', errMessage: '',
        step: 0, currentStep: 1, total: 0, edited: 0
    }

    componentDidMount() {
        this.props.setPageTitle('Setup: Manage academy levels');
        this.getData();
    }

    filter = () => {
        this.setState({ step: 0, currentStep: 1, edited: 0 }, () => {
            this.getData();
        });
    }
    getData = () => {
        this.setState({ loading: true, total: 0 });
        const { istatus, icategory, iname, step } = this.state;
        func.post('academy/levels', { status: istatus, category: icategory, name: `%${iname}%`, limit: `${step},${limit}` }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.result, total: res.count });
            } else {
                this.setState({ data: [] });
            }
        });
    }

    formChange = (e, name) => {
        name = name || e.target.name;
        let value = e.target ? e.target.value : e;
        this.setState({ [name]: value });
    }
    nextPrev = (e) => {
        this.setState({ currentStep: e, step: (e - 1) * limit, edited: 0 }, () => {
            this.getData();
        });
    }
    form = (row = {}) => {
        if (row.id) {
            this.setState({ modalTitle: 'Edit level', modalAction: 'update', row, modalShow: !this.state.modalShow });
        } else {
            this.setState({ modalTitle: 'Add level', modalAction: 'insert', row, modalShow: !this.state.modalShow });
        }
    }
    submit = () => {
        const { modalAction, row: { id }, data } = this.state;
        const { form: { validateFields, resetFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                v['id'] = id;
                this.setState({ submitting: true, errMessage: '' });
                func.post(`academy/levels_${modalAction}`, v).then((res) => {
                    this.setState({ submitting: false });
                    if (res.status === 200) {
                        this.setState({ modalShow: false, edited: 0 });
                        if (modalAction === 'update') {
                            let i = data.indexOf(data.filter(row => row.id === id)[0]);
                            data[i] = res.data;
                            this.setState({ data, edited: id });
                        } else {
                            data.unshift(res.data);
                            this.setState({ data, edited: id });
                        }
                        resetFields();
                        notification.success({ message: res.result });
                    } else {
                        this.setState({ errMessage: res.result });
                    }
                });
            }
        });
    }

    delete = (row) => {
        const { id } = row;
        this.setState({ submitting: true });
        func.post(`academy/levels_delete`, { id }).then((res) => {
            this.setState({ submitting: false });
            if (res.status === 200) {
                this.setState({ modalShow: false, edited: 0 });
                setTimeout(() => {
                    this.setState({ data: this.state.data.filter(row => row.id !== id) })
                }, 200);
                notification.success({ message: res.result });
            } else {
                notification.error({ message: res.result });
            }
        });
    }

    render() {
        let i = this.state.step + 1;
        const { form: { getFieldDecorator }, utils: { academyCategories } } = this.props;
        const { loading, data, row, submitting, total, currentStep, modalShow, modalTitle, modalAction, errMessage, istatus, icategory, edited } = this.state;

        return (
            <React.Fragment>
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-body">
                        <div className="jumbotron">
                            <Form hideRequiredMark={false}>
                                <div className="row row-xs">
                                    <div className="col-1">
                                        <Select showSearch={true} placeholder="Status" disabled={loading} value={istatus} onChange={e => this.formChange(e, 'istatus')}>
                                            <Select.Option value={'%'}>All status</Select.Option>
                                            <Select.Option value={1}>Active</Select.Option>
                                            <Select.Option value={0}>Inactive</Select.Option>
                                        </Select>
                                    </div>
                                    <div className="col-2">
                                        <Select placeholder="Choose one" optionFilterProp="children" disabled={loading} value={icategory} onChange={e => this.formChange(e, 'icategory')}>
                                            <Select.Option value={'%'}>All categories</Select.Option>
                                            {academyCategories.map(category => (
                                                <Select.Option key={category} value={category}>{category}</Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-3">
                                        <Input placeholder="Filter by name" disabled={loading} onPressEnter={this.filter} onChange={e => this.formChange(e, 'iname')} />
                                    </div>
                                    <div className="col-2">
                                        <Button type="primary" size="small" loading={loading} onClick={this.filter}>Filter</Button>
                                    </div>
                                    <div className="col-4 text-right">
                                        <Button type="dark" size="small" onClick={() => this.form()}>Add new</Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th width="1%">#</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading === true && (<tr><td align="center" colSpan="15">{func.fspinner_xs} loading...</td></tr>)}
                                    {loading === false && data.length === 0 && (<tr><td align="center" colSpan="15">No records found</td></tr>)}

                                    {loading === false && (
                                        data.map((row) => (
                                            <tr key={row.id} className={edited === row.id ? 'animated shake bg-gray-100' : ''}>
                                                <td>{i++}</td>
                                                <td>{row.name}</td>
                                                <td>{row.category}</td>
                                                <td>{row.description}</td>
                                                <td>{rowStatus[row.status]}</td>
                                                <td align="right">
                                                    <Button type="dark" size="small" className="mg-r-5" loading={submitting} onClick={() => this.form(row)}>Edit</Button>
                                                    <Popconfirm title="Are you sure?" okText="Yes, Delete" okButtonProps={{ type: 'danger', size: 'small' }} onConfirm={() => this.delete(row)}>
                                                        <Button type="danger" size="small" loading={submitting}>Delete</Button>
                                                    </Popconfirm>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            {!loading && total > limit && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}
                        </div>
                    </div>
                </div>


                <Modal visible={modalShow} title={modalTitle} onCancel={() => this.setState({ modalShow: false })} destroyOnClose={true} width={800} maskClosable={false}
                    footer={[
                        <Button key="back" disabled={submitting} onClick={() => this.setState({ modalShow: false })}>
                            Close
                        </Button>,
                        <Button key="submit" type="primary" loading={submitting} onClick={this.submit}>
                            {modalAction}
                        </Button>
                    ]}
                    style={{ top: 20 }} className={`${errMessage ? 'animated shake' : ''}`}
                >
                    <Form hideRequiredMark={false} onSubmit={this._submit}>
                        {errMessage && (<div className="alert alert-danger">{errMessage}</div>)}
                        <div className="row row-xs">
                            <div className="col-12 col-lg-4">
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
                                <Form.Item colon={false} label="Category">
                                    {getFieldDecorator('category', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: row.category
                                    })(
                                        <Select size="large" placeholder="Choose one" optionFilterProp="children" disabled={submitting}>
                                            {academyCategories.map(category => (
                                                <Select.Option key={category} value={category}>{category}</Select.Option>
                                            ))}
                                        </Select>
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
                                <Form.Item colon={false} label="Description">
                                    {getFieldDecorator('description', {
                                        initialValue: row.description
                                    })(
                                        <Input.TextArea rows={5} autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

const SetupLevels = Form.create()(SetupLevelsScreen);
export default SetupLevels;