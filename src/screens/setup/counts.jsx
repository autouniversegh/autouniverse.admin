import React, { Component } from 'react';
import { Button, Form, notification, InputNumber } from 'antd';
import * as func from '../../providers/functions';


class SetupCounts extends Component {

    state = {
        loading: false, submitting: false,
        data: [], errMessage: ''
    }

    componentDidMount() {
        this.props.setPageTitle('Setup: Subscriptions');
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
        const { _utils: { settings }, form: { getFieldDecorator } } = this.props;
        const setForms = [
            { label: 'Autoparts dealers', name: 'autoparts', },
            { label: 'Mechanics', name: 'mechanics' },
            { label: 'Emergency services', name: 'emergencies' },
            { label: 'Other Auto Services', name: 'otherservices' },
        ];

        return (
            <React.Fragment>
                <Form onSubmit={this.submit}>
                    {this.state.errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: this.state.errMessage }} />)}
                    <div className="card mg-b-25">
                        <div className="card-body">
                            <div className="row">
                                {setForms.map(row => (
                                    <div className="col-12 col-lg-3">
                                        <Form.Item colon={false} label={row.label}>
                                            {getFieldDecorator(`data_counts[${row.name}]`, {
                                                rules: [{ required: true, message: <span /> }],
                                                initialValue: settings.data_counts[row.name],
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
            </React.Fragment>
        );
    }
}

export default Form.create()(SetupCounts);