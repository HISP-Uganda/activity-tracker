import React, { useEffect, useState } from 'react';
import { inject, observer } from "mobx-react";
import {
    Button,
    Card,
    Form
} from 'antd';
import { useHistory } from "react-router-dom";

import * as layouts from './utils'


import { displayField } from './forms'

const ProjectF = ({ store, form }) => {

    let history = useHistory();

    const [name, setName] = useState(null)
    const [code, setCode] = useState(null)
    const [year, setYear] = useState(null)
    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                values = { ...values, organisationUnits: [store.orgUnit] }
                const events = await store.projectStore.addProject(values);
                history.push('/projects')
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
            await store.projectStore.fetchProgramStages();
            setName(store.projectStore.invertedFormColumns['cIfzworL5Kj']);
            setCode(store.projectStore.invertedFormColumns['UeKCu1x6gC1']);
            setYear(store.projectStore.invertedFormColumns['TipVshCz31g']);
        }
        pull()
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: '50%' }} title="New Project">
                <Form {...layouts.formItemLayout} onSubmit={handleSubmit}>
                    {/* {store.projectStore.formColumns.map(s => displayField(s, store, getFieldDecorator, dummyRequest))} */}

                    {displayField(name, store, getFieldDecorator, dummyRequest)}
                    {displayField(code, store, getFieldDecorator, dummyRequest)}
                    {displayField(year, store, getFieldDecorator, dummyRequest)}

                    <Form.Item {...layouts.tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large">Register</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export const ProjectForm = Form.create({ name: 'register' })(inject("store")(observer(ProjectF)));
