import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import {
    Layout, Icon, Button, Card, Form, Input, Row, Col, Upload,
    DatePicker,
    Select,
    AutoComplete
} from 'antd';
import { Link } from '../modules/router';
import views from '../config/views';

import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

const { Header, Content } = Layout;

const { Option } = Select;
const { TextArea } = Input;
const { Option: AutoOption } = AutoComplete


const ActivityDetails = ({ store, form }) => {
    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            console.log(values);
            if (!err) {
            }
        });
    };
    const { getFieldDecorator } = form;
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
                f = <DatePicker size="large" />;
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
                if (field.optionSet) {
                    f = <Select size="large">
                        {field.optionSet.options.map(d => <Option value={d.code} key={d.code}>{d.name}</Option>)}
                    </Select>
                } else if (field.searchUsers) {
                    f = <AutoComplete
                        size="large"
                        dataSource={store.currentTracker.users.map(renderOption)}
                        style={{ width: '100%' }}
                        onSearch={store.currentTracker.searchUsers}
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

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]


    const [text, setText] = useState('')

    return (
        <div>
            <Header style={{ background: '#fff', padding: 0, paddingRight: 5, paddingLeft: 5, display: 'flex' }}>
                <div style={{ width: 50 }}>
                    <Icon
                        className="trigger"
                        type={store.settings.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={store.settings.toggle}
                        style={{ fontSize: 20 }}
                    />
                </div>
                <div>
                    <Link router={store.router} view={views.activityForm}>Create</Link>
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card>
                            <Form layout={null} onSubmit={handleSubmit}>
                                {store.currentTracker.currentInstance.eventStore.formColumns.map(s => displayField(s))}
                                {/* <Form.Item label="Dragger">
                                    {getFieldDecorator('dragger', {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: normFile,
                                    })(
                                        <Upload.Dragger name="files" customRequest={dummyRequest} multiple={false}>
                                            <p className="ant-upload-drag-icon">
                                                <Icon type="inbox" />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                            <p className="ant-upload-hint">Support for a single upload.</p>
                                        </Upload.Dragger>,
                                    )}
                                </Form.Item> */}
                                {/* <Form.Item>
                                    {getFieldDecorator('report', {
                                        rules: [{ required: true, message: `Please input` }],
                                    })(
                                        <ReactQuill modules={modules} formats={formats} theme="snow" />
                                    )}

                                </Form.Item> */}
                                <Form.Item layout={null}>
                                    <Button type="primary" htmlType="submit" size="large">Register</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <ReactQuill value={text} onChange={setText} modules={modules} formats={formats} theme="snow" />
                        </Card>
                    </Col>
                </Row>
            </Content>
        </div>
    );
};

export const ReportDetails = Form.create({ name: 'register' })(inject("store")(observer(ActivityDetails)));
