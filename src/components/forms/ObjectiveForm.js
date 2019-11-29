import React from 'react';
import { inject, observer } from "mobx-react";
import {
    Button,
    Card,
    Form,
    AutoComplete,
    Layout,
    Icon
} from 'antd';

import * as layouts from './utils';

import { Link } from '../../modules/router';
import views from '../../config/views';
import { displayField } from './forms';

const { Header, Content } = Layout;
const { Option: AutoOption } = AutoComplete

const ProjectF = ({ store, form }) => {
    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const { project, ...rest } = values;
                await store.objective.addEvent({ ...rest, programStage: 'l4S0gKepf1O', organisationUnits: [store.orgUnit] });
            }
        });
    };
    const { getFieldDecorator } = form;

    const onSelect = (x, { props: { value, children } }) => {
        form.setFieldsValue({
            'fWpwKdGRp9r': children,
        });
    }

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
                    <Link router={store.router} view={views.objectives}>Objectives</Link>
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Card title="New Objective">
                    <Form  {...layouts.formItemLayout} onSubmit={handleSubmit}>
                        <Form.Item label="Project" key="project">
                            {getFieldDecorator('project', {
                                rules: [{ required: true, message: `Please input Project` }],
                            })(<AutoComplete
                                size="large"
                                dataSource={store.objective.related.rows.map(item => {
                                    if (item.data.length > 0) {
                                        return <AutoOption key={item.data[0]} value={JSON.stringify(item.data)}>
                                            {`${item.data[store.objective.related.nameAndCodeColumn.codeIndex]} - ${item.data[store.objective.related.nameAndCodeColumn.nameIndex]}`}
                                        </AutoOption>
                                    }
                                    return null;
                                })}
                                style={{ width: '50%' }}
                                onSearch={store.objective.related.searchEvents}
                                placeholder="Type something to get suggestions"
                                onSelect={onSelect}
                            />)}
                        </Form.Item>
                        {store.objective.eventForms['l4S0gKepf1O'] ? store.objective.eventForms['l4S0gKepf1O'].map(s => displayField(s, getFieldDecorator)) : null}
                        <Form.Item {...layouts.tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" size="large">Register</Button>
                        </Form.Item>

                    </Form>
                </Card>
            </Content>
        </div>
    );
};

export const ObjectiveForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));

