import React from 'react';

const CommentCard = props => {
    const { cmt } = props;

    return (
        <React.Fragment>
            <div className="list-group-item d-flex align-items-center comment">
                <img src={cmt.user.avatar_link} className="wd-60 rounded-circle mg-r-15" alt={cmt.user.name} />
                <div>
                    <b className="tx-13 tx-inverse tx-semibold mg-b-0">
                        <span>
                            <span className="float-left">{cmt.user.name} • {cmt.user.country.name}</span>
                            <span className="float-right"><small className="text-muted text-right">&nbsp; &nbsp; &nbsp; {cmt.crdate_ago}</small></span>
                            <span className="clearfix"></span>
                        </span>
                    </b>
                    <span className="d-block tx-11 text-muteds">{cmt.comment}</span>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CommentCard;