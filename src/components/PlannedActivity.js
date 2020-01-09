import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import { Card, Layout, Icon, Table, Input } from 'antd';
import { Link } from '../modules/router';
import views from '../config/views';

const { Header, Content } = Layout;
const { Search } = Input;

export const PlannedActivity = inject("store")(observer(({ store }) => {

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const onExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.columnAttributes.XdmZ9lk11i4]);
        } else {
            setExpandedRowKeys([])
        }
    }
    const columns = [{
        key: 'orgUnitName',
        title: 'Site',
        index: 'orgUnitName',
        render: (record) => {
            return <div>{record.orgUnitName}</div>
        }
    }, {
        key: 'eN9jthkmMds',
        title: 'Activity Planned Start Date',
        index: 'eN9jthkmMds',
        render: (record) => {
            return <div>{record.eN9jthkmMds}</div>
        }
    }, {
        key: 'pyQEzpRRcqH',
        title: 'Activity Planned End Date',
        index: 'pyQEzpRRcqH',
        render: (record) => {
            return <div>{record.pyQEzpRRcqH}</div>
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
                    <Link router={store.router} view={views.plannedActivityForm}><Icon type="plus-square" style={{ fontSize: 24 }} /></Link>
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
                <Card title="Planned Activities">
                    <Table
                        style={{ padding: 0 }}
                        columns={store.plannedActivity.columns}
                        dataSource={store.plannedActivity.activities}
                        rowKey={(record) => record.columnAttributes.XdmZ9lk11i4}
                        onChange={store.plannedActivity.handleChange}
                        expandedRowKeys={expandedRowKeys}
                        onExpand={onExpand}
                        size="middle"
                        expandedRowRender={record => {
                            return <Card>
                                <Table
                                    style={{ padding: 0 }}
                                    columns={columns}
                                    dataSource={record.allInstances}
                                    rowKey="trackedEntityInstance"
                                    pagination={false}
                                />
                            </Card>
                        }}
                        pagination={{
                            showSizeChanger: true,
                            total: store.plannedActivity.total,
                            pageSize: store.plannedActivity.pageSize,
                            pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                        }}
                    />
                </Card>
            </Content>
        </div>);
}));