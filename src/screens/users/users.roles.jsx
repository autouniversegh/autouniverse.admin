import React, { Component } from 'react';
import { Button, Form, Select, Pagination, notification, Popconfirm } from 'antd';
import * as func from '../../providers/functions';
import moment from 'moment';

import UsersRolesForm from './components/users.roles.form';

const limit = 25;
const defaultImage = '/assets/noimage.jpg';
const rowStatus = [['warning', 'Not active'], ['success', 'Active'], ['danger', 'Banned']];

class UsersRoles extends Component {

    state = {
        loading: false, usersModal: false, modalShow: false,
        data: [], row: {}, pathname: '', edited: 0,
        istatus: '%', iname: '',
        step: 0, currentStep: 1, total: 0
    }

    componentDidMount() {
        this.props.setPageTitle('Manage user roles');
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
        func.post('users/roles', { name: `%${iname}%`, limit: `${step},${limit}`, status: istatus }).then(res => {
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

    action = (row, status) => {
        const { id } = row;
        this.setState({ submitting: true, edited: 0 });
        func.post(`users/roles_delete`, { id, status }).then((res) => {
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
        const { loading, data, submitting, total, currentStep, edited, istatus } = this.state;

        return (
            <React.Fragment>
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-body">
                        <div className="jumbotron">
                            <Form hideRequiredMark={false}>
                                <div className="row row-xs">
                                    <div className="col-2">
                                        <Select showSearch={true} size="large" placeholder="Status" value={istatus} disabled={loading} onChange={e => this.formChange(e, 'istatus')}>
                                            <Select.Option value={'%'}>All status</Select.Option>
                                            <Select.Option value={1}>Active</Select.Option>
                                            <Select.Option value={0}>Not active</Select.Option>
                                        </Select>
                                    </div>
                                    <div className="col-2">
                                        <Button type="primary" loading={loading} onClick={this.filter}>Filter</Button>
                                    </div>
                                    <div className="col-8 text-right">
                                        <Button type="dark" onClick={() => this.setState({ row: {}, modalShow: true })}>Add new</Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Created</th>
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
                                                <td><label className={`badge badge-${rowStatus[row.status][0]}`}>{rowStatus[row.status][1]}</label></td>
                                                <td>{moment(row.crdate).format('D.MMM.YY')}</td>
                                                <td align="right">
                                                    <Button type="dark" size="small" className="mg-r-5" loading={submitting} onClick={() => this.setState({ row, modalShow: true })}>Edit</Button>

                                                    <Popconfirm title="Are you sure?" okText="Yes, Delete" okButtonProps={{ type: 'danger', size: 'small' }} onConfirm={() => this.action(row, 1)}>
                                                        <Button type="danger" size="small" className="mg-r-5" loading={submitting}>Delete</Button>
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


                {this.state.modalShow && (
                    <UsersRolesForm
                        {...this.props}
                        row={this.state.row}
                        modalShow={this.state.modalShow}
                        defaultImage={defaultImage}
                        onCancel={() => this.setState({ row: {}, modalShow: false })}
                        onOK={(a, e) => {
                            this.setState({ edited: 0 });
                            setTimeout(() => {
                                if (a === 'update') {
                                    let i = data.indexOf(data.filter(row => row.id === e.id)[0]);
                                    data[i] = e;
                                    this.setState({ data, edited: e.id });
                                } else {
                                    data.unshift(e);
                                    this.setState({ data, edited: e.id });
                                }
                            }, 200);
                        }}
                    />
                )}


            </React.Fragment>
        );
    }
}

export default UsersRoles;