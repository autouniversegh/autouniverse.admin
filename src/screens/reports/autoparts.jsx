import React, { Component } from 'react';
import moment from 'moment';
import { Button, Form, Pagination } from 'antd';
import { CSVLink } from 'react-csv';
import * as func from '../../providers/functions';

const limit = 25;

class ReportsAutoparts extends Component {

    state = {
        loading: false, formModal: false,
        data: [], csvData: [], row: {},
        pathname: '', itype: 'autoparts',
        step: 0, currentStep: 1, total: 0
    }

    componentDidMount() {
        this.setPage();

        func.get('autoparts', { orderby: 'crdate_desc', status: 1 }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({
                    csvData: res.data.map(row => {
                        return {
                            'ID': row.uuid,
                            'Name': row.name,
                            'Dealer': row.dealer.name,
                            'Price': row.price,
                            'Car': row.car + ' / ' + row.car_model + ' / ' + row.car_year,
                            'Source': row.source,
                            'Creation Date': moment(row.crdate).format('LLL')
                        }
                    }, () => {
                        console.log(this.state.csvData)
                    })
                });
            }
        });
    }

    setPage() {
        this.props.setPageTitle('Reports: Auto parts');
        this.getData();
    }

    filter = () => {
        this.setState({ step: 0, currentStep: 1 }, () => {
            this.getData();
        });
    }
    getData = () => {
        this.setState({ loading: true, total: 0 });
        const { step } = this.state;
        func.get('autoparts', { orderby: 'crdate_desc', limit: `${step},${limit}` }).then(res => {
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
                                    <div className="col-2">
                                        {/* <Select showSearch={true} placeholder="Type" value={itype} disabled={loading} onChange={e => this.formChange(e, 'itype')}>
                                            <Select.Option value="dealers">Autopart dealers</Select.Option>
                                            <Select.Option value="mechanics">Mechanics</Select.Option>
                                            <Select.Option value="emergencies">Emergencies</Select.Option>
                                            <Select.Option value="otherservices">Other services</Select.Option>
                                        </Select> */}
                                    </div>
                                    <div className="col-10 text-right">
                                        <Button type="dark" size="small" loading={csvData.length === 0 ? true : false}>
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
                                        <th>Name</th>
                                        <th>Dealer</th>
                                        <th>Price</th>
                                        <th>Car</th>
                                        <th>Part Source</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading === true && (<tr><td align="center" colSpan="15"><i className="fa fa-spin fa-spinner"></i> loading...</td></tr>)}
                                    {loading === false && data.length === 0 && (<tr><td align="center" colSpan="15">No records found</td></tr>)}

                                    {loading === false && (
                                        data.map((row) => (
                                            <tr key={row.uuid}>
                                                <td>{i++}</td>
                                                <td>{row.name}</td>
                                                <td>{row.dealer.name}</td>
                                                <td>GHS{row.price}</td>
                                                <td>
                                                    Make: {row.car} <br />
                                                    Model: {row.car_model} <br />
                                                    Year: {row.car_year} <br />
                                                </td>
                                                <td>{row.source}</td>
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

export default ReportsAutoparts;