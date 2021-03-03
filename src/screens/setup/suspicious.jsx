import React, { Component } from 'react';
import moment from 'moment';
import { Button, Form, notification, Input, InputNumber, Pagination } from 'antd';
import * as func from '../../providers/functions';
import { FormattedNumber } from 'react-intl';

const limit = 25;
class SetupSuspicious extends Component {

    state = {
        loading: false, submitting: false,
        data: [], errMessage: '',
        step: 0, currentStep: 1, total: 0,
    }

    componentDidMount() {
        this.props.setPageTitle('Setup: Suspicious users');
        this.getData();
    }

    getData = () => {
        this.setState({ loading: true, total: 0 });
        const { step } = this.state;
        func.get('suspicious', { orderby: 'crdate_desc', limit: `${step},${limit}`, status: 1 }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.data, total: res.count });
            } else {
                this.setState({ data: [] });
            }
        });
    }

    submit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, v) => {
            if (!err) {
                this.setState({ submitting: true, errMessage: '' });
                func.put('settings', v).then(res => {
                    this.setState({ submitting: false });
                    if (res.status === 200) {
                        notification.success({ message: res.message });
                    } else {
                        if (res.status === 412) {
                            this.setState({ errMessage: res.data.join('<br />') });
                        } else {
                            this.setState({ errMessage: res.message });
                        }
                    }
                });
            }
        });
    }

    render() {
        let i = this.state.step + 1;
        const { loading, data, total, currentStep } = this.state;
        const { _utils: { settings }, form: { getFieldDecorator } } = this.props;
        const setForms = [
            { label: 'Count', name: 'count', required: true },
            { label: 'Time span (days)', name: 'span', required: true },
            { label: 'Whom to notify (026,024)', name: 'notify', input: <Input autoComplete="off" size="large" disabled={this.state.submitting} /> },
        ];

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header">All suspicious users</div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>User</th>
                                                <th>Service</th>
                                                <th>Count</th>
                                                <th>Date</th>
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
                                                        <td>{row.service}</td>
                                                        <td><FormattedNumber value={row.count} /></td>
                                                        <td>{moment(row.crdate).format('LLL')}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    {!loading && total > limit && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <Form onSubmit={this.submit}>
                            {this.state.errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: this.state.errMessage }} />)}
                            <div className="card mg-b-25">
                                <div className="card-header">Settings</div>
                                <div className="card-body">
                                    <div className="row">
                                        {setForms.map(row => (
                                            <div className="col-12 col-lg-12">
                                                <Form.Item colon={false} label={row.label}>
                                                    {getFieldDecorator(`suspicious[${row.name}]`, {
                                                        rules: [{ required: row.required, message: <span /> }],
                                                        initialValue: settings.suspicious[row.name],
                                                    })(
                                                        row.input ? row.input : <InputNumber autoComplete="off" size="large" disabled={this.state.submitting} />
                                                    )}
                                                </Form.Item>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="card mg-b-25">
                                <div className="card-header">
                                    <Button type="primary" htmlType="submit" loading={this.state.submitting}>&nbsp; Save changes &nbsp;</Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Form.create()(SetupSuspicious);