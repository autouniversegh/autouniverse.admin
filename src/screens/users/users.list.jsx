import React, { Component } from 'react';
import { Button, Form, Input, Select, Pagination, notification, Popconfirm } from 'antd';
import * as func from '../../providers/functions';
import moment from 'moment';

import UsersForm from './components/users.form';
import UsersFormTutor from './components/users.form.tutor';

const limit = 25;
const defaultImage = '/assets/noimage.jpg';
const rowStatus = [['warning', 'Not active'], ['success', 'Active'], ['danger', 'Banned']];

class UsersList extends Component {

    state = {
        loading: false, tutorModal: false, modalShow: false,
        data: [], row: {}, pathname: '', edited: 0,
        istatus: '%', icategory: '%', iname: '', iusername: '', admin: 0,
        step: 0, currentStep: 1, total: 0
    }

    componentDidMount() {
        this.setPage();
    }
    componentDidUpdate() {
        const { pathname } = this.state;
        if (pathname !== this.props.location.pathname) {
            this.setState({ pathname: this.props.location.pathname, params: this.props.params, data: [], edited: 0, istatus: '%', icategory: '%', iname: '', iusername: '' }, () => {
                this.setPage();
            });
        }
    }
    setPage() {
        this.props.setPageTitle(this.props.params.admin === 1 ? 'Manage admins' : 'Manage users');
        this.getData();
    }

