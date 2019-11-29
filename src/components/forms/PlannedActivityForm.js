import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import {
    Card,
    Form,
    Icon,
    Layout,
    Button,
    Select,
    AutoComplete
} from 'antd';
import moment from 'moment';

import { Link } from '../../modules/router';
import views from '../../config/views';
import { displayField } from './forms';
import { UnitDialog } from '../UnitDialog'

import * as layouts from './utils';

const { Header, Content } = Layout;
const { Option: AutoOption } = AutoComplete

const ProjectF = ({ store, form }) => {
    const { getFieldDecorator } = form;

    const [units, setUnits] = useState([]);

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                let { organisationUnits, activity, ...rest } = values;
                const plannedStartDate = values['eN9jthkmMds'];
                const today = moment();
                if (plannedStartDate.diff(today, 'days') <= 0) {
                    rest = { ...rest, GeIEoCBrKaW: 'Overdue' }
                } else if (plannedStartDate.diff(today, 'days') <= 7) {
                    rest = { ...rest, GeIEoCBrKaW: 'Upcoming' }
                } else if (plannedStartDate.diff(today, 'days') > 7) {
                    rest = { ...rest, GeIEoCBrKaW: 'On Schedule' }
                }
                rest = {
                    ...rest,
                    Hq4FUe27qSF: rest['Hq4FUe27qSF'].format('YYYY-MM-DD'),
                    pyQEzpRRcqH: rest['pyQEzpRRcqH'].format('YYYY-MM-DD'),
                    eN9jthkmMds: rest['eN9jthkmMds'].format('YYYY-MM-DD'),
                }
                await store.plannedActivity.addTrackedEntityInstance({ ...rest, organisationUnits });
                store.router.setView(views.plannedActivity, {})
            }
        });
    };

    const handleOrgUnitChange = (values) => {
        setUnits(values);
        form.setFieldsValue({
            organisationUnits: values.map(v => v.id)
        });
    };

    const onSelect = async (x, { props: { value, children } }) => {

        const obj = JSON.parse(x);

        const index = store.plannedActivity.related.headers.findIndex((x) => {
            return x.name === 'fWpwKdGRp9r'
        });
        const index1 = store.plannedActivity.related.headers.findIndex((x) => {
            return x.name === 'B9cvWgxoOtK'
        });
        const index2 = store.plannedActivity.related.headers.findIndex((x) => {
            return x.name === 'Ga5eVHJMePt'
        });
        const index3 = store.plannedActivity.related.headers.findIndex((x) => {
            return x.name === 'iCnLNYXlxLI'
        });

        form.setFieldsValue({
            'le0A6qC3Oap': children,
        });

        if (index !== -1) {
            form.setFieldsValue({
                'fXVrCt5zPf7': obj[index],
            });
        }
        if (index1 !== -1) {
            form.setFieldsValue({
                'dPEK5RaFqLx': obj[index1],
            });
        }
        if (index2 !== -1) {
            form.setFieldsValue({
                'vIlcCjuhlUG': obj[index2],
            });
        }

        if (index3 !== -1) {
            form.setFieldsValue({
                'LCOSVJjQDiv': obj[index3]
            })
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
                    <Link router={store.router} view={views.plannedActivity}>Planned Activities</Link>
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Card title="Planned Activities">
                    <Form {...layouts.formItemLayout} onSubmit={handleSubmit}>
                        <Form.Item {...layouts.tailFormItemLayout}>
                            <UnitDialog onUpdate={handleOrgUnitChange} />
                        </Form.Item>
                        <Form.Item label="Selected Locations">
                            {getFieldDecorator('organisationUnits', {
                                rules: [{ required: true, message: `Please input` }],
                            })(<Select
                                disabled
                                mode="multiple"
                                placeholder="Select locations from above"
                                style={{ width: '50%' }}
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
                                rules: [{ required: true, message: `Please input Activity` }],
                            })(<AutoComplete
                                size="large"
                                dataSource={store.plannedActivity.related.rows.map(item => {
                                    if (item.data.length > 0) {
                                        return <AutoOption key={item.data[0]} value={JSON.stringify(item.data)}>
                                            {`${item.data[store.plannedActivity.related.nameAndCodeColumn.codeIndex]} - ${item.data[store.plannedActivity.related.nameAndCodeColumn.nameIndex]}`}
                                        </AutoOption>
                                    }
                                    return null;
                                })}
                                style={{ width: '50%' }}
                                onSearch={store.plannedActivity.related.searchEvents}
                                placeholder="Type something to get suggestions"
                                onSelect={onSelect}
                            />)}
                        </Form.Item>
                        {store.plannedActivity.form.map(f => displayField(f, getFieldDecorator))}
                        <Form.Item {...layouts.tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" size="large">Add Planned Activity</Button>
                        </Form.Item>
                    </Form>
                </Card>

            </Content>
        </div>
    );
};

export const PlannedActivityForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));