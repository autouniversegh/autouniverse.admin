import React, { Component } from 'react';
import moment from 'moment';
import { Pagination } from 'antd';
import * as func from '../providers/functions';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { MediaCard, MediaList, CommentCard } from '../components';

import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';

const limit = 12;

class MediaScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [], more: [], comments: [], filters: [], med: {},
            loading: false,
            pathname: 'xxl', id: '%', now: '', group: null, filter: '%',
            step: 0, currentStep: 1, total: 0, totalComments: 0
        };
    }

    componentDidMount() {
        this.watchURL();
    }

    componentDidUpdate() {
        this.watchURL();
    }

    watchURL() {
        const loc = this.props.location.pathname.split('/');
        const pathname = loc[1], id = loc[2] || '%';
        if ((this.state.pathname !== pathname) || (this.state.id !== id)) {
            this.setState({ pathname, id: id, group: null, filter: '%', filters: [], data: [], more: [], comments: [], med: {} }, () => {
                this.getMedia(id, true);
            });
        }
    }

    nextPrev = (e) => {
        this.setState({ currentStep: e, step: (e - 1) * limit }, () => {
            this.getMedia(this.state.id, true);
        });
    }

    getMedia(id, nextPrev = false) {
        const { step, data, group, filter } = this.state;
        const { groups } = this.props;
        if (group === null && groups.length > 0) {
            this.setState({ group: groups[0] });
        }
        var params = groups.length ? (group || groups[0]).params : this.props.params;
        params['id'] = id;
        params['limit'] = `${step},${limit}`;
        params['status'] = 1;
        params['platform'] = 'app';
        params['filter'] = filter;
        if (data.length === 0 || id !== '%' || nextPrev) {
            this.setState({ loading: true });
            func.post('media', params).then(res => {
                this.setState({ loading: false });
                if (res.status === 200) {
                    if ((id && id !== '%') && res.count === 1) {
                        const med = res.result[0];
                        this.setState({ med, now: moment().unix() }, () => {
                            this.getMore(med);
                            this.getComments(med.id);
                            // this.playMedia();
                        });
                    } else {
                        this.setState({ data: res.result, total: res.count, med: {} });
                    }
                }
            });

            func.post('media_filters', { module: params['module'] }).then(res => {
                if (res.status === 200) {
                    this.setState({ filters: res.result });
                } else {
                    this.setState({ filters: [] });
                }
            });
        } else {
            this.setState({ data, med: {} });
        }
    }

    getComments(media) {
        this.setState({ loading: true });
        func.post('media_comments', { media, limit: 12 }).then(res => {
            this.setState({ loading: false });
            if (res.status === 200) {
                this.setState({ comments: res.result, totalComments: res.count });
            } else {
                this.setState({ comments: [], totalComments: 0 });
            }
        });
    }
    getMore(med) {
        const { data } = this.state;
        if (data.length === 0) {
            this.setState({ loading: true });
            var params = { type: med.type, status: 1, module: med.module, platform: 'app', limit: 12 };
            func.post('media', params).then(res => {
                this.setState({ loading: false });
                if (res.status === 200) {
                    this.setState({ more: res.result });
                } else {
                    this.setState({ more: [] });
                }
            });
        } else {
            this.setState({ more: data });
        }
    }
    setGroup(group) {
        this.setState({ group }, () => {
            this.getMedia(this.state.id, true);
        });
    }
    setFilter(filter) {
        this.setState({ filter }, () => {
            this.getMedia(this.state.id, true);
        });
    }

    playMedia() {
        const { now, med } = this.state;
        const { auth: { logg } } = this.props;

        var watched = 0, duration = 0, metrics = false, coins = false;
        let media_element = document.getElementById(`media_player${med.id}${now}`);
        media_element.play();
        media_element.addEventListener('loadedmetadata', () => {
            duration = parseInt(media_element.duration);
        });
        media_element.addEventListener('timeupdate', () => {
            // let cTime = this.media_element.currentTime;
            watched = watched + 1;
            var elapsed = ((watched) / 4.1);
            var percent = (elapsed / duration) * 100;
            if (metrics === false && elapsed >= 20) {
                metrics = true;
                // func.post('media/metrics', { type: 'views', media: med.id, user: logg.id });
            }
            if (coins === false && percent >= 90) {
                coins = true;
                // func.post('media/coins_add', { media: med.id, user: logg.id }).then(() => {
                //     // this.events.publish('aux.refresh');
                // });
            }
        });
    }

    openMedia = (med) => {
        switch (med.type) {

            default:
                this.props.history.push(`${this.props.match.path}/${med.id}`);
                break;
        }
    }

    render() {
        const { data, comments, more, med, filters, loading, total, totalComments, currentStep, group } = this.state;

        return (
            <React.Fragment>
                {/* list */}
                {(med.id === undefined) && (
                    <div>
                        {((this.props.groups.length > 0 && this.state.id === '%') || filters.length > 0) && (
                            <div className="col-12">
                                <ul className="nav nav-pills justify-content-center">
                                    {(this.props.groups || []).map((grp, i) => (
                                        <li key={i} className="nav-item mg-r-5" onClick={() => this.setGroup(grp)}>
                                            <span className={`nav-link pointer ${(group || {}).title === grp.title ? 'active' : ''}`}> {grp.title}</span>
                                        </li>
                                    ))}
                                    {filters.length > 0 && (
                                        <li className="nav-item">
                                            <span className="nav-link pointer active" data-toggle="dropdown"> Filters <i className="icon icon ion-md-heart wd-15 ht-15"></i></span>
                                            <div className="dropdown-menu tx-13">
                                                <span className="dropdown-item pointer" onClick={() => this.setFilter('%')}>No filters</span>
                                                {filters.map(fil => (
                                                    <span key={fil.id} className="dropdown-item pointer" onClick={() => this.setFilter(fil.id)}>{fil.name}</span>
                                                ))}
                                            </div>
                                        </li>
                                    )}
                                </ul>
                                <hr />
                            </div>
                        )}
                        {loading === false && (
                            <div className="row card-columnss">
                                {data.map(mid => (
                                    <div key={mid.id} className={`col-12 col-lg-3 col-md-3`}>
                                        <MediaCard {...this.props} med={mid} openMedia={(med) => this.openMedia(med)} />
                                        <div>&nbsp;</div>
                                    </div>
                                ))}

                                {!loading && total > limit && (<Pagination total={total} pageSize={limit} current={currentStep} onChange={(e) => this.nextPrev(e)} />)}
                            </div>
                        )}
                    </div>
                )}

                {/* single */}
                {med.id && (
                    <div className="row row-xs">
                        <div className={`col-12 col-lg-8 col-md-8`}>
                            {loading === false && (
                                <div>
                                    {/* <video
                                        id={`media_player${med.id}${now}`}
                                        src={med.file_link}
                                        controls
                                        controlsList="nodownload"
                                        poster={med.image_link}
                                        width="100%"
                                        onTimeUpdate={(e) => console.log(e) }
                                        
                                    ></video> */}
                                    <Video
                                        controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                                        poster={med.image_link}
                                        onTimeUpdate={(e) => {
                                            // console.log(e);
                                        }}
                                        style={{ height: `${med.type === 'aud' ? '100px' : 'auto'}`, marginBottom: 8 }}
                                    >
                                        <source src={med.file_link} />
                                    </Video>
                                    <h2>{med.title}</h2>
                                    <p>{med.description}</p>
                                    <p>
                                        <small className="text-muteds">
                                            <span>{med.coins_nf} coins&nbsp;|&nbsp;</span>
                                            <span>{med.views_nf} views&nbsp;|&nbsp;</span>
                                            <span>{med.downloads_nf} downloads&nbsp;|&nbsp;</span>
                                            <span>{med.shares_nf} shares</span>
                                        </small>
                                    </p>

                                    <p>&nbsp;</p>
                                    <h4><FormattedNumber value={totalComments} /> <FormattedMessage id="Label.Comments" defaultMessage="Comments" /> </h4>
                                    <div className="list-group">
                                        {comments.map(cmt => (
                                            <CommentCard key={cmt.id} cmt={cmt} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={`col-12 col-lg-4 col-md-4`}>
                            <div data-label="Watch More" className="df-example">
                                <div className="list-group">
                                    {more.map(mid => (
                                        <MediaList key={mid.id} med={mid} id={this.state.id} openMedia={(med) => this.openMedia(med)} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </React.Fragment>
        );
    }
}

export default (MediaScreen);