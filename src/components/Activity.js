import React from 'react';
import { inject, observer } from "mobx-react";
import { Card, Layout, Icon, Table, Input } from 'antd';
const { Header, Content } = Layout;

const { Search } = Input;


export const Activity = inject("store")(observer(({ store }) => {
    return (
        <div>
            <Header style={{ background: '#fff', padding: 0, paddingRight: 5, paddingLeft: 5, display: 'flex' }}>
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
                <Card title="Activities">
                    <Table
                        style={{ padding: 0 }}
                        columns={store.activity.columns}
                        dataSource={store.activity.rows}
                        rowKey={(record) => record.data[0]}
                        onChange={store.activity.handleChange}
                        size="small"
                        pagination={{
                            showSizeChanger: true,
                            total: store.activity.total,
                            pageSize: store.activity.pageSize,
                            pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                        }}
                    />
                </Card>
            </Content>
        </div>
    );
}));