import React from 'react';
import {
    Form,
    Input,
    DatePicker,
    Select,
    AutoComplete
} from 'antd';
import moment from 'moment'

const { Option } = Select;
const { TextArea } = Input;

const { Option: AutoOption } = AutoComplete


export const displayField = (field, getFieldDecorator, rest) => {
    if (!field) {
        return null
    }

    let style = {};

    if (field.hidden) {
        style = { ...style, display: 'none' }
    }

    let f;
    let conf = {};
    let others = {};

    if (rest && rest.initialValue) {
        conf = { ...conf, initialValue: rest.initialValue }
    }
    switch (field.valueType) {
        case 'DATE':
            const { disabledDate } = others
            f = <DatePicker size="large" disabledDate={disabledDate} />;
            conf = {
                ...conf,
                rules: [{ type: 'object', required: field.mandatory, message: `Please input ${field.title}` }],
            };

            if (conf.initialValue) {
                conf = {
                    ...conf,
                    initialValue: moment(conf.initialValue)
                };
            }
            break;
        case 'LONG_TEXT':
            f = <TextArea rows={6} style={{ width: '100%' }} />;
            conf = {
                ...conf,
                rules: [{ required: field.mandatory, message: `Please input ${field.title}` }],
            }
            break;
        case 'NUMBER':
            f = <Input size="large" type="number" allowClear={true} />;
            conf = {
                ...conf,
                rules: [{ required: field.mandatory, message: `Please input ${field.title}` }],
            }
            break;
        // case 'FILE_RESOURCE':
        //     const { dummyRequest } = others
        //     f = <Upload.Dragger name="files" customRequest={dummyRequest} multiple={false}>
        //         <p className="ant-upload-drag-icon">
        //             <Icon type="inbox" />
        //         </p>
        //         <p className="ant-upload-text">Click or drag file to this area to upload</p>
        //         <p className="ant-upload-hint">Support for a single upload.</p>
        //     </Upload.Dragger>
        //     conf = {
        //         valuePropName: 'fileList',
        //         getValueFromEvent: normFile,
        //     }
        //     break;

        default:
            conf = {
                ...conf,
                rules: [{ required: field.mandatory, message: `Please input ${field.title}` }],
            }
            if (field.optionSet) {
                f = <Select size="large" style={{ width: '100%' }}>
                    {field.optionSet.options.map(d => <Option value={d.code} key={d.code}>{d.name}</Option>)}
                </Select>
            } else {
                f = <Input size="large" style={{ width: '100%' }} />
            }
    }
    return <Form.Item label={field.title} key={field.key} style={style}>
        {getFieldDecorator(field.key, conf)(f)}
    </Form.Item>
}



export const renderOption = (item) => {
    return (
        item && item.length > 0 ? <AutoOption key={item[0]} value={item[0]}>
            {item[0]}
        </AutoOption> : <AutoOption></AutoOption>
    );
};