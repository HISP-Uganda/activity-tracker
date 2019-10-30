import React from 'react';
import { inject, observer } from "mobx-react";
// import Table from '@dhis2/d2-ui-table';
import '@dhis2/d2-ui-core/css/Table.css';
import { Table, Card, Layout, Icon } from "antd";
import { Link } from '../modules/router'

import views from '../config/views'

const { Header, Content } = Layout;

export const Issue = inject("store")(observer(({ store }) => {
    return (
        <div>
            <Header style={{ background: '#fff', padding: 0, paddingRight: 5, paddingLeft: 5, display: 'flex' }}>
                <div style={{ width: 50 }}>
                    <Icon
                        className="trigger"
                        type={store.settings.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={store.settings.toggle}
                        style={{ fontSize: 20 }}
                    />
                </div>
                <div>
                    <Link router={store.router} view={views.objectiveForm}>Create</Link>
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Card>
                    <Table
                        style={{ padding: 0 }}
                        columns={store.issueStore.columns}
                        dataSource={store.issueStore.data}
                        rowKey="instance"
                        loading={store.issueStore.loading}
                        onChange={store.issueStore.handleChange}
                        pagination={{
                            showSizeChanger: true,
                            total: store.issueStore.total,
                            // onChange: store.issueStore.onChange,
                            // onShowSizeChange: store.issueStore.onShowSizeChange,
                            pageSize: store.issueStore.pageSize,
                            pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                        }}
                    />
                </Card>
            </Content>
        </div>
    );
}));