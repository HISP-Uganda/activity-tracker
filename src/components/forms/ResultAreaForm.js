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

const { Option: AutoOption } = AutoComplete

const ProjectF = ({ store, form }) => {
    const history = useHistory();
    const [name, setName] = useState(null);
    const [code, setCode] = useState(null);
    const [project, setProject] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const { x920pWQjZLQ, ...rest } = values;
                const events = await store.resultAreaStore.addProject({ ...rest, organisationUnits: [store.orgUnit] });
                await store.resultAreaStore.addEventRelationShip(events, x920pWQjZLQ, 'x920pWQjZLQ');
                history.push('/result-areas')
            }
        });
    };
    const { getFieldDecorator } = form;

    const renderOption = (item) => {
        return (
            <AutoOption key={item.event} value={item.event}>
                {item.name}
            </AutoOption>
        );
    };


    const onSelect = (value) => {
        store.resultAreaStore.objective.setSelected(value);
        const selected = store.resultAreaStore.objective.selected
        form.setFieldsValue({
            'Z0oFe9Y0AkF': selected.name,
            'fWpwKdGRp9r': selected.fWpwKdGRp9r
        });
    }

    const dummyRequest = async ({ file, onSuccess }) => {
        const api = store.d2.Api.getApi();
        var data = new FormData()
        data.append('file', file)
        const { response: { fileResource: { id } } } = await api.post('fileResources', data);
        console.log(id);
        onSuccess("ok");
    };

    useEffect(() => {
        async function pull() {
            await store.resultAreaStore.fetchProgramStages();
            setName(store.resultAreaStore.invertedFormColumns['cIfzworL5Kj']);
            setCode(store.resultAreaStore.invertedFormColumns['UeKCu1x6gC1']);
            setProject(store.resultAreaStore.invertedFormColumns['fWpwKdGRp9r']);
        }
        pull()
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '50%' }}>
                <Form layout={null} onSubmit={handleSubmit}>
                    <Form.Item label={store.resultAreaStore.objective.fromToName.charAt(0).toUpperCase() + store.resultAreaStore.objective.fromToName.slice(1)} key={store.resultAreaStore.objective.id}>
                        {getFieldDecorator(store.resultAreaStore.objective.id, {
                            rules: [{ required: true, message: `Please input Activity` }],
                        })(<AutoComplete
                            size="large"
                            dataSource={store.resultAreaStore.objective.events.map(renderOption)}
                            style={{ width: '100%' }}
                            onSearch={store.resultAreaStore.objective.searchEvents}
                            placeholder="Type something to get suggestions"
                            onSelect={onSelect}
                        />)}
                    </Form.Item>
                    {displayField(project, store, getFieldDecorator, dummyRequest)}
                    {displayField(name, store, getFieldDecorator, dummyRequest)}
                    {displayField(code, store, getFieldDecorator, dummyRequest)}

                    <Form.Item label="Related" style={{ display: 'none' }}>
                        {getFieldDecorator('Z0oFe9Y0AkF', {
                            rules: [{ required: false, message: `Please input Activity` }],
                        })(<Input size="large" style={{ width: '100%' }} />)}
                    </Form.Item>
                    <Form.Item layout={null}>
                        <Button type="primary" htmlType="submit" size="large">Register</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export const ResultAreaForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));

