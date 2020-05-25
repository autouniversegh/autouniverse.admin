import React, { useState } from 'react';
import * as func from '../providers/functions';

const GalleryImageCard = props => {
    const { img, imgLink, folder, onRemove } = props;
    const [submitting, setSubmitting] = useState(false);

    const remove = (image) => {
        setSubmitting(true);
        func.delte(`upload/${folder}/${image}`).then(res => {
            setSubmitting(false);
            if(res.status === 200) {
                onRemove(image);
            }
        });
    }

    return (
        <React.Fragment>
            <div className="pd-8 mg-b-4" style={{ border: '1px solid #d9d9d9', borderRadius: 4, marginTop: 8 }}>
                <div className="row">
                    <div className="col-3">
                        <img className="thumbnail" src={imgLink} alt="N/A" />
                    </div>
                    <div className="col-7 flex-middle small">{img}</div>
                    <div className="col-2 flex-middle">
                        {!submitting && (
                            <i className="icon-trash pointer pd-5 text-danger" onClick={() => remove(img)}></i>
                        )}
                        {submitting && (
                            <i className="fa fa-spin fa-spinner"></i>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default GalleryImageCard;