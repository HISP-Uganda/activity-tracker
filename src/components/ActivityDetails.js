import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import {
    Form,
    Card,
    Layout,
    Icon,
    Col,
    Row,
    Button,
    Upload,
    Table,
    Descriptions
} from 'antd';
import { Link } from '../modules/router';
import views from '../config/views';
import { displayField } from './forms/forms';
import * as layouts from './forms/utils';
import { DrawerForm } from './forms/DrawerForm';


const { Header, Content } = Layout;

const BForm = ({ store, form }) => {

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const onExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.event]);
        } else {
            setExpandedRowKeys([])
        }
    }
    const handleSubmit = e => {
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                let { upload, ...rest } = values;
                rest = {
                    ...rest,
                    BNoMKfDs0Oj: rest['BNoMKfDs0Oj'].format('YYYY-MM-DD'),
                    kc42dsL4xqA: rest['kc42dsL4xqA'].format('YYYY-MM-DD'),
                }
                await store.plannedActivity.addEvent({ ...rest, programStage: 'gCp6ffVmx0g', organisationUnits: [store.currentRow.event.orgUnit], trackedEntityInstance: store.currentRow.event.trackedEntityInstance });
                await store.currentRow.updateActivityStatus('Report Submitted');
                await store.currentRow.fetchEvents();
            }
        });
    };

    const onSubmit = async (values) => {
        values = {
            ...values,
            BEIor2SEmOp: values['BEIor2SEmOp'].format('YYYY-MM-DD')
        }
        await store.plannedActivity.addEvent({ ...values, programStage: 'qky1qGVPe7e', organisationUnits: [store.currentRow.event.orgUnit], trackedEntityInstance: store.currentRow.event.trackedEntityInstance });
        await store.currentRow.fetchEvents();
        store.hideIssueDialog()
    }

    const onActionSubmit = async (values) => {
        values = {
            ...values,
            SO9B1IUruRa: values['SO9B1IUruRa'].format('YYYY-MM-DD'),
            XhzH8wqpiyo: values['XhzH8wqpiyo'].format('YYYY-MM-DD'),
        }
        await store.plannedActivity.addEvent({ ...values, programStage: 'eXOOIxW2cAZ', organisationUnits: [store.currentRow.event.orgUnit], trackedEntityInstance: store.currentRow.event.trackedEntityInstance });
        await store.currentRow.fetchEvents()
        store.hideActionDialog()
    }

    const { getFieldDecorator } = form;

    const normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const dummyRequest = async ({ file, onSuccess }) => {
        const api = store.d2.Api.getApi();
        var data = new FormData()
        data.append('file', file)
        const { response: { fileResource: { id } } } = await api.post('fileResources', data);
        form.setFieldsValue({
            'yxGmEyvPfwl': id,
        });
        onSuccess("ok");
    };
    return (
        <div>
            <Header style={{ background: '#fff', paddingRight: 15, paddingLeft: 5, display: 'flex' }}>
                <div style={{ width: 50 }}>
                    <Icon
                        className="trigger"
                        type={store.settings.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={store.settings.toggle}
                        style={{ fontSize: 24 }}
                    />
                </div>
                <div style={{ width: 300 }}>
                    <Link router={store.router} view={views.plannedActivity}><Icon type="plus-square" style={{ fontSize: 24 }} /></Link>
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Row gutter={[8, 8]}>
                    <Col span={12}>
                        <Card title="Report Details">
                            <Form {...layouts.formItemLayout} onSubmit={handleSubmit}>
                                {store.report.form.map(s => {
                                    if (store.currentRow.previousReport[s.key]) {
                                        return displayField(s, getFieldDecorator, { initialValue: store.currentRow.previousReport[s.key] })
                                    }
                                    return displayField(s, getFieldDecorator, {})
                                })}
                                <Form.Item label="Upload" key="upload">
                                    {getFieldDecorator('upload', {
                                        valuePropName: 'fileList',
                                        rules: [{ required: true, message: `Please upload report` }],
                                        getValueFromEvent: normFile,
                                    })(
                                        <Upload.Dragger name="files" customRequest={dummyRequest} multiple={false}>
                                            <p className="ant-upload-drag-icon">
                                                <Icon type="inbox" />
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                            <p className="ant-upload-hint">Support for a single upload.</p>
                                        </Upload.Dragger>)}
                                </Form.Item>
                                <Form.Item {...layouts.tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit" size="large" disabled={store.currentRow.disableSubmit}>Submit Report</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                        &nbsp;
                        <Card title="Report Comments">
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card title="Issues Arising" extra={<Button onClick={store.showIssueDialog} size="large">Add Identified Issue</Button>}>
                            <Table
                                style={{ padding: 0 }}
                                columns={store.issue.columns}
                                dataSource={store.currentRow.issues}
                                rowKey="event"
                                pagination={false}
                                expandedRowKeys={expandedRowKeys}
                                onExpand={onExpand}
                                expandedRowRender={record => {
                                    return <Card>
                                        <Descriptions title="Issue Details" size="small">
                                            {store.issue.form.map((item, i) => <Descriptions.Item key={i} label={item.title}>{record[item.key]}</Descriptions.Item>)}
                                        </Descriptions>
                                    </Card>
                                }}
                            />
                        </Card>
                        &nbsp;
                        <Card title="Actions Taken" extra={<Button disabled={store.currentRow.issues.length === 0} onClick={store.showActionDialog} size="large">Add Action</Button>}>
                            <Table
                                style={{ padding: 0 }}
                                columns={store.action.columns}
                                dataSource={store.currentRow.actions}
                                rowKey="event"
                                pagination={false}
                                expandedRowKeys={expandedRowKeys}
                                onExpand={onExpand}
                                expandedRowRender={record => {
                                    return <Card>
                                        <Descriptions title="Action Details" size="small">
                                            {store.action.form.map((item, i) => <Descriptions.Item key={i} label={item.title}>{record[item.key]}</Descriptions.Item>)}
                                        </Descriptions>
                                    </Card>
                                }}
                            />
                        </Card>
                        <DrawerForm visible={store.issueDialogOpen} formColumns={store.issue.form} onSubmit={onSubmit} onClose={store.hideIssueDialog} />
                        <DrawerForm visible={store.actionDialogOpen} formColumns={store.action.form} onSubmit={onActionSubmit} onClose={store.hideActionDialog} />
                    </Col>
                </Row>
            </Content>
        </div>
    );
};

export const ActivityDetails = Form.create({ name: 'register' })(inject("store")(observer(BForm)));
