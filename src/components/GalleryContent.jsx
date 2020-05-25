import React, { useState } from 'react';
import { Upload } from 'antd';
import * as func from '../providers/functions';

const GalleryContent = (props) => {
    const { folder, uploadData, multiple, listType, showUploadList, uploadSuccess } = props;
    const [uploading, setUploading] = useState(false);

    const upProps = {
        multiple,
        listType,
        showUploadList,
        accept: 'image/*',
        name: 'file[0]',
        action: `${func.api.apiURL}upload`,
        data: { folder, ...uploadData },
        headers: {
            'x-access-token': func.api.apiKey + '.' + func.api.apiToken
        },
        onChange(e) {
            if (e.file.status === 'uploading') {
                setUploading(true);
            } else if (e.file.status === 'done') {
                setUploading(false);
                if (e.file.response.status === 200) {
                    uploadSuccess && uploadSuccess({
                        name: e.file.response.data[0],
                        link: e.file.response.links[0]
                    });
                }
            }
        },
        onRemove(e) {
            if (e.response.data) {
                func.delte(`upload/${folder}/${e.response.data[0]}`);
            }
        }
    }

    return (
        <React.Fragment>
            <div style={{ height: '200px', marginBottom: 20 }}>
                <Upload.Dragger {...upProps}>
                    <div>&nbsp;</div>
                    <p className="ant-upload-drag-icon">
                        {!uploading && (
                            <i className="fa fa-upload fa-2x text-primary"></i>
                        )}
                        {uploading && (
                            <i className="fa fa-spin fa-spinner fa-2x text-primary"></i>
                        )}
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <div>&nbsp;</div>
                </Upload.Dragger>
            </div>
        </React.Fragment>
    )
};

export default GalleryContent;