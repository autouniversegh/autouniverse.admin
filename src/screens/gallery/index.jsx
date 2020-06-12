import React, { Component } from 'react';
import { Button, Pagination, Popconfirm, notification } from 'antd';
import Lightbox from 'react-image-lightbox';
import * as func from '../../providers/functions';

import GalleryForm from './form';
import { Loading } from '../../components';

const limit = 20;

class Gallery extends Component {

    state = {
        loading: false, formModal: false,
        data: [],
        step: 0, currentStep: 1, total: 0,
        photoIndex: 0, isOpen: false
    }

    componentDidMount() {
        this.setPage();
    }

    setPage() {
        this.props.setPageTitle('Gallery');
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
        func.get('gallery', { limit: `${step},${limit}` }).then(res => {
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

    delete = (row) => {
        const { image } = row;
        this.setState({ submitting: true });
        func.delte(`gallery/${row.image}`).then((res) => {
            this.setState({ submitting: false });
            if (res.status === 200) {
                this.setState({ data: this.state.data.filter(row => row.image !== image) });
                notification.success({ message: res.message });
            } else {
                notification.error({ message: res.message });
            }
        });
    }

    render() {
        const { loading, data, submitting, total, currentStep, isOpen, photoIndex } = this.state;
        const images = data.map(row => { return row.image_link; });

        return (
            <React.Fragment>
                <div className="mg-b-20">
                    <Button type="primary" onClick={() => this.setState({ row: {}, formModal: true })}>Upload new</Button>
                </div>
                <div className="cards" style={{ marginBottom: 20 }}>
                    <div className="card-bodys">
                        {loading === true && (<Loading />)}
                        {loading === false && data.length === 0 && (<div class="text-center">No records found</div>)}

                        {loading === false && (
                            <div className="row">
                                {data.map((row, i) => (
                                    <div className="card mg-10">
                                        <div className="card-header">
                                            <small>{row.image}</small>
                                        </div>
                                        <div
                                            className="card-body pd-0 pointer"
                                            onClick={() => this.setState({ isOpen: true, photoIndex: i })}
                                            style={{
                                                width: 190, height: 190, float: 'left',
                                                backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                                                backgroundImage: `url(${row.image_link})`
                                            }}
                                        >
                                        </div>
                                        <div className="card-footer pd-5">
                                            {func.hasR('adv_del') && (
                                                <Popconfirm title="Are you sure?" okText="Yes, Delete" okButtonProps={{ type: 'danger', size: 'small' }} onConfirm={() => this.delete(row)}>
                                                    <Button type="link" size="small" danger loading={submitting}>Delete</Button>
                                                </Popconfirm>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && total > limit && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}
                    </div>
                </div>

                {isOpen && (
                    <Lightbox
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({ photoIndex: (photoIndex + images.length - 1) % images.length })
                        }
                        onMoveNextRequest={() =>
                            this.setState({ photoIndex: (photoIndex + 1) % images.length })
                        }
                    />
                )}

                {this.state.formModal === true && (
                    <GalleryForm
                        {...this.props}
                        row={this.state.row}
                        visible={this.state.formModal}
                        onCancel={() => this.setState({ row: {}, formModal: false })}
                        onOK={(a, e) => {
                            this.getData();
                        }}
                    />
                )}

            </React.Fragment>
        );
    }
}

export default Gallery;