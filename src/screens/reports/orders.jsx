import React, { Component } from 'react';
import moment from 'moment';
import { Form, Pagination, DatePicker } from 'antd';
// import { CSVLink } from 'react-csv';
import * as func from '../../providers/functions';

const limit = 25;
class ReportsOrders extends Component {

    state = {
        loading: false,
        data: [], csvData: [], row: {},
        pathname: '', itype: 'orders',
        step: 0, currentStep: 1, total: 0,
        between: [moment(), moment()]
    }

    componentDidMount() {
        this.setPage();
    }

    setPage() {
        this.props.setPageTitle('Reports: Orders');
        this.getData();
    }

    filter = () => {
        this.setState({ step: 0, currentStep: 1 }, () => {
            this.getData();
        });
    }
    getData = () => {
        this.setState({ loading: true, total: 0 });
        const { step, itype, between } = this.state;
        func.get(itype, { orderby: 'crdate_desc', between: `crdate_${moment(between[0]).format('YYYY-MM-DD')}_${moment(between[1]).format('YYYY-MM-DD')}`, limit: `${step},${limit}` }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ data: res.data, total: res.count });
            } else {
                this.setState({ data: [] });
            }
        });

        func.get(itype, { orderby: 'crdate_desc' }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({
                    csvData: res.data.map(row => {
                        return {
                            provider: row.name, reviews: row.reviews
                        }
                    })
                });
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
        const { loading, data, total, currentStep } = this.state;

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
                                        {/* <Button type="primary" size="small" loading={loading}>
                                            <CSVLink data={csvData} filename={`${itype}-orders-${func.dates.td}.csv`} target="_blank">
                                                Download Report
                                            </CSVLink>
                                        </Button> */}
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
                                        <th>Details</th>
                                        <th>Status</th>
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
                                                <td>
                                                    {row.details.map(det => (
                                                        <div>
                                                            Item: {det.name} <br />
                                                            Price: Ghs {det.price} x{det.quantity} <br />
                                                            Car: {det.car} / {det.car_model} / {det.car_year}
                                                            <hr />
                                                        </div>
                                                    ))}
                                                </td>
                                                <td>
                                                    {row.status === 0 && 'Pending'}
                                                    {row.status === 1 && 'Paid'}
                                                    {row.status === 2 && 'Failed'}
                                                </td>
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


            </React.Fragment>
        );
    }
}

export default ReportsOrders;