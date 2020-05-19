import React, { Component } from 'react';
import { Form, notification, Input, Button } from 'antd';
import * as func from '../../providers/functions';

class SetupSettingsScreen extends Component {

    state = {
        submitting: false
    }

    componentDidMount() {
        this.props.setPageTitle('Setup: General settings');
        window.summernote();
    }
    submit = () => {
        const { form: { validateFields } } = this.props;
        validateFields((err, v) => {
            if (!err) {
                this.setState({ submitting: true });
                v['foc_photo_apply'] = window.$('#foc_photo_apply').val();
                v['foc_music_apply'] = window.$('#foc_music_apply').val();
                v['foc_dance_apply'] = window.$('#foc_dance_apply').val();
                v['foc_writting_apply'] = window.$('#foc_writting_apply').val();
                func.post(`settings/update`, v).then((res) => {
                    this.setState({ submitting: false });
                    if (res.status === 200) {
                        this.props.setSetSettings('settings', res.data);
                        func.setStorageJson('settings', res.data);
                        notification.success({ message: res.result });
                    } else {
                        notification.error({ message: res.result });
                    }
                });
            }
        });
    }

    render() {
        const { form: { getFieldDecorator }, utils: { settings } } = this.props;
        const { submitting } = this.state;

        return (
            <React.Fragment>
                <ul className="nav nav-tabs nav-justifieds" id="myTab" role="tablist">
                    <MyTabHead id="coins" title="Coins" />
                    <MyTabHead id="foc" title="FOC congratulation messages" active={true} />
                </ul>
                <div className="tab-content bds bd-gray-300 bd-t-0 bd-b-0 pd-t-20s" id="myTabContent">
                    <MyTabBody id="coins">
                        <div className="row row-xs">
                            <div className="col-12 col-lg-4">
                                <Form.Item colon={false} label="Coins for posting an article">
                                    {getFieldDecorator('coins_post', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: settings.coins_post
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-4">
                                <Form.Item colon={false} label="Coins for commenting on an article">
                                    {getFieldDecorator('coins_post_comment', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: settings.coins_post_comment
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-4">
                                <Form.Item colon={false} label="Coins for replying a comment on an article">
                                    {getFieldDecorator('coins_post_comment_reply', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: settings.coins_post_comment_reply
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-4">
                                <Form.Item colon={false} label="Default bidding coins">
                                    {getFieldDecorator('coins_bidding', {
                                        rules: [{ required: true, message: <span /> }],
                                        initialValue: settings.coins_bidding
                                    })(
                                        <Input autoComplete="off" size="large" disabled={submitting} />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-12 col-lg-12 mg-t-20">
                                <Button type="primary" loading={submitting} onClick={this.submit}>Save</Button>
                            </div>
                        </div>
                    </MyTabBody>
                    <MyTabBody id="foc" active={true}>
                        <div className="row row-xs">
                            <div className="col-12 col-lg-12 mg-b-20">
                                <b>Photo</b>
                                <textarea id="foc_photo_apply" name="foc_photo_apply" className="summernote" defaultValue={settings.foc_photo_apply} />
                            </div>
                            <div className="col-12 col-lg-12 mg-b-20">
                                <b>Music</b>
                                <textarea id="foc_music_apply" name="foc_music_apply" className="summernote" defaultValue={settings.foc_music_apply} />
                            </div>
                            <div className="col-12 col-lg-12 mg-b-20">
                                <b>Dance</b>
                                <textarea id="foc_dance_apply" name="foc_dance_apply" className="summernote" defaultValue={settings.foc_dance_apply} />
                            </div>
                            <div className="col-12 col-lg-12 mg-b-20">
                                <b>Writting</b>
                                <textarea id="foc_writting_apply" name="foc_writting_apply" className="summernote" defaultValue={settings.foc_writting_apply} />
                            </div>
                            <div className="col-12 col-lg-12 mg-b-20">
                                <Button type="primary" loading={submitting} onClick={this.submit}>Save</Button>
                            </div>
                        </div>
                    </MyTabBody>
                </div>
            </React.Fragment >
        );
    }
}

const SetupSettings = Form.create()(SetupSettingsScreen);
export default SetupSettings;



const MyTabHead = (props) => {
    const { id, title, active } = props;
    return (
        <li className="nav-item">
            <a className={`nav-link ${active ? 'active' : ''}`} id={`#${id}-tab`} data-toggle="tab" href={`#${id}`} role="tab" aria-controls={id} aria-selected="true">{title}</a>
        </li>
    );
}

const MyTabBody = (props) => {
    const { id, children, active } = props;
    return (
        <div className={`tab-pane fade ${active ? 'show active' : ''}`} id={id} role="tabpanel" aria-labelledby={`${id}-tab`}>
            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    );
}