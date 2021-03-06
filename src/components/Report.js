import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import { Card, Layout, Icon, Table, Descriptions } from 'antd';

const { Header, Content } = Layout;

export const Report = inject("store")(observer(({ store }) => {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const onExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.data[0]]);
        } else {
            setExpandedRowKeys([])
        }
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
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Card title="Activity Reports">
                    <Table
                        style={{ padding: 0 }}
                        columns={store.report.columns}
                        dataSource={store.report.rows}
                        rowKey={(record) => record.data[0]}
                        onChange={store.report.handleChange}
                        expandedRowKeys={expandedRowKeys}
                        onExpand={onExpand}
                        expandedRowRender={record => {
                            return <Card>
                                <Descriptions title="Report Details" size="small">
                                    {record.data.map((item, i) => <Descriptions.Item key={i} label={store.report.headers[i].column}>{item}</Descriptions.Item>)}
                                </Descriptions>
                            </Card>
                        }}
                        pagination={{
                            showSizeChanger: true,
                            total: store.report.total,
                            pageSize: store.report.pageSize,
                            pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                        }}
                    />
                </Card>
            </Content>
        </div>);
}));