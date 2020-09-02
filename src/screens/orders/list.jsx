import React, { Component } from 'react';
import moment from 'moment';
import { Form, Pagination, Button, Select } from 'antd';
import * as func from '../../providers/functions';
import { FormattedNumber } from 'react-intl';
import OrderDetails from './components/order.details';

const limit = 25;
const rowStatus = [['info', 'Pending'], ['success', 'Paid'], ['danger', 'Payment failed']];
class Orders extends Component {

    state = {
        loading: false, loadingUsers: false, detailsModal: false,
        data: [], users: [], row: {},
        iuser: '', istatus: '',
        step: 0, currentStep: 1, total: 0
    }

    componentDidMount() {
        this.props.setPageTitle('Orders');
        this.getData();
        this.getUsers();
    }

    getUsers = () => {
        this.setState({ loadingUsers: true });
        func.get('users', { statuss: 1 }).then(res => {
            this.setState({ loadingUsers: false });
            if (res.status === 200) {
                this.setState({ users: res.data });
            } else {
                this.setState({ users: [] });
            }
        });
    }
    filter = () => {
        this.setState({ step: 0, currentStep: 1 }, () => {
            this.getData();
        });
    }
    getData = () => {
        this.setState({ loading: true, total: 0 });
        const { step, iuser, istatus } = this.state;
        func.get('orders', { user: iuser, status: istatus, orderby: 'crdate_desc', limit: `${step},${limit}` }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.data, total: res.count });
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
        this.setState({ currentStep: e, step: (e - 1) * limit }, () => {
            this.getData();
        });
    }

    render() {
        let i = this.state.step + 1;
        const { loading, data, total, currentStep, submitting, loadingUsers, users } = this.state;

        return (
            <React.Fragment>
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-body">
                        <div className="jumbotron">
                            <Form hideRequiredMark={false}>
                                <div className="row row-xs">
                                    <div className="col-2">
                                        <Select showSearch loading={loadingUsers} value={this.state.istatus} onChange={e => this.formChange(e, 'istatus')}>
                                            <Select.Option value="">All status</Select.Option>
                                            {rowStatus.map((status, i) => (
                                                <Select.Option key={i} value={i}>{status[1]}</Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-2">
                                        <Select showSearch loading={loadingUsers} optionFilterProp="children" value={this.state.iuser} onChange={e => this.formChange(e, 'iuser')}>
                                            <Select.Option value="">All users</Select.Option>
                                            {users.map(usr => (
                                                <Select.Option key={usr.uuid} value={usr.uuid}>{usr.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-2">
                                        <Button type="dark" size="small" onClick={this.filter}>Filter</Button>
                                    </div>
                                    <div className="col-8 text-right">

                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading === true && (<tr><td align="center" colSpan="15"><i className="fa fa-spin fa-spinner"></i> loading...</td></tr>)}
                                    {loading === false && data.length === 0 && (<tr><td align="center" colSpan="15">No records found</td></tr>)}

                                    {loading === false && (
                                        data.map((row) => (
                                            <tr key={row.uuid}>
                                                <td>{i++}</td>
                                                <td>{row.user.name}</td>
                                                <td>Ghs <FormattedNumber value={row.amount} /></td>
                                                <td><label className={`badge badge-${rowStatus[row.status][0]}`}>{rowStatus[row.status][1]}</label></td>
                                                <td>{moment(row.crdate).format('LLL')}</td>
                                                <td align="right">
                                                    <Button type="dark" size="small" loading={submitting} onClick={() => this.setState({ row, detailsModal: true })}>Details</Button>
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

                {this.state.detailsModal === true && (
                    <OrderDetails
                        {...this.props}
                        row={this.state.row}
                        rowStatus={rowStatus}
                        visible={this.state.detailsModal}
                        onCancel={() => this.setState({ row: {}, detailsModal: false })}
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

export default Orders;