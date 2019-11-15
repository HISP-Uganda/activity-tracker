import React, { useEffect, useState } from 'react';
import { inject, observer } from "mobx-react";
import {
    Button,
    Card,
    Form,
    AutoComplete,
    Input
} from 'antd';
import { useHistory } from "react-router-dom";
import { displayField } from './forms';

const { Option: AutoOption } = AutoComplete


const ProjectF = ({ store, form }) => {
    let history = useHistory();

    const [name, setName] = useState(null)
    const [code, setCode] = useState(null)
    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const { M2dzx5RlDyU, ...rest } = values;
                const events = await store.objectiveStore.addProject({ ...rest, organisationUnits: [store.orgUnit] });
                await store.objectiveStore.addEventRelationShip(events, M2dzx5RlDyU, 'M2dzx5RlDyU');
                history.push('/objectives')
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


    const onSelect = (x, { props: { value, children } }) => {
        form.setFieldsValue({
            'fWpwKdGRp9r': children,
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
            await store.objectiveStore.fetchProgramStages();
            setName(store.objectiveStore.invertedFormColumns['cIfzworL5Kj']);
            setCode(store.objectiveStore.invertedFormColumns['UeKCu1x6gC1']);
        }
        pull()
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '50%' }}>
                <Form layout={null} onSubmit={handleSubmit}>
                    {/* {store.objectiveStore.formColumns.map(s => displayField(s, store, getFieldDecorator, dummyRequest))} */}
                    {displayField(name, store, getFieldDecorator, dummyRequest)}
                    {displayField(code, store, getFieldDecorator, dummyRequest)}
                    <Form.Item label={store.objectiveStore.project.fromToName} key={store.objectiveStore.project.id}>
                        {getFieldDecorator(store.objectiveStore.project.id, {
                            rules: [{ required: true, message: `Please input Activity` }],
                        })(<AutoComplete
                            size="large"
                            dataSource={store.objectiveStore.project.events.map(renderOption)}
                            style={{ width: '100%' }}
                            onSearch={store.objectiveStore.project.searchEvents}
                            placeholder="Type something to get suggestions"
                            onSelect={onSelect}
                        />)}
                    </Form.Item>
                    <Form.Item label="Related" style={{ display: 'none' }}>
                        {getFieldDecorator('fWpwKdGRp9r', {
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

export const ObjectiveForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));

