import React from 'react';
import { inject, observer } from "mobx-react";
import {
    Form,
    Input,
    Icon,
    Button,
    DatePicker,
    Select,
    AutoComplete,
    Upload,
    Drawer
} from "antd";

import * as layouts from './utils';

const { Option } = Select;
const { TextArea } = Input;
const { Option: AutoOption } = AutoComplete;


const DrawerF = ({ store, form, visible, onSubmit, onClose, formColumns, title }) => {

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onSubmit(values);
                form.resetFields();
            }
        });
    };

    const close = () => {
        form.resetFields();
        onClose()
    }


    const normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const dummyRequest = async ({ file, onSuccess }) => {
        const api = store.d2.Api.getApi();
        var data = new FormData()
        data.append('file', file)
        const { response: { fileResource: { id } } } = await api.post('fileResources', data);
        console.log(id);
        onSuccess("ok");
    };

    const renderOption = (item) => {
        return (
            <AutoOption key={item.id} value={item.id}>
                {item.displayName}
            </AutoOption>
        );
    };

    const displayField = (field) => {
        let f;
        let conf;
        switch (field.valueType) {
            case 'DATE':
                f = <DatePicker size="large" style={{ width: '100%' }} />;
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

            case 'FILE_RESOURCE':
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
                if (field.key === 'qxnGOCHbKAS') {
                    conf = { ...conf, initialValue: 'New' }
                }
                if (field.optionSet) {
                    f = <Select size="large" disabled={field.key === 'qxnGOCHbKAS'}>
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

                } else {
                    f = <Input size="large" style={{ width: '100%' }} />
                }
        }
        return <Form.Item label={field.title} key={field.key}>
            {getFieldDecorator(field.key, conf)(f)}
        </Form.Item>
    }

    const { getFieldDecorator } = form;
    return (
        <Drawer
            title={title}
            width="45%"
            visible={visible}
            onClose={close}
            style={{ marginTop: 48 }}
        >
            <Form {...layouts.formItemLayout} onSubmit={handleSubmit}>
                {formColumns.map(s => displayField(s))}
                <Form.Item {...layouts.tailFormItemLayout}>
                    <Button size="large" type="primary" htmlType="submit">Register</Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
}

export const DrawerForm = Form.create({ name: 'register' })(inject("store")(observer(DrawerF)));

