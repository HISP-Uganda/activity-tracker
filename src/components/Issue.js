import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import { Card, Layout, Icon, Table, Input } from 'antd';
import { keys, range, intersection, fromPairs, mapValues } from 'lodash';
import shortid from 'shortid'
import { DrawerForm } from './forms/DrawerForm';
import moment from 'moment'
const { Header, Content } = Layout;
const { Search } = Input;

export const Issue = inject("store")(observer(({ store }) => {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const onExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.event]);
        } else {
            setExpandedRowKeys([])
        }
    }
    const onActionSubmit = async (values) => {
        values = mapValues(values, (o) => {
            if (o instanceof moment) {
                return o.format('YYYY-MM-DD')
            }
            return o
        });
        await store.currentActivity.updateEvent(values);
        await store.issue.fetchRawEvents();
        store.hideActionDialog()
    }

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
                <div style={{ marginLeft: 'auto' }}>
                    <Search
                        size="large"
                        placeholder="input search text"
                        onSearch={store.plannedActivity.setSearch}
                        style={{ width: 600 }}
                    />
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Card title="Issues & Actions">
                    <Table
                        style={{ padding: 0 }}
                        columns={store.issue.issueColumns}
                        dataSource={store.issue.events}
                        rowKey="event"
                        onChange={store.issue.handleChangeRawEvents}
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
                        pagination={{
                            showSizeChanger: true,
                            total: store.issue.total,
                            pageSize: store.issue.pageSize,
                            pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                        }}
                    />
                    <DrawerForm title="New Action" visible={store.actionDialogOpen} formColumns={store.issue.actionForm} onSubmit={onActionSubmit} onClose={store.hideActionDialog} hideLocation={true} />
                </Card>
            </Content>
        </div>);
}));