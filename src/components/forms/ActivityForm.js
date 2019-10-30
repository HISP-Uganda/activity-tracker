import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import {
    Form,
    Input,
    Layout,
    Icon,
    Card,
    Button,
    DatePicker,
    Select,
    AutoComplete
} from "antd";
import { Link } from '../../modules/router'
import views from '../../config/views'
import { UnitDialog } from '../UnitDialog'

const { Header, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { Option: AutoOption } = AutoComplete

const ActivityF = ({ store, form }) => {

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const final = {
                    ...values,
                    'KpWl6PY0YK2': values['KpWl6PY0YK2'].format('YYYY-MM-DD'),
                    'xZ38An174EP': values['xZ38An174EP'].format('YYYY-MM-DD'),
                    'wsw7GNdDBK7': values['wsw7GNdDBK7'].format('YYYY-MM-DD'),
                }
                store.currentTracker.addTrackedEntityInstance(final);
                form.resetFields();
            }
        });
    };

    const [units, setUnits] = useState([]);

    const handleSelectChange = async (value) => {
        await store.currentTracker.findData(value);
        form.setFieldsValue(store.currentTracker.otherData);
    };

    const handleOrgUnitChange = (values) => {
        setUnits(values);
        form.setFieldsValue({
            organisationUnits: values.map(v => v.id)
        });
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
    const { getFieldDecorator } = form;
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
                <Card>
                    <Form layout={null} onSubmit={handleSubmit}>
                        <Form.Item>
                            <UnitDialog onUpdate={handleOrgUnitChange} />
                        </Form.Item>
                        <Form.Item label="Selected Locations">
                            {getFieldDecorator('organisationUnits', {
                                rules: [{ required: true, message: `Please input` }],
                            })(<Select
                                mode="multiple"
                                placeholder="Inserted are removed"
                                style={{ width: '100%' }}
                                size="large"
                            >
                                {units.map(item => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.displayName}
                                    </Select.Option>
                                ))}
                            </Select>)}

                        </Form.Item>
                        <Form.Item label="Activity">
                            {getFieldDecorator('activity', {
                                rules: [{ required: true, message: `Please input` }],
                            })(<Select size="large" onChange={handleSelectChange}>
                                {store.activityDataStore.data.map(d => <Option value={d.event} key={d.event}>{d['UeKCu1x6gC1']} - {d['cIfzworL5Kj']}</Option>)}
                            </Select>)}
                        </Form.Item>
                        {store.currentTracker.formColumns.map(s => displayField(s))}
                        <Form.Item label="Activity Implementor">
                            {getFieldDecorator('assignedUser', {
                                rules: [{ required: true, message: `Please input` }],
                            })(<AutoComplete
                                size="large"
                                dataSource={store.currentTracker.users.map(renderOption)}
                                style={{ width: '100%' }}
                                onSearch={store.currentTracker.searchUsers}
                                placeholder="input here"
                            />)}
                        </Form.Item>
                        <Form.Item layout={null}>
                            <Button size="large" type="primary" htmlType="submit">Register</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </div>
    );
}

export const ActivityForm = Form.create({ name: 'register' })(inject("store")(observer(ActivityF)));

