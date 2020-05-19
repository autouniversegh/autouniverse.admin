import React from 'react';

const MediaList = props => {
    const { med, id } = props;

    return (
        <React.Fragment>
            <div className={`list-group-item d-flex align-items-center media ${Number(id) === med.id ? 'active' : ''}`} onClick={() => props.openMedia(med)}>
                {med.image && (
                    <img src={med.image_link} className="wd-100 mg-r-15" alt={med.title} />
                )}
                <div>
                    <b className="tx-13 tx-inverse tx-semibold mg-b-0">{med.title}</b>
                    <span className="d-block tx-11 text-muteds">{med.description}</span>
                    <span className="d-block tx-11 text-muteds">{med.views_nf} views</span>
                </div>
            </div>
        </React.Fragment>
    );
};

export default MediaList;