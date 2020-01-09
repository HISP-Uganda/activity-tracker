import React, { useState } from 'react';
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

const { Option: AutoOption } = AutoComplete;
export const DisplayField = ({ field, getFieldDecorator, ...rest }) => {

    const [searched, setSearched] = useState(field.optionSet ? field.optionSet.options : []);
    const onSelect = rest.onSelect || null

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

    const placeholder = rest.placeholder || ''

    const search = (val) => {
        const filtered = field.optionSet.options.filter(o => {
            return String(o.name).toLowerCase().includes(String(val).toLowerCase())
        });

        setSearched(filtered)
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

        default:
            conf = {
                ...conf,
                rules: [{ required: field.mandatory, message: `Please input ${field.title}` }],
            }
            if (field.optionSet) {
                f = <Select
                    showSearch
                    style={style}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={search}
                    notFoundContent={null}
                    size="large"
                    onSelect={onSelect}
                    placeholder={placeholder}
                >
                    {searched.map(d => <Option value={d.code} key={d.code}>{d.name}</Option>)}
                </Select>
            } else {
                f = <Input size="large" style={{ width: '100%' }} />
            }
    }

    return (
        <Form.Item label={field.title} key={field.key} style={style}>
            {getFieldDecorator(field.key, conf)(f)}
        </Form.Item>
    );
}

export const renderOption = (item) => {
    return (
        item && item.length > 0 ? <AutoOption key={item[0]} value={item[0]}>
            {item[0]}
        </AutoOption> : <AutoOption></AutoOption>
    );
};