import React from 'react';
import { inject, observer } from "mobx-react";
import {
    Button,
    Card,
    Form,
    Layout,
    Icon
} from 'antd';
import { Link } from '../../modules/router';
import views from '../../config/views';
import * as layouts from './utils';
import { displayField } from './forms';

const { Header, Content } = Layout;
const ProjectF = ({ store, form }) => {

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                values = { ...values, organisationUnits: [store.orgUnit], programStage: 'Z7c1QiSIHRM' }
                await store.project.addEvent(values);
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
                    <Link router={store.router} view={views.projects}>Projects</Link>
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Card title="New Project">
                    <Form {...layouts.formItemLayout} onSubmit={handleSubmit}>
                        {store.project.eventForms && store.project.eventForms['Z7c1QiSIHRM'] ? store.project.eventForms['Z7c1QiSIHRM'].map(s => displayField(s, getFieldDecorator)) : null}
                        <Form.Item {...layouts.tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" size="large">Register</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </div>
    );
};

export const ProjectForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));
