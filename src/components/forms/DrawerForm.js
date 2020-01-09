import React from 'react';
import { inject, observer } from "mobx-react";
import {
    Form,
    Button,
    Select,
    Drawer
} from "antd";

import * as layouts from './utils';
import { DisplayField } from './forms';

const DrawerF = ({ store, form, visible, onSubmit, onClose, formColumns, title, hideLocation = false }) => {
    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onSubmit(values);
                form.resetFields();
            }
        });
    };

    const close = () => {
        form.resetFields();
        onClose()
    }

    const onStatus = (val) => {
        form.setFieldsValue({
            'b3KvFkSwZLn': val,
        });
    }

    const { getFieldDecorator } = form;
    return (
        <Drawer
            title={title}
            width="50%"
            visible={visible}
            onClose={close}
            style={{ marginTop: 48 }}
        >
            <Form {...layouts.formItemLayout} onSubmit={handleSubmit}>
                {hideLocation ? null : <Form.Item label="Location">
                    {getFieldDecorator('instance', {
                        rules: [{ required: true, message: `Please input` }],
                    })(<Select
                        placeholder="Select locations where issue was identified"
                        style={{ width: '100%' }}
                        size="large"
                    >
                        {store.currentActivity.fieldActivityLocations.map(item => (
                            <Select.Option key={item.trackedEntityInstance} value={JSON.stringify(item)}>
                                {item.orgUnitName}
                            </Select.Option>
                        ))}
                    </Select>)}
                </Form.Item>}
                {formColumns.map(s => {
                    switch (s.key) {
                        case 'b3KvFkSwZLn':
                            return <DisplayField key={s.key} field={s} getFieldDecorator={getFieldDecorator} initialValue="NEW" />
                        default:
                            if (String(s.title).startsWith('Current Issue Status')) {
                                return <DisplayField key={s.key} field={s} getFieldDecorator={getFieldDecorator} onSelect={onStatus} />
                            }
                            return <DisplayField key={s.key} field={s} getFieldDecorator={getFieldDecorator} />
                    }
                })}
                <Form.Item {...layouts.tailFormItemLayout}>
                    <Button size="large" type="primary" htmlType="submit">Register</Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
}

export const DrawerForm = Form.create({ name: 'register' })(inject("store")(observer(DrawerF)));

