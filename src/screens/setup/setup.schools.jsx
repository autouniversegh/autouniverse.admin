import React, { Component } from 'react';
import { Modal, Button, Form, Input, Select, Pagination, notification, Popconfirm } from 'antd';
import * as func from '../../providers/functions';

const limit = 12;
const defaultImage = '/assets/noimage.jpg';
const rowStatus = [<label className="badge badge-warning">Inactive</label>, <label className="badge badge-success">Active</label>];

class SetupSchoolsScreen extends Component {

    state = {
        loading: false,
        data: [], row: {}, istatus: '%', iname: '', modalTitle: '', modalAction: '', errMessage: '',
        step: 0, currentStep: 1, total: 0, edited: 0,
        image: defaultImage, file: null
    }

    componentDidMount() {
        this.props.setPageTitle('Manage schools');
        this.getData();
    }

    filter = () => {
        this.setState({ step: 0, currentStep: 1, edited: 0 }, () => {
            this.getData();
        });
    }
    getData = () => {
        this.setState({ loading: true, total: 0 });
        const { istatus, iname, step } = this.state;
        func.post('schools', { status: istatus, name: `%${iname}%`, limit: `${step},${limit}` }).then(res => {
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
        if (name === 'image') {
            var self = this, target = e.target.files[0];
            var imageInput = document.getElementById('image');
            var image = imageInput.files[0];
            var reader = new FileReader();
            reader.onload = function (r) {
                self.setState({ file: target, image: reader.result });
            }
            reader.readAsDataURL(image);
        } else {
            this.setState({ [name]: value });
        }
    }
    removeImage = () => {
        const { modalAction, row } = this.state;
        if (modalAction === 'insert') {
            this.setState({ image: defaultImage, file: null });
        } else {
            this.setState({ image: row.image_link, file: null });
        }
    }
    nextPrev = (e) => {
        this.setState({ currentStep: e, step: (e - 1) * limit, edited: 0 }, () => {
            this.getData();
        });
    }
    form = (row = {}) => {
        if (row.id) {
            this.setState({ modalTitle: 'Edit school', modalAction: 'update', row, image: row.image ? row.image_link : defaultImage, modalShow: !this.state.modalShow });
        } else {
            this.setState({ modalTitle: 'Add school', modalAction: 'insert', row, image: defaultImage, modalShow: !this.state.modalShow });
        }
    }
    submit = () => {
        const { file } = this.state;
        const { form: { validateFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                var image = this.state.row.image || '';
                this.setState({ submitting: true, errMessage: '' });
                if (file) {
                    func.postFile('upload', { folder: 'school', 'file[0]': file, filename: v.name }).then(res => {
                        if (res.status === 200) {
                            image = res.result;
                            this.submitGo(v, image);
                        } else {
                            this.setState({ submitting: false, errMessage: 'Unable to upload image' });
                        }
                    });
                } else {
                    this.submitGo(v, image);
                }
            }
        });
    }
    submitGo = (v, image) => {
        const { modalAction, row: { id }, data } = this.state;
        const { form: { resetFields } } = this.props;
        v['id'] = id;
        v['image'] = image;
        func.post(`schools/${modalAction}`, v).then((res) => {
            this.setState({ submitting: false });
            if (res.status === 200) {
                this.setState({ modalShow: false, edited: 0 });
                if (modalAction === 'update') {
                    let i = data.indexOf(data.filter(row => row.id === res.data.id)[0]);
                    data[i] = res.data;
                    this.setState({ data, edited: res.data.id });
                } else {
                    data.unshift(res.data);
                    this.setState({ data, edited: res.data.id });
                }
                this.removeImage();
                resetFields();
                notification.success({ message: res.result });
            } else {
                this.setState({ errMessage: res.result });
            }
        });
    }

    delete = (row) => {
        const { id } = row;
        this.setState({ submitting: true, edited: 0 });
        func.post(`schools/delete`, { id }).then((res) => {
            this.setState({ submitting: false });
            if (res.status === 200) {
                this.setState({ data: this.state.data.filter(row => row.id !== id) });
                notification.success({ message: res.result });
            } else {
                notification.error({ message: res.result });
            }
        });
    }

    render() {
        let i = this.state.step + 1;
        const { form: { getFieldDecorator } } = this.props;
        const { loading, data, row, submitting, total, currentStep, modalShow, modalTitle, modalAction, image, file, errMessage, edited } = this.state;

        return (
            <React.Fragment>
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-body">
                        <div className="jumbotron">
                            <Form hideRequiredMark={false}>
                                <div className="row row-xs">
                                    <div className="col-1">
                                        <Select showSearch={true} placeholder="Status" disabled={loading} onChange={e => this.formChange(e, 'istatus')}>
                                            <Select.Option value={'%'}>All status</Select.Option>
                                            <Select.Option value={1}>Active</Select.Option>
                                            <Select.Option value={0}>Inactive</Select.Option>
                                        </Select>
                                    </div>
                                    <div className="col-4">
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
                                        <th colSpan="2">#</th>
                                        <th>Code</th>
                                        <th>Name</th>
                                        <th>WhatsApp</th>
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
                                                <td>
                                                    <img className="img-thumbnail" src={row.image ? row.image_link : defaultImage} alt={row.name} width="50px" />
                                                </td>
                                                <td>{row.code}</td>
                                                <td>{row.name}</td>
                                                <td>{row.whatsapp || 'N/A'}</td>
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


                <Modal visible={modalShow} title={modalTitle} onCancel={() => this.setState({ modalShow: false })} destroyOnClose={true} width={1200} maskClosable={false}
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
                            <div className="col-3">
                                <img className="img-thumbnail" src={image} alt={row.name} width="100%" />
                                <input type="file" name="image" id="image" accept="image/*" onChange={this.formChange} className="hide" />
                                <div className="row row-xs">
                                    <div className="col-12">
                                        <Button type="dark" size="small" block className="mg-b-5" onClick={() => window.$('#image').click()}>Choose image</Button>
                                    </div>
                                    <div className="col-12">
                                        {file && (<Button type="danger" size="small" block onClick={this.removeImage}>Remove image</Button>)}
                                    </div>
                                </div>
                            </div>
                            <div className={'col-9'}>
                                <div className="row row-xs">
                                    <div className="col-12 col-lg-2">
                                        <Form.Item colon={false} label="Code">
                                            {getFieldDecorator('code', {
                                                rules: [{ required: true, message: <span /> }],
                                                initialValue: row.code
                                            })(
                                                <Input autoComplete="off" size="large" disabled={submitting} />
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-lg-10">
                                        <Form.Item colon={false} label="Name">
                                            {getFieldDecorator('name', {
                                                rules: [{ required: true, message: <span /> }],
                                                initialValue: row.name
                                            })(
                                                <Input autoComplete="off" size="large" disabled={submitting} />
                                            )}
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <Form.Item colon={false} label="WhatsApp link">
                                            {getFieldDecorator('whatsapp', {
                                                initialValue: row.whatsapp
                                            })(<Input autoComplete="off" size="large" disabled={submitting} />)}
                                        </Form.Item>
                                    </div>
                                    <div className="col-12 col-lg-6">
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
                                </div>
                                <div className="bg-gray-100 pd-15">
                                    <div className="row row-xs">
                                        <div className="col-12 col-lg-12">
                                            <Form.Item colon={false} label="Meta title">
                                                {getFieldDecorator('meta_title', {
                                                    initialValue: row.meta_title
                                                })(
                                                    <Input autoComplete="off" size="large" disabled={submitting} />
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className="col-12 col-lg-12">
                                            <Form.Item colon={false} label="Meta keywords">
                                                {getFieldDecorator('meta_keywords', {
                                                    initialValue: row.meta_keywords
                                                })(
                                                    <Input.TextArea rows={3} autoComplete="off" size="large" disabled={submitting} />
                                                )}
                                            </Form.Item>
                                        </div>
                                        <div className="col-12 col-lg-12">
                                            <Form.Item colon={false} label="Meta description">
                                                {getFieldDecorator('meta_description', {
                                                    initialValue: row.meta_description
                                                })(
                                                    <Input.TextArea rows={3} autoComplete="off" size="large" disabled={submitting} />
                                                )}
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </React.Fragment>
        );
    }
}

const SetupSchools = Form.create()(SetupSchoolsScreen);
export default SetupSchools;