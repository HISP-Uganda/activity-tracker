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
    notification
} from 'antd';
import { Link } from '../modules/router';
import views from '../config/views';
import { DisplayField } from './forms/forms';
import * as layouts from './forms/utils';
import { DrawerForm } from './forms/DrawerForm';
import _, { keys, range, intersection, fromPairs } from 'lodash';
import shortid from 'shortid';
import moment from 'moment'


const { Header, Content } = Layout;
const BForm = ({ store, form }) => {

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const issueForm = store.issue.form.filter(s => { return !/\d/.test(String(s.title)) });

    const onExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.event]);
        } else {
            setExpandedRowKeys([])
        }
    }

    const extractActions = (issue) => {
        let found = [];
        const issueKeys = keys(issue);
        range(1, 11).forEach(i => {
            const searchColumns = store.issue.form.filter(s => { return String(s.title).endsWith(i) });
            const columnsKeys = searchColumns.map(c => c.key)
            const both = intersection(issueKeys, columnsKeys)

            if (both.length > 0) {
                const action = searchColumns.map(column => {
                    return [String(column.title).replace(/\d+/g, ''), issue[column.key]];
                });
                found = [...found, { ...issue, ...fromPairs(action), uid: shortid.generate() }];
            }

        });
        return found;
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
                await store.currentActivity.addEvent({ ...rest, programStage: 'gCp6ffVmx0g' });
                await store.currentActivity.updateActivityStatus('Report Submitted');
                await store.currentActivity.fetchTrackedInstances();
                notification.open({
                    message: 'Report Submitted',
                    description: 'Report has been successfully submitted',
                    onClick: () => {
                        console.log('Notification Clicked!');
                    },
                    placement: 'bottomRight'
                });
            }
        });
    };

    const onSubmit = async (values) => {

        let { instance, ...rest } = values;

        const { orgUnit, trackedEntityInstance, program } = JSON.parse(instance);

        const whatToSubmit = { ...rest, programStage: 'qky1qGVPe7e', orgUnit, trackedEntityInstance, program };

        let final = _.pickBy(whatToSubmit, (value) => {
            return value !== null && value !== undefined;
        });

        final = _.mapValues(final, (o) => {
            if (o instanceof moment) {
                return o.format('YYYY-MM-DD')
            }
            return o
        });

        await store.currentActivity.addIssue(final);
        await store.currentActivity.fetchTrackedInstances();
        store.hideIssueDialog()
    }

    const onActionSubmit = async (values) => {
        values = _.mapValues(values, (o) => {
            if (o instanceof moment) {
                return o.format('YYYY-MM-DD')
            }
            return o
        });
        await store.currentActivity.updateEvent(values);
        await store.currentActivity.fetchTrackedInstances();
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

    const columns = [{
        key: 'Action',
        title: 'Action',
        dataIndex: 'Action'
    }, {
        key: 'Action Description',
        title: 'Action Description',
        dataIndex: 'Action Description'
    }, {
        key: 'Action Start Date',
        title: 'Action Start Date',
        dataIndex: 'Action Start Date'
    }, {
        key: 'Action End Date',
        title: 'Action End Date',
        dataIndex: 'Action End Date'
    }, {
        key: 'Action Taken by',
        title: 'Action Taken by',
        dataIndex: 'Action Taken by'
    }, {
        key: 'Current Issue Status',
        title: 'Current Issue Status',
        dataIndex: 'Current Issue Status',
        render: (text, row) => {
            return {
                props: {
                    className: text,
                },
                children: <div>{text}</div>,
            };
        }
    }]

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
                                    if (store.currentActivity.report[s.key]) {
                                        return <DisplayField field={s} key={s.key} getFieldDecorator={getFieldDecorator} initialValue={store.currentActivity.report[s.key]} />
                                    }
                                    return <DisplayField field={s} key={s.key} getFieldDecorator={getFieldDecorator} />
                                })}
                                <Form.Item label="Upload" key="upload">
                                    {getFieldDecorator('upload', {
                                        valuePropName: 'fileList',
                                        rules: [{ required: !store.currentActivity.report['yxGmEyvPfwl'], message: `Please upload report` }],
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
                                <Form.Item {...layouts.tailFormItemLayout} style={{display:'flex'}}>
                                    <Button type="primary" htmlType="submit" size="large" disabled={store.currentActivity.disableSubmit}>Submit Report</Button>&nbsp;&nbsp;
                                    {store.currentActivity.reportId !== ''?<Button type="primary" size="large" href={store.currentActivity.download}><Icon type="download" /> Download Report</Button>:null}
                                    
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card title="Issues Arising" extra={<Button onClick={store.showIssueDialog} size="large">Add Identified Issue</Button>}>
                            <Table
                                style={{ padding: 0 }}
                                columns={store.issue.columns}
                                dataSource={store.currentActivity.allIssues}
                                rowKey="event"
                                pagination={false}
                                expandedRowKeys={expandedRowKeys}
                                onExpand={onExpand}
                                expandedRowRender={record => {
                                    return <Card title="Actions">
                                        <Table
                                            rowKey="uid"
                                            columns={columns}
                                            dataSource={extractActions(record)}
                                            pagination={false}
                                        />
                                    </Card>
                                }}
                            />
                        </Card>
                        <DrawerForm title="New Issue" visible={store.issueDialogOpen} formColumns={issueForm} onSubmit={onSubmit} onClose={store.hideIssueDialog} hideLocation={false} />
                        <DrawerForm title="New Action" visible={store.actionDialogOpen} formColumns={store.issue.actionForm} onSubmit={onActionSubmit} onClose={store.hideActionDialog} hideLocation={true} />
                    </Col>
                </Row>
            </Content>
        </div>
    );
};

export const ActivityDetails = Form.create({ name: 'register' })(inject("store")(observer(BForm)));
