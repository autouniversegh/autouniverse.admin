import React, { Component } from 'react';
import { Button, Form, Input, Select, Pagination, notification } from 'antd';
import * as func from '../../providers/functions';
import moment from 'moment';

import UsersForm from './components/users.form';

const limit = 12;
const defaultImage = '/assets/noimage.jpg';
const rowStatus = [['warning', 'Not active'], ['success', 'Active'], ['danger', 'Deleted']];

class UsersList extends Component {

    state = {
        loading: false, formModal: false, formType: '',
        data: [], access: [], row: {}, pathname: 'XXL', edited: 0, manipulate: 0,
        istatus: '%', iname: '', iaccess: '%',
        step: 0, currentStep: 1, total: 0
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate() {
        if (this.state.pathname !== window.location.pathname) {
            this.setState({ pathname: window.location.pathname, edited: 0 }, () => {
                this.props.setPageTitle('Users');
                this.getData();
            });
        }
    }

    filter = () => {
        this.setState({ step: 0, currentStep: 1, edited: 0 }, () => {
            this.getData();
        });
    }
    getData = () => {
        this.setState({ loading: true, total: 0 });
        const { params } = this.props;
        const { istatus, iname, iaccess, step } = this.state;
        params['name'] = `%${iname}%`;
        params['access'] = iaccess;
        params['status'] = istatus;
        params['limit'] = `${step},${limit}`;
        func.get('users', params).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.data, total: res.count });
            } else {
                this.setState({ data: [] });
            }
        });

        func.get('users-access', { status: 1, orderby: 'name_asc' }).then(res => {
            if (res.status === 200) {
                this.setState({ access: res.data });
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

    delete = (row) => {
        const { uuid } = row;
        this.setState({ submitting: true, edited: 0 });
        func.delte(`users/${row.uuid}`).then((res) => {
            this.setState({ submitting: false });
            if (res.status === 200) {
                this.setState({ data: this.state.data.filter(row => row.uuid !== uuid) });
                notification.success({ message: res.message });
            } else {
                notification.error({ message: res.message });
            }
        });
    }

    render() {
        let i = this.state.step + 1;
        const { loading, data, submitting, total, currentStep, edited, istatus, access } = this.state;

        return (
            <React.Fragment>
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-body">
                        <div className="jumbotron">
                            <Form hideRequiredMark={false}>
                                <div className="row row-xs">
                                    <div className="col-2">
                                        <Select showSearch={true} placeholder="Status" value={istatus} disabled={loading} onChange={e => this.formChange(e, 'istatus')}>
                                            <Select.Option value={'%'}>All status</Select.Option>
                                            <Select.Option value={1}>Active</Select.Option>
                                            <Select.Option value={0}>Inactive</Select.Option>
                                        </Select>
                                    </div>
                                    <div className="col-3">
                                        <Input placeholder="Search by name" disabled={loading} onPressEnter={this.filter} onChange={e => this.formChange(e, 'iname')} />
                                    </div>
                                    {this.props.params.admin === 1 && (
                                        <div className="col-2">
                                            <Select autoComplete="off" showSearch disabled={loading} value={this.state.iaccess} onChange={e => this.formChange(e, 'iaccess')}>
                                                <Select.Option value={'%'}>All access</Select.Option>
                                                {access.map(ctg => (
                                                    <Select.Option value={ctg.uuid} key={ctg.uuid}>{ctg.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </div>
                                    )}
                                    <div className="col-2">
                                        <Button type="primary" size="small" loading={loading} onClick={this.filter}>Search</Button>
                                    </div>
                                    <div className="col-3 text-right">
                                        {func.hasR('usr_add') && (
                                            <Button type="dark" size="small" onClick={() => this.setState({ row: {}, formModal: true, formType: '' })}><i className="icon-plus"></i> &nbsp; Add new</Button>
                                        )}
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th colSpan={2}>#</th>
                                        <th>Name</th>
                                        <th>Details</th>
                                        {this.props.params.admin === 1 && (
                                            <th>Access</th>
                                        )}
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading === true && (<tr><td align="center" colSpan="15"><i className="fa fa-spin fa-spinner"></i> loading...</td></tr>)}
                                    {loading === false && data.length === 0 && (<tr><td align="center" colSpan="15">No records found</td></tr>)}

                                    {loading === false && (
                                        data.map((row) => (
                                            <tr key={row.uuid} className={edited === row.uuid ? 'animated shake bg-gray-100' : ''}>
                                                <td>{i++}</td>
                                                <td><img className="img-thumbnail img-circle" width="50px" src={row.avatar ? row.avatar_link : defaultImage} alt={row.name} /></td>
                                                <td>{row.name}</td>
                                                <td>
                                                    Email: {row.email} <br />
                                                    Phone: {row.phone} <br />
                                                </td>
                                                {this.props.params.admin === 1 && (
                                                    <td>{row.access.name}</td>
                                                )}
                                                <td><label className={`badge badge-${rowStatus[row.status][0]}`}>{rowStatus[row.status][1]}</label></td>
                                                <td>{moment(row.crdate).format('LLL')}</td>
                                                <td align="right">
                                                    {row.status !== 2 && func.hasR('usr_upd') && (
                                                        <Button type="dark" size="small" loading={submitting} onClick={() => this.setState({ row, formModal: true, formType: '' })}>Edit</Button>
                                                    )}
                                                    {' '}
                                                    {/* {func.hasR('usr_sus') && (
                                                        <Popconfirm title="Are you sure?" okText="Yes, Suspend" okButtonProps={{ type: 'warning', size: 'small' }} onConfirm={() => this.delete(row)}>
                                                            <Button type="warning" size="small" loading={submitting}>Suspend</Button>
                                                        </Popconfirm>
                                                    )} */}
                                                    {' '}
                                                    {func.hasR('usr_res') && (
                                                        <Button type="dark" size="small" loading={submitting} onClick={() => this.setState({ row, formModal: true, formType: 'reset' })}>Reset</Button>
                                                    )}
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


                {this.state.formModal === true && (
                    <UsersForm
                        {...this.props}
                        row={this.state.row}
                        type={this.state.formType}
                        visible={this.state.formModal}
                        access={this.state.access}
                        onCancel={() => this.setState({ row: {}, formModal: false })}
                        onOK={(a, e) => {
                            this.setState({ edited: 0 });
                            setTimeout(() => {
                                if (a === 'put') {
                                    let i = data.indexOf(data.filter(row => row.uuid === e.uuid)[0]);
                                    data[i] = e;
                                    this.setState({ data, edited: e.uuid });
                                } else {
                                    data.unshift(e);
                                    this.setState({ data, edited: e.uuid });
                                }
                            }, 200);
                        }}
                    />
                )}


            </React.Fragment>
        );
    }
}

export default UsersList;