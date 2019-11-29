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
                const { objective, ...rest } = values;
                await store.resultArea.addEvent({ ...rest, programStage: 'ypfEhwBZ4eO', organisationUnits: [store.orgUnit] });
            }
        });
    };
    const { getFieldDecorator } = form;

    const onSelect = (x, { props: { value, children } }) => {
        const obj = JSON.parse(x);

        const index = store.resultArea.related.events.headers.findIndex((x) => {
            return x.name === 'fWpwKdGRp9r'
        });

        form.setFieldsValue({
            'Z0oFe9Y0AkF': children,
        });

        if (index !== -1) {
            form.setFieldsValue({
                'fWpwKdGRp9r': obj[index],
            });
        }
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
                    <Link router={store.router} view={views.resultAreas}>Objectives</Link>
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Card title="New Objective">
                    <Form  {...layouts.formItemLayout} onSubmit={handleSubmit}>
                        <Form.Item label="Objective" key="objective">
                            {getFieldDecorator('objective', {
                                rules: [{ required: true, message: `Please input Objective` }],
                            })(<AutoComplete
                                size="large"
                                dataSource={store.resultArea.related.rows.map(item => {
                                    if (item.data.length > 0) {
                                        return <AutoOption key={item.data[0]} value={JSON.stringify(item.data)}>
                                            {`${item.data[store.resultArea.related.nameAndCodeColumn.codeIndex]} - ${item.data[store.resultArea.related.nameAndCodeColumn.nameIndex]}`}
                                        </AutoOption>
                                    }
                                    return null;
                                })}
                                style={{ width: '50%' }}
                                onSearch={store.resultArea.related.searchEvents}
                                placeholder="Type something to get suggestions"
                                onSelect={onSelect}
                            />)}
                        </Form.Item>
                        {store.resultArea.eventForms['ypfEhwBZ4eO'] ? store.resultArea.eventForms['ypfEhwBZ4eO'].map(s => displayField(s, getFieldDecorator)) : null}
                        <Form.Item {...layouts.tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" size="large">Register</Button>
                        </Form.Item>

                    </Form>
                </Card>
            </Content>
        </div>
    );
};

export const ResultAreaForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));

