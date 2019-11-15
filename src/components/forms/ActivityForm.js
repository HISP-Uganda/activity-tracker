import React, { useEffect, useState } from 'react';
import { inject, observer } from "mobx-react";
import {
    Button,
    Card,
    Form,
    Select,
    AutoComplete,
    Input
} from 'antd';
import moment from 'moment';

import { useHistory } from "react-router-dom";
import { displayField } from './forms';
import { UnitDialog } from '../UnitDialog'

const { Option: AutoOption } = AutoComplete

const ProjectF = ({ store, form }) => {

    let history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                let { IhlPwVe5IfY, ...rest } = values;
                const plannedStartDate = values['JGq3OlNPVEh'];
                const today = moment();

                if (plannedStartDate.diff(today, 'days') <= 0) {
                    rest = { ...rest, fy5XDC0rMKj: 'Overdue' }
                } else if (plannedStartDate.diff(today, 'days') <= 7) {
                    rest = { ...rest, fy5XDC0rMKj: 'Upcoming' }
                } else if (plannedStartDate.diff(today, 'days') > 7) {
                    rest = { ...rest, fy5XDC0rMKj: 'On Schedule' }
                }

                const events = await store.activityStore.addProject(rest);
                await store.activityStore.addEventRelationShip(events, IhlPwVe5IfY, 'IhlPwVe5IfY');
                history.push('/activities')
            }
        });
    };

    const [submissionDate, setSubmissionDate] = useState(null);
    const [plannedStartDate, setPlannedStartDate] = useState(null);
    const [plannedEndDate, setPlannedEndDate] = useState(null);
    const [objective, setObjective] = useState(null);
    const [project, setProject] = useState(null);
    const [resultArea, setResultArea] = useState(null);
    const [output, setOutput] = useState(null);

    const { getFieldDecorator } = form;
    const dummyRequest = async ({ file, onSuccess }) => {
        const api = store.d2.Api.getApi();
        var data = new FormData()
        data.append('file', file)
        const { response: { fileResource: { id } } } = await api.post('fileResources', data);
        onSuccess("ok");
    };

    useEffect(() => {
        async function pull() {
            await store.activityStore.fetchProgramStages();
            // const fields = store.activityStore.formColumns.filter(f => {
            //     return f.mandatory
            // })
            setSubmissionDate(store.activityStore.invertedFormColumns['Gv7b2vhEwXF']);
            setPlannedStartDate(store.activityStore.invertedFormColumns['JGq3OlNPVEh']);
            setPlannedEndDate(store.activityStore.invertedFormColumns['g0GYTsWLybB']);

            setObjective(store.activityStore.invertedFormColumns['Z0oFe9Y0AkF']);
            setProject(store.activityStore.invertedFormColumns['fWpwKdGRp9r']);
            setResultArea(store.activityStore.invertedFormColumns['Cwu1KVVPMzp']);
            setOutput(store.activityStore.invertedFormColumns['iCnLNYXlxLI']);
            // console.log(invertedFormColumns)
            // setCurrentForm(fields)
        }
        pull()
    }, []);

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
        },
    };

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 18,
                offset: 6,
            },
        },
    };

    const handleOrgUnitChange = (values) => {
        setUnits(values);
        form.setFieldsValue({
            organisationUnits: values.map(v => v.id)
        });
    };
    const [units, setUnits] = useState([]);
    const renderOption = (item) => {
        return (
            <AutoOption key={item.event} value={item.event}>
                {item.name}
            </AutoOption>
        );
    };

    const renderOption2 = (item) => {
        return (
            <AutoOption key={item.id} value={item.id}>
                {item.displayName}
            </AutoOption>
        );
    };

    const onSelect = async (value) => {

        store.activityStore.activity.setSelected(value);
        const selected = store.activityStore.activity.selected
        form.setFieldsValue({
            'Cwu1KVVPMzp': selected.name,
            'Z0oFe9Y0AkF': selected.Z0oFe9Y0AkF,
            'fWpwKdGRp9r': selected.fWpwKdGRp9r,
            'kyabbLdN8OB': selected.name,
            'iCnLNYXlxLI': selected.iCnLNYXlxLI
        });
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '70%' }}>
                <Form {...formItemLayout} onSubmit={handleSubmit}>
                    <Form.Item {...tailFormItemLayout}>
                        <UnitDialog onUpdate={handleOrgUnitChange} />
                    </Form.Item>
                    <Form.Item label="Selected Locations">
                        {getFieldDecorator('organisationUnits', {
                            rules: [{ required: true, message: `Please input` }],
                        })(<Select
                            disabled
                            mode="multiple"
                            placeholder="Select locations from above"
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

                    <Form.Item label={store.activityStore.activity.fromToName} key={store.activityStore.activity.id}>
                        {getFieldDecorator(store.activityStore.activity.id, {
                            rules: [{ required: true, message: `Please input Activity` }],
                        })(<AutoComplete
                            size="large"
                            dataSource={store.activityStore.activity.events.map(renderOption)}
                            style={{ width: '100%' }}
                            onSearch={store.activityStore.activity.searchEvents}
                            placeholder="Type something to get suggestions"
                            onSelect={onSelect}
                        />)}
                    </Form.Item>

                    {displayField(output, store, getFieldDecorator, dummyRequest)}
                    {displayField(resultArea, store, getFieldDecorator, dummyRequest)}
                    {displayField(objective, store, getFieldDecorator, dummyRequest)}
                    {displayField(project, store, getFieldDecorator, dummyRequest)}

                    {displayField(submissionDate, store, getFieldDecorator, dummyRequest)}
                    {displayField(plannedStartDate, store, getFieldDecorator, dummyRequest)}
                    {displayField(plannedEndDate, store, getFieldDecorator, dummyRequest)}

                    <Form.Item label="Implementor">
                        {getFieldDecorator('assignedUser', {
                            rules: [{ required: true, message: `Please input Implementor` }],
                        })(<AutoComplete
                            size="large"
                            dataSource={store.users.map(renderOption2)}
                            style={{ width: '100%' }}
                            onSearch={store.searchUsers}
                            placeholder="Type something to get suggestions"
                        />)}
                    </Form.Item>
                    <Form.Item label="Activity" style={{ display: 'none' }}>
                        {getFieldDecorator('kyabbLdN8OB', {
                            rules: [{ required: false, message: `Please input Activity` }],
                        })(<Input size="large" style={{ width: '100%' }} />)}
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large">Register</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export const ActivityForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));