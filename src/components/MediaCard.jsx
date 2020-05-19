import React from 'react';

const MediaCard = props => {
    const { med } = props;

    return (
        <React.Fragment>
            <div className="card pointer mediacard" onClick={() => props.openMedia(med)}>
                {/* <img src={med.image_link} className="card-img-top" alt={med.title} /> */}
                {['vid', 'img'].includes(med.type) && (
                    <div className="pos-relative">
                        {med.type === 'vid' && (
                            <div className="marker marker-primarys pos-absolute t-10 l-10">Video</div>
                        )}
                        <img src={med.image ? med.image_link : med.file_link} className="card-img-top" alt={med.title} />
                    </div>
                )}
                <div className="card-body">
                    <h6 className="card-title">{med.title}</h6>
                    {/* <div className="card-text"><small>{med.description}</small></div> */}
                    <p className="card-text">
                        <small className="text-muted">
                            <span>{med.coins_nf} coins&nbsp;|&nbsp;</span>
                            <span>{med.views_nf} views&nbsp;|&nbsp;</span>
                            <span>{med.downloads_nf} downloads&nbsp;|&nbsp;</span>
                            <span>{med.shares_nf} shares</span>
                        </small>
                    </p>
                </div>
            </div>
        </React.Fragment>
    );
};

export default MediaCard;