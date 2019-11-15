import React, { useEffect, useState } from 'react';
import { inject, observer } from "mobx-react";
import {
    Button,
    Card,
    Form,
    AutoComplete,
    Input
} from 'antd';
import { useHistory } from 'react-router-dom'
import { displayField } from './forms'
import * as layouts from './utils';

const { Option: AutoOption } = AutoComplete

const ProjectF = ({ store, form }) => {
    const history = useHistory();
    const [name, setName] = useState(null);
    const [code, setCode] = useState(null);
    const [frequency, setFrequency] = useState(null);
    const [financialYear, setFinancialYear] = useState(null);
    const [objective, setObjective] = useState(null);
    const [project, setProject] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const { X9MsPaBZk1w, CaW7Hk5JBhD, ...rest } = values;
                const events = await store.activityDataStore.addProject({ ...rest, organisationUnits: [store.orgUnit] });
                await store.resultAreaStore.addEventRelationShip(events, X9MsPaBZk1w, 'X9MsPaBZk1w');
                await store.resultAreaStore.addEventRelationShip(events, CaW7Hk5JBhD, 'CaW7Hk5JBhD');
                history.push('/activity-data')
            }
        });
    };
    const { getFieldDecorator } = form;

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
            <AutoOption key={item.event} value={item.event}>
                {item.name}
            </AutoOption>
        );
    };

    const onSelect1 = (value) => {
        store.activityDataStore.resultArea.setSelected(value);
        const selected = store.activityDataStore.resultArea.selected
        form.setFieldsValue({
            'Cwu1KVVPMzp': selected.name,
            'Z0oFe9Y0AkF': selected.Z0oFe9Y0AkF,
            'fWpwKdGRp9r': selected.fWpwKdGRp9r
        });
    }

    const onSelect2 = (x, { props: { value, children } }) => {
        form.setFieldsValue({
            'iCnLNYXlxLI': children,
        });
    }


    useEffect(() => {
        async function pull() {
            await store.activityDataStore.fetchProgramStages();
            setName(store.activityDataStore.invertedFormColumns['cIfzworL5Kj']);
            setCode(store.activityDataStore.invertedFormColumns['UeKCu1x6gC1']);
            setFrequency(store.activityDataStore.invertedFormColumns['WbuQ2qZXdr5']);
            setFinancialYear(store.activityDataStore.invertedFormColumns['V1RXJKhddAd']);
            setObjective(store.activityDataStore.invertedFormColumns['Z0oFe9Y0AkF']);
            setProject(store.activityDataStore.invertedFormColumns['fWpwKdGRp9r']);
        }
        pull()
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '50%' }}>
                <Form {...layouts.formItemLayout} onSubmit={handleSubmit}>
                    {/* {store.activityDataStore.formColumns.map(s => displayField(s, store, getFieldDecorator, dummyRequest))} */}
                    <Form.Item label={store.activityDataStore.resultArea.fromToName} key={store.activityDataStore.resultArea.id}>
                        {getFieldDecorator(store.activityDataStore.resultArea.id, {
                            rules: [{ required: true, message: `Please input Activity` }],
                        })(<AutoComplete
                            size="large"
                            dataSource={store.activityDataStore.resultArea.events.map(renderOption)}
                            style={{ width: '100%' }}
                            onSearch={store.activityDataStore.resultArea.searchEvents}
                            placeholder="Type something to get suggestions"
                            onSelect={onSelect1}
                        />)}
                    </Form.Item>


                    <Form.Item label={store.activityDataStore.output.fromToName} key={store.activityDataStore.output.id}>
                        {getFieldDecorator(store.activityDataStore.output.id, {
                            rules: [{ required: true, message: `Please input Activity` }],
                        })(<AutoComplete
                            size="large"
                            dataSource={store.activityDataStore.output.events.map(renderOption)}
                            style={{ width: '100%' }}
                            onSearch={store.activityDataStore.output.searchEvents}
                            placeholder="Type something to get suggestions"
                            onSelect={onSelect2}
                        />)}
                    </Form.Item>
                    {displayField(objective, store, getFieldDecorator, dummyRequest)}
                    {displayField(project, store, getFieldDecorator, dummyRequest)}
                    {displayField(name, store, getFieldDecorator, dummyRequest)}
                    {displayField(code, store, getFieldDecorator, dummyRequest)}
                    {displayField(frequency, store, getFieldDecorator, dummyRequest)}
                    {displayField(financialYear, store, getFieldDecorator, dummyRequest)}

                    <Form.Item label="Result Area" style={{ display: 'none' }}>
                        {getFieldDecorator('Cwu1KVVPMzp', {
                            rules: [{ required: false, message: `Please input Activity` }],
                        })(<Input size="large" style={{ width: '100%' }} />)}
                    </Form.Item>

                    <Form.Item label="Output" style={{ display: 'none' }}>
                        {getFieldDecorator('iCnLNYXlxLI', {
                            rules: [{ required: false, message: `Please input Activity` }],
                        })(<Input size="large" style={{ width: '100%' }} />)}
                    </Form.Item>

                    <Form.Item {...layouts.tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large">Register</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export const ActivityDataForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));

