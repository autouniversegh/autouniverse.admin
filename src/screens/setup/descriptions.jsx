import React, { Component } from 'react';
import { Button, Form, notification, Tabs } from 'antd';
import * as func from '../../providers/functions';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';


class SetupDescriptions extends Component {

    state = {
        loading: false, submitting: false,
        data: [], errMessage: '', content: '',
    }

    componentDidMount() {
        this.props.setPageTitle('Setup: Descriptions');
    }

    setContent(e, name) {
        this.setState({ content: { ...this.state.content, [name]: e } });
    }

    submit = e => {
        e.preventDefault();
        this.setState({ submitting: true, errMessage: '' });
        func.put('settings', this.state.content).then(res => {
            this.setState({ submitting: false });
            if (res.status === 200) {
                notification.success({ message: res.message });
                this.props.setSetSettings('settings', res.data);
            } else {
                if (res.status === 412) {
                    this.setState({ errMessage: res.data.join('<br />') });
                } else {
                    this.setState({ errMessage: res.message });
                }
            }
        });
    }

    render() {
        const { _utils: { settings } } = this.props;
        const setForms = [
            { label: 'Auto parts', name: 'description_autoparts' },
            { label: 'Mechanics', name: 'description_mechanics' },
            { label: 'Emergencies', name: 'description_emergencies' },
            { label: 'Expert Advice', name: 'description_expertadvices' },
            { label: 'Other Services', name: 'description_otherservices' },
            { label: 'Maintainance Tracker', name: 'description_maintenance' },
        ];

        return (
            <React.Fragment>
                <Form onSubmit={this.submit}>
                    {this.state.errMessage && (<div className="alert alert-danger" dangerouslySetInnerHTML={{ __html: this.state.errMessage }} />)}
                    <div className="card mg-b-25">
                        <div className="card-body">
                            <Tabs defaultActiveKey="1">
                                {setForms.map(row => (
                                    <Tabs.TabPane tab={row.label} key={row.name}>
                                        <SunEditor
                                            setOptions={{ height: 350 }}
                                            setContents={settings[row.name]}
                                            onChange={e => this.setContent(e, row.name)}
                                        />
                                    </Tabs.TabPane>
                                ))}
                            </Tabs>
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

export default Form.create()(SetupDescriptions);