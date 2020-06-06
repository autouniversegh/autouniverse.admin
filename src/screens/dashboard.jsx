import React, { Component, useEffect, useState } from 'react';
import * as func from '../providers/functions';
import { FormattedNumber } from 'react-intl';

class Dashboard extends Component {

    render() {

        return (
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-6 col-sm-6 col-lg-4">
                        <BrandCard
                            endpoint="users"
                            style={{ icon: 'icon-user', bg: 'bg-facebook' }}
                            some={[
                                { label: 'Users', key: 'users' }, { label: 'Admins', key: 'admins' }
                            ]}
                        />
                    </div>
                    <div className="col-6 col-sm-6 col-lg-4">
                        <BrandCard
                            endpoint="orders"
                            style={{ icon: 'icon-basket', bg: 'bg-success' }}
                            some={[
                                { label: 'Paid', key: 'paid' }, { label: 'Pending', key: 'pending' }, { label: 'Failed', key: 'failed' }
                            ]}
                        />
                    </div>
                    <div className="col-6 col-sm-6 col-lg-4">
                        <BrandCard
                            endpoint="subscriptions"
                            style={{ icon: 'icon-layers', bg: 'bg-danger' }}
                            some={[
                                { label: 'Active', key: 'active' }, { label: 'Expired', key: 'expired' }
                            ]}
                        />
                    </div>
                    <div className="col-6 col-sm-6 col-lg-4">
                        <BrandCard
                            endpoint="providers"
                            style={{ icon: 'icon-wrench', bg: 'bg-primary' }}
                            some={[
                                { label: 'Mechanics', key: 'mechanics' }, { label: 'Emergencies', key: 'emergencies' },
                                { label: 'Other services', key: 'otherservices' }, { label: 'Dealers', key: 'dealers' }
                            ]}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;


const BrandCard = props => {
    const { endpoint, some, style } = props;
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        func.get(`dashboards/${endpoint}`).then(res => {
            setLoading(false);
            setData(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="brand-card">
            <div className={`brand-card-header ${style.bg}`}>
                <div className="text-center">
                    <i className={style.icon}></i>
                    <div className="text-white text-capitalize mg-t-10">{endpoint}</div>
                </div>
            </div>
            <div className="brand-card-body">
                {loading && (
                    <div className="text-center">loading...</div>
                )}
                {!loading && (
                    some.map(row => (
                        <div>
                            <div className="text-value"><FormattedNumber value={data[row.key]} /></div>
                            <div className="text-uppercase text-muted small">{row.label}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
