import React from 'react';
import {
    Icon,
    Form,
    Input,
    Upload,
    DatePicker,
    Select,
    AutoComplete
} from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Option: AutoOption } = AutoComplete

const normFile = e => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

const renderOption = (item) => {
    return (
        <AutoOption key={item.id} value={item.id}>
            {item.displayName}
        </AutoOption>
    );
};

export const displayField = (field, store, getFieldDecorator, ...rest) => {
    if (!field) {
        return null
    }

    let f;
    let conf;
    let others = rest[field.key] || {};
    switch (field.valueType) {
        case 'DATE':
            const { disabledDate } = others
            f = <DatePicker size="large" disabledDate={disabledDate} />;
            conf = {
                rules: [{ type: 'object', required: field.mandatory, message: `Please input ${field.title}` }],
            };
            break;
        case 'LONG_TEXT':
            f = <TextArea rows={6} />;
            conf = {
                rules: [{ required: field.mandatory, message: `Please input ${field.title}` }],
            }
            break;
        // case 'HTML':
        //     conf = {
        //         rules: [{ required: field.mandatory, message: `Please input ${field.title}` }],
        //     }
        //     f = <ReactQuill modules={modules} formats={formats} theme="snow" />;
        //     break;
        case 'FILE_RESOURCE':
            const { dummyRequest } = others
            f = <Upload.Dragger name="files" customRequest={dummyRequest} multiple={false}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single upload.</p>
            </Upload.Dragger>
            conf = {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
            }
            break;

        default:
            conf = {
                rules: [{ required: field.mandatory, message: `Please input ${field.title}` }],
            }
            if (field.optionSet) {
                f = <Select size="large">
                    {field.optionSet.options.map(d => <Option value={d.code} key={d.code}>{d.name}</Option>)}
                </Select>
            } else if (field.searchUsers) {
                f = <AutoComplete
                    size="large"
                    dataSource={store.users.map(renderOption)}
                    style={{ width: '100%' }}
                    onSearch={store.searchUsers}
                    placeholder="input here"
                />

            } else if (field.isRelationship) {
                f = <Select size="large">
                    {store.currentProgram.relatedProgram.data.map(d => <Option value={d.event} key={d.event}>{d['UeKCu1x6gC1']} - {d['cIfzworL5Kj']}</Option>)}
                </Select>
            } else {
                f = <Input size="large" style={{ width: '100%' }} />
            }
    }
    return <Form.Item label={field.title} key={field.key}>
        {getFieldDecorator(field.key, conf)(f)}
    </Form.Item>
}

