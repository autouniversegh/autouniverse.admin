/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Modal } from 'antd';

// import * as func from '../../../providers/functions';

const OrderDetails = props => {
    const { row, visible, rowStatus } = props;
    
    const [items, setItems] = useState([]);
    const [dealers, setDealers] = useState([]);


    useEffect(() => {
        var data = [];
        row.details.map(item => {
            data[item.dealer.name] = data[item.dealer.name] || [];
            data[item.dealer.name] = data[item.dealer.name].concat(item);
        });
        setItems(data);
        setDealers(Object.keys(data));
    }, []);

    return (
        <Modal visible={visible} title={'Order details'} onCancel={() => props.onCancel()} destroyOnClose={true} width={1200} maskClosable={false}
            footer={null}
            style={{ top: 20 }}
        >
            <div className="row">
                <div className="col-lg-2">
                    <img className="img-thumbnail img-circle" src={row.user.avatar_link} alt={row.user.name} />
                    <div className="text-center">
                        <div>&nbsp;</div>
                        <i className="fa fa-user"></i> {row.user.name} <br />
                        <i className="fa fa-calendar"></i> {moment(row.crdate).format('LLL')} <br />
                        <div className={`badge badge-${rowStatus[row.status][0]}`}>{rowStatus[row.status][1]}</div>
                    </div>
                </div>
                <div className="col-lg-10">
                    {dealers.map(dealer => (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th colSpan="5">{dealer}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items[dealer].map(item => (
                                    <tr>
                                        <td width="13%"><img className="img-thumbnail" src={item.image_links[0]} alt={item.name} /></td>
                                        <td>{item.name}</td>
                                        <td>Ghs {item.price} x{item.quantity}</td>
                                        <td>{item.received ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ))}
                    <table className="table">
                        <tbody>
                            <tr>
                                <td colSpan="2" align="right">Total:</td>
                                <td><b>Ghs {row.amount}</b></td>
                                <td colSpan="3"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );

};

export default OrderDetails;