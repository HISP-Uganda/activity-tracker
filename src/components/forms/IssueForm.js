import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import {
    Card,
    Form,
    Icon,
    Layout,
    Button,
    Select,
    notification,
    DatePicker
} from 'antd';
import moment from 'moment';
import shortid from 'shortid';
import { fromPairs, uniq } from 'lodash';
import { Link } from '../../modules/router';
import views from '../../config/views';
import { DisplayField } from './forms';
import { UnitDialog } from '../UnitDialog'
import * as layouts from './utils';

const { Header, Content } = Layout;

const { RangePicker } = DatePicker;


const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};

const IssueF = ({ store, form }) => {
    const { getFieldDecorator } = form;
    const [units, setUnits] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [resultAreas, setResultAreas] = useState([]);

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

                if (!rest['XdmZ9lk11i4']) {
                    rest = {
                        ...rest,
                        XdmZ9lk11i4: shortid.generate()
                    }
                }

                let newOus = []

                organisationUnits.forEach(ou => {
                    newOus = [...newOus, { ou, dates: rest[ou] }];
                    rest = Object.keys(rest).reduce((object, key) => {
                        if (key !== ou) {
                            object[key] = rest[key]
                        }
                        return object
                    }, {})
                });

                await store.plannedActivity.addTrackedEntityInstance({ ...rest, organisationUnits: newOus });
                notification.open({
                    message: 'Activity',
                    description: 'Activity has been successfully submitted',
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                });
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

    const addOptions = (id, options) => {
        const index = store.plannedActivity.form.findIndex(a => {
            return id === a.key
        });
        store.plannedActivity.form[index].optionSet = { options }
    }

    const onSelectProject = async (val) => {
        const events = await store.activity.searchEventsByColumn('fWpwKdGRp9r', val);
        const processed = events.map(({ dataValues }) => {
            return fromPairs(dataValues.map(d => [d.dataElement, d.value]))
        });

        const objectives = uniq(processed.map(x => x['B9cvWgxoOtK'])).map(v => {
            return { code: v, name: v }
        });
        addOptions('dPEK5RaFqLx', objectives);
        setObjectives(processed);
    }

    const onSelectObjective = (val) => {
        const rs = objectives.filter(x => x['B9cvWgxoOtK'] === val)
        const resultAreas = uniq(rs.map(x => x['Ga5eVHJMePt'])).map(v => {
            return { code: v, name: v }
        });
        addOptions('vIlcCjuhlUG', resultAreas);
        setResultAreas(rs)
    }

    const onSelectResultArea = (val) => {
        const activities = uniq(resultAreas.filter(x => x['Ga5eVHJMePt'] === val).map(x => x['cIfzworL5Kj'])).map(v => {
            return { code: v, name: v }
        });
        addOptions('le0A6qC3Oap', activities);
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
                        <Form.Item label="Selected Sites">
                            {getFieldDecorator('organisationUnits', {
                                rules: [{ required: true, message: `Please input` }],
                            })(<Select
                                disabled
                                mode="multiple"
                                placeholder="Select sites from above"
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
                        {store.plannedActivity.form.map(f => {
                            switch (f.key) {
                                case 'fXVrCt5zPf7':
                                    return <DisplayField key={f.key} field={f} getFieldDecorator={getFieldDecorator} onSelect={onSelectProject} />
                                case 'dPEK5RaFqLx':
                                    return <DisplayField key={f.key} field={f} getFieldDecorator={getFieldDecorator} onSelect={onSelectObjective} />
                                case 'vIlcCjuhlUG':
                                    return <DisplayField key={f.key} field={f} getFieldDecorator={getFieldDecorator} onSelect={onSelectResultArea} />
                                default:
                                    return <DisplayField key={f.key} field={f} getFieldDecorator={getFieldDecorator} />
                            }
                        })}
                        <Form.Item label="Schedules">
                            <table width="100%">
                                <thead>
                                    <tr>
                                        <th>Organisation</th>
                                        <th>Planned Start and End Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.displayName}</td>
                                            <td>
                                                <Form.Item >
                                                    {getFieldDecorator(item.id, rangeConfig)(<RangePicker size="large" />)}
                                                </Form.Item>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </Form.Item>
                        <Form.Item {...layouts.tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" size="large">Add Planned Activity</Button>
                        </Form.Item>
                    </Form>
                </Card>

            </Content>
        </div>
    );
};

export const IssueForm = Form.create({ name: 'issueForm' })(inject("store")(observer(IssueF)));