import React, { Component } from 'react';
import { Button, Form, Input, notification } from 'antd';
import * as func from '../../providers/functions';


class SetupSubsScreen extends Component {

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
            { label: 'Price', name: 'subscription_price' },
            { label: 'Duration (month)', name: 'subscription_duration' }
        ];

        return (
            <React.Fragment>
                <Form onSubmit={this.submit}>
                    {this.state.errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: this.state.errMessage }} />)}
                    <div className="card mg-b-25">
                        <div className="card-body">
                            <div className="row">
                                {setForms.map(row => (
                                    <div className="col-12 col-lg-4">
                                        <Form.Item colon={false} label={row.label}>
                                            {getFieldDecorator(row.name, {
                                                rules: [{ required: true, message: <span /> }],
                                                initialValue: settings[row.name]
                                            })(
                                                row.input ? row.input : <Input autoComplete="off" size="large" disabled={this.state.submitting} />
                                            )}
                                        </Form.Item>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card mg-b-25">
                        <div className="card-header">
                            <Button type="primary" htmlType="submit" loading={this.state.submitting}>&nbsp; &nbsp; Save changes &nbsp; &nbsp;</Button>
                        </div>
                    </div>
                </Form>
            </React.Fragment>
        );
    }
}

const SetupSubs = Form.create()(SetupSubsScreen);
export default SetupSubs;