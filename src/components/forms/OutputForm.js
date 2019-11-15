import React, { useEffect } from 'react';
import { inject, observer } from "mobx-react";
import {
    Button,
    Card,
    Form
} from 'antd';
import { useHistory } from "react-router-dom";

import { displayField } from './forms'

const ProjectF = ({ store, form }) => {
    let history = useHistory();

    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                values = { ...values, organisationUnits: [store.orgUnit] }
                await store.outputStore.addProject(values);
                history.push('/outputs')
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

    useEffect(() => {
        async function pull() {
            await store.outputStore.fetchProgramStages();
        }
        pull()
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '50%' }}>
                <Form layout={null} onSubmit={handleSubmit}>
                    {store.outputStore.formColumns.map(s => displayField(s, store, getFieldDecorator, dummyRequest))}
                    <Form.Item layout={null}>
                        <Button type="primary" htmlType="submit" size="large">Register</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export const OutputForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));

