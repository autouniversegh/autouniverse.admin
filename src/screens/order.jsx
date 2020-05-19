import React, { Component } from 'react';
import { Form, Input, Select, Button } from 'antd';
import * as func from '../providers/functions';
import { FormattedMessage } from 'react-intl';


class OrderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ambassadors: [], next: [], country: '', office: '',
            loading: false, submitting: false
        };
    }

    componentDidMount() {
        this.getAmbassadors();
    }

    getAmbassadors() {
        const { country, office } = this.state;
        this.setState({ loading: true });
        func.post('ambassadors', { country, office, status: 1 }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200 && res.count > 0) {
                this.setState({ ambassadors: res.result });
            } else {
                this.setState({ ambassadors: [] });
            }
        });
    }

    _submit(e) {
        e.preventDefault(); this.goNext('countries');
        const { form: { validateFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                this.goNext('countries');
            }
        });
    }

    goNext(go) {
        var next = this.state.next;
        next = next.concat(go);
        this.setState({ next }, () => {
            if (go === 'ambassadors') {
                this.getAmbassadors();
            }
            if (go === 'offices') {
                this.setState({ ambassadors: [] });
            }
        });
    }

    render() {
        const { ambassadors, loading, submitting, next, country } = this.state;
        const { form: { getFieldDecorator }, utils: { countries, offices } } = this.props;
        const orderTypes = ['Autoship', 'New signup', 'Preffered customer'];

        return (
            <React.Fragment>
                <div className="row row-xs">

                    {/* form */}
                    <div className="col-12 col-md-4 col-lg-4">
                        <b className="mg-b-10 block"><FormattedMessage id="Label.Order.Form" defaultMessage="Order Form" /></b>
                        <Form hideRequiredMark={false} onSubmit={(e) => this._submit(e)} style={{ background: '#f8f9fc', padding: 20, border: '1px solid rgba(72, 94, 144, 0.16)' }}>
                            <Form.Item colon={false} label={<FormattedMessage id="Label.Order.Type" defaultMessage="Order type" />}>
                                {getFieldDecorator('type', {
                                    rules: [{ required: true, message: <span /> }]
                                })(
                                    <Select size="large" disabled={submitting}>
                                        {orderTypes.map(type => (
                                            <Select.Option key={type} value={type}>{type}</Select.Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item colon={false} label={<FormattedMessage id="Label.MaxID" defaultMessage="Max ID" />}>
                                {getFieldDecorator('maxid', {
                                    rules: [{ required: true, message: <span /> }]
                                })(
                                    <Input autoComplete="off" size="large" disabled={submitting} />
                                )}
                            </Form.Item>
                            <Form.Item colon={false} label={<FormattedMessage id="Label.Order.Name" defaultMessage="Name on ID" />}>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: <span /> }]
                                })(
                                    <Input autoComplete="off" size="large" disabled={submitting} />
                                )}
                            </Form.Item>
                            <Form.Item colon={false} label={<FormattedMessage id="Label.Order.Products" defaultMessage="Products ordering" />}>
                                {getFieldDecorator('products', {
                                    rules: [{ required: true, message: <span /> }]
                                })(
                                    <Input.TextArea rows={5} autoComplete="off" size="large" disabled={submitting} />
                                )}
                            </Form.Item>
                            <Form.Item colon={false} label={<FormattedMessage id="Label.Order.Payment" defaultMessage="Payment details" />}>
                                {getFieldDecorator('payment', {
                                    rules: [{ required: true, message: <span /> }]
                                })(
                                    <Input.TextArea rows={5} autoComplete="off" size="large" disabled={submitting} />
                                )}
                            </Form.Item>
                            <Form.Item colon={false} label={<FormattedMessage id="Label.Order.Pickup" defaultMessage="To be picked up by" />}>
                                {getFieldDecorator('pickup', {
                                    // rules: [{ required: true, message: <span /> }]
                                })(
                                    <Input autoComplete="off" size="large" disabled={submitting} />
                                )}
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block loading={submitting}>
                                <FormattedMessage id="Button.Next" defaultMessage="Next" />
                            </Button>
                        </Form>
                    </div>

                    {/* countries */}
                    {next.includes('countries') && (
                        <div className="col-12 col-md-2 col-lg-2">
                            <b className="mg-b-10 block"><FormattedMessage id="Label.Order.Countries" defaultMessage="Processing Country" /></b>
                            <ul className="list-group">
                                {countries.map(cnt => (
                                    <li key={cnt.name} className={`list-group-item d-flex align-items-center pointer media ${country === cnt.code ? 'active' : ''}`}
                                        onClick={() => { this.setState({ country: cnt.code }, () => { this.goNext('offices') }) }}>
                                        <img src={`/assets/img/use/country/${cnt.code}.png`} className="wd-30 rounded-circle mg-r-15" alt={cnt.name} />
                                        <div>
                                            <h6 className="tx-13 tx-inverse tx-semibold mg-b-0">{cnt.name}</h6>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* offices */}
                    {next.includes('offices') && (
                        <div className="col-12 col-md-2 col-lg-2">
                            <b className="mg-b-10 block"><FormattedMessage id="Label.Order.Countries" defaultMessage="Processing Country" /></b>
                            <ul className="list-group">
                                {offices[country].map(office => (
                                    <li key={office} className={`list-group-item d-flex align-items-center pointer media ${this.state.office === office ? 'active' : ''}`}
                                        onClick={() => { this.setState({ office }, () => { this.goNext('ambassadors') }) }}>
                                        <img src={`/assets/img/use/country/${country}.png`} className="wd-30 rounded-circle mg-r-15" alt={office} />
                                        <div>
                                            <h6 className="tx-13 tx-inverse tx-semibold mg-b-0">{office}</h6>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ambassadors */}
                    {next.includes('ambassadors') && (
                        <div className="col-12 col-md-4 col-lg-4">
                            <b className="mg-b-10 block"><FormattedMessage id="Label.Order.Ambassadors" defaultMessage="Ambassadors" /></b>
                            {loading === true && (
                                <div className="spinner-border" role="status" />
                            )}
                            {loading === false && (
                                <ul className="list-group">
                                    {ambassadors.map(amb => (
                                        <li key={amb.id} className={`list-group-item d-flex align-items-center`}>
                                            <img src={amb.avatar_link} className="wd-60 rounded-circles mg-r-15" alt={amb.name} />
                                            <div>
                                                <h6 className="tx-13 tx-inverse tx-semibold mg-b-0">{amb.name}</h6>
                                                <div className="mg-t-10">
                                                    {amb.whatsapp && (
                                                        <button type="button" className="btn btn-xs btn-success rounded-pill mg-r-5" disabled={!amb.active}>
                                                            WhatsApp
                                                        </button>
                                                    )}
                                                    {amb.email && (
                                                        <button type="button" className="btn btn-xs btn-info rounded-pill" disabled={!amb.active}>
                                                            Email
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {/* {ambassadors.length === 0 && (

                            )} */}
                        </div>
                    )}

                </div>
            </React.Fragment>
        );
    }
}

export default Form.create()(OrderScreen);