import React from 'react';
import { inject, observer } from "mobx-react";

import {
    Form,
    Input,
    Layout,
    Icon,
    Card,
    Button
} from "antd";
import { Link } from '../../modules/router'
import views from '../../config/views'


const { Header, Content } = Layout;

const ResultAreaF = ({ store, form }) => {
    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            store.projectStore.addProject(values);
            // if (!err) {
            //     store.projectStore.addProject(values);
            //     store.projectStore.closeModal();
            //     form.resetFields();
            // }
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
                        <Form.Item label="Project Code">
                            {getFieldDecorator('UeKCu1x6gC1', {
                                rules: [{ required: true, message: 'Please input project code' }],
                            })(<Input size="large" style={{ width: '100%' }} />)}
                        </Form.Item>

                        <Form.Item label="Project Name">
                            {getFieldDecorator('cIfzworL5Kj', {
                                rules: [{ required: true, message: 'Please input project name' }],
                            })(<Input size="large" style={{ width: '100%' }} />)}
                        </Form.Item>

                        <Form.Item label="Project Year">
                            {getFieldDecorator('TipVshCz31g', {
                                rules: [{ required: true, message: 'Please input project year' }],
                            })(<Input size="large" style={{ width: '100%' }} />)}
                        </Form.Item>

                        <Form.Item layout={null}>
                            <Button type="primary" htmlType="submit">Register</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </div>
    );
}

export const ResultAreaForm = Form.create({ name: 'register' })(inject("store")(observer(ResultAreaF)));

