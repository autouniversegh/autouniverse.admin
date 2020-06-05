import React, { Component } from 'react';
import moment from 'moment';
import { Button, Form, Pagination, DatePicker } from 'antd';
import { CSVLink } from 'react-csv';
import * as func from '../../providers/functions';

const limit = 25;
class ReportsSubscriptions extends Component {

    state = {
        loading: false, formModal: false,
        data: [], csvData: [], row: {},
        pathname: '', itype: 'subscriptions',
        step: 0, currentStep: 1, total: 0,
        between: [moment(), moment()]
    }

    componentDidMount() {
        this.setPage();

        func.get('subscriptions', { orderby: 'crdate_desc', status: 1 }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({
                    csvData: res.data.map(row => {
                        return {
                            'ID': row.uuid,
                            'User': row.user.name,
                            'Package Title': row.package.title,
                            'Package Amount': 'Ghs ' + row.package.amount,
                            'Package Duration': row.package.duration + ' months',
                            'Purchase Date': moment(row.crdate).format('LLL'),
                            'Expiry Date': moment(row.exdate).format('LLL')
                        }
                    })
                });
            }
        });
    }

    setPage() {
        this.props.setPageTitle('Reports: Subscriptions');
        this.getData();
    }

    filter = () => {
        this.setState({ step: 0, currentStep: 1 }, () => {
            this.getData();
        });
    }
    getData = () => {
        this.setState({ loading: true, total: 0 });
        const { step, between } = this.state;
        func.get('subscriptions', { orderby: 'crdate_desc', between: `crdate_${moment(between[0]).format('YYYY-MM-DD')}_${moment(between[1]).format('YYYY-MM-DD')}`,  limit: `${step},${limit}` }).then(res => {
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
        this.setState({ [name]: value }, () => {
            this.getData();
        });
    }
    nextPrev = (e) => {
        this.setState({ currentStep: e, step: (e - 1) * limit }, () => {
            this.getData();
        });
    }

    render() {
        let i = this.state.step + 1;
        const { loading, data, csvData, total, currentStep, itype } = this.state;

        return (
            <React.Fragment>
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-body">
                        <div className="jumbotron">
                            <Form hideRequiredMark={false}>
                                <div className="row row-xs">
                                    <div className="col-4">
                                        <DatePicker.RangePicker size="large" value={this.state.between} onChange={between => {
                                            this.setState({ between }, () => {
                                                this.getData();
                                            });
                                        }} />
                                    </div>
                                    <div className="col-8 text-right">
                                        <Button type="dark" size="small" loading={loading}>
                                            <CSVLink data={csvData} filename={`${itype}-${func.dates.td}.csv`} target="_blank">
                                                Download Report
                                            </CSVLink>
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User</th>
                                        <th>Package</th>
                                        <th>Purchase date</th>
                                        <th>Expirty date</th>
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
                                                <td>
                                                    <b>Title</b>: {row.package.title} <br />
                                                    <b>Amount</b>: Ghs{row.package.amount} <br />
                                                    <b>Duration</b>: {row.package.duration}
                                                </td>
                                                <td>{moment(row.crdate).format('LLL')}</td>
                                                <td>{moment(row.exdate).format('LLL')}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            {!loading && total > limit && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}
                        </div>
                    </div>
                </div>


            </React.Fragment>
        );
    }
}

export default ReportsSubscriptions;