    filter = () => {
        this.setState({ step: 0, currentStep: 1, edited: 0 }, () => {
            this.getData();
        });
    }
    getData = () => {
        this.setState({ loading: true, total: 0 });
        const { istatus, iname, icategory, iusername, step } = this.state;
        const { params } = this.props;
        func.post('users', func.mergeObj(params, { name: `%${iname}%`, username: `%${iusername}%`, limit: `${step},${limit}`, status: istatus, category: icategory })).then(res => {
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
        func.post(`users/action`, { id, status }).then((res) => {
            this.setState({ submitting: false });
            if (res.status === 200) {
                let data = this.state.data;
                let i = data.indexOf(data.filter(row => row.id === res.data.id)[0]);
                data[i] = res.data;
                this.setState({ data, edited: id });
                notification.success({ message: res.result });
            } else {
                notification.error({ message: res.result });
            }
        });
    }

    render() {
        let i = this.state.step + 1;
        const { utils: { studentCategories }, params: { admin, type } } = this.props;
        const { loading, data, submitting, total, currentStep, edited, istatus, icategory, iusername, iname } = this.state;

        return (
            <React.Fragment>
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-body">
                        <div className="jumbotron">
                            <Form hideRequiredMark={false}>
                                <div className="row row-xs">
                                    <div className="col-1">
                                        <Select showSearch={true} placeholder="Status" value={istatus} disabled={loading} onChange={e => this.formChange(e, 'istatus')}>
                                            <Select.Option value={'%'}>All status</Select.Option>
                                            <Select.Option value={1}>Active</Select.Option>
                                            <Select.Option value={0}>Not active</Select.Option>
                                        </Select>
                                    </div>
                                    <div className="col-2">
                                        <Select autoComplete="off" value={icategory} disabled={loading} onChange={e => this.formChange(e, 'icategory')}>
                                            <Select.Option value={'%'}>All categories</Select.Option>
                                            {studentCategories.map(category => (
                                                <Select.Option key={category} value={category}>{category}</Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-2">
                                        <Input placeholder="Filter by username" value={iusername} disabled={loading} onPressEnter={this.filter} onChange={e => this.formChange(e, 'iusername')} />
                                    </div>
                                    <div className="col-2">
                                        <Input placeholder="Filter by name" value={iname} disabled={loading} onPressEnter={this.filter} onChange={e => this.formChange(e, 'iname')} />
                                    </div>
                                    <div className="col-2">
                                        <Button type="primary" size="small" loading={loading} onClick={this.filter}>Filter</Button>
                                    </div>
                                    <div className="col-3 text-right">

                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th colSpan="2">#</th>
                                        <th>Username</th>
                                        {type === 0 && (
                                            <th>Category</th>
                                        )}
                                        {type === 0 && (
                                            <th>Contact details</th>
                                        )}
                                        {type === 0 && (
                                            <th>Cash details</th>
                                        )}
                                        {admin === 1 && (
                                            <th>Role</th>
                                        )}
                                        {type === 1 && (
                                            <th>Academy</th>
                                        )}
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
                                                <td width="7%">
                                                    <img className="img-thumbnail" src={row.avatar ? row.avatar_link : defaultImage} alt={row.username} width="100%" />
                                                </td>
                                                <td>@{row.username}</td>
                                                {type === 0 && (
                                                    <td>{row.category}</td>
                                                )}
                                                {type === 0 && (
                                                    <td>
                                                        <div>Email: {row.email || 'N/A'}</div>
                                                        <div>Phone: {row.phone || 'N/A'}</div>
                                                        <div>State: {row.state || 'N/A'}</div>
                                                        <div>Address: {row.address || 'N/A'}</div>
                                                    </td>
                                                )}
                                                {type === 0 && (
                                                    <td>
                                                        <div>Coins: {row.coins_nf}</div>
                                                        <div>Wallet: ₦{row.wallet_nf}</div>
                                                    </td>
                                                )}
                                                {admin === 1 && (
                                                    <td>{row.role.name}</td>
                                                )}
                                                {type === 1 && (
                                                    <td>
                                                        <div>School: {row.tutor.school.name}</div>
                                                        <div>Dep: {row.tutor.department.name}</div>
                                                        <div>Courses: {row.tutor.courses.map(crs => <span>{crs.title}, </span>)}</div>
                                                    </td>
                                                )}
                                                <td><label className={`badge badge-${rowStatus[row.status][0]}`}>{rowStatus[row.status][1]}</label></td>
                                                <td>{moment(row.crdate).format('D.MMM.YY')}</td>
                                                <td align="right">
                                                    {row.status !== 2 && func.hasR('usr_ban') && (
                                                        <Popconfirm title="Are you sure?" okText="Yes, Ban" okButtonProps={{ type: 'danger', size: 'small' }} onConfirm={() => this.action(row, 2)}>
                                                            <Button type="danger" size="small" className="mg-r-5" loading={submitting}>Ban</Button>
                                                        </Popconfirm>
                                                    )}
                                                    {row.status === 2 && func.hasR('usr_ban') && (
                                                        <Popconfirm title="Are you sure?" okText="Yes, UnBan" okButtonProps={{ type: 'success', size: 'small' }} onConfirm={() => this.action(row, 1)}>
                                                            <Button type="success" size="small" className="mg-r-5" loading={submitting}>UnBan</Button>
                                                        </Popconfirm>
                                                    )}
                                                    {row.admin === 0 && func.hasR('usr_adm') && type === 0 && (
                                                        <Button type="dark" size="small" className="mg-r-5" loading={submitting} onClick={() => this.setState({ row, modalShow: true })}>Make admin</Button>
                                                    )}
                                                    {row.admin === 1 && func.hasR('usr_adm') && type === 0 && (
                                                        <Button type="dark" size="small" className="mg-r-5" loading={submitting} onClick={() => this.setState({ row, modalShow: true })}>UnMake admin</Button>
                                                    )}
                                                    {func.hasR('usr_tut') && (
                                                        <Button type="dark" size="small" className="mg-r-5" loading={submitting} onClick={() => this.setState({ row, tutorModal: true })}>{row.tutor.id ? 'Edit' : 'Make'} Tutor</Button>
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


                {this.state.modalShow && (
                    <UsersForm
                        row={this.state.row}
                        visible={this.state.modalShow}
                        defaultImage={defaultImage}
                        onCancel={() => this.setState({ row: {}, modalShow: false })}
                        onOK={e => {
                            this.setState({ edited: 0 });
                            setTimeout(() => {
                                this.setState({ data: this.state.data.filter(row => row.id !== e.id) });
                            }, 200);
                        }}
                    />
                )}

                {this.state.tutorModal && (
                    <UsersFormTutor
                        row={this.state.row}
                        visible={this.state.tutorModal}
                        onCancel={() => this.setState({ row: {}, tutorModal: false })}
                        onOK={e => {
                            this.setState({ edited: 0 });
                            setTimeout(() => {
                                if (this.props.params.type === 0) {
                                    this.setState({ data: this.state.data.filter(row => row.id !== e.id) });
                                } else {
                                    this.setState({ edited: e.id });
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