import React from 'react';
import { inject, observer } from "mobx-react";

import {
    Form,
    Input,
    Layout,
    Icon,
    Card,
    Button,
    Select
} from "antd";
import { Link } from '../../modules/router'
import views from '../../config/views'


const { Header, Content } = Layout;

const { Option } = Select;


const ProjectF = ({ store, form }) => {
    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                store.currentProgram.addProject(values);
                form.resetFields();
            }
        });
    };
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
                        {store.currentProgram.columns.map(s => <Form.Item label={s.title} key={s.key}>
                            {s.isRelationship ? getFieldDecorator(s.key, {
                                rules: [{ required: true, message: `Please input ${s.title}` }],
                            })(<Select size="large">
                                {store.currentProgram.relatedProgram.data.map(d => <Option value={d.event} key={d.event}>{d['UeKCu1x6gC1']} - {d['cIfzworL5Kj']}</Option>)}
                            </Select>) : getFieldDecorator(s.key, {
                                rules: [{ required: true, message: `Please input ${s.title}` }],
                            })(<Input size="large" style={{ width: '100%' }} />)}
                        </Form.Item>)}
                        <Form.Item layout={null}>
                            <Button type="primary" htmlType="submit" size="large">Register</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </div>
    );
}

export const ProjectForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));

