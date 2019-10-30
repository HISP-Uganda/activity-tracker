import React from 'react';
import { inject, observer } from "mobx-react";
import { Layout, Icon, Table, Card } from 'antd';
import { Link } from '../modules/router'

import views from '../config/views'

const { Header, Content } = Layout;

export const ResultArea = inject("store")(observer(({ store }) => {
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
                    <Link router={store.router} view={views.resultAreaForm}>Create</Link>
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Card>
                    <Table
                        style={{ padding: 0 }}
                        columns={store.resultAreaStore.columns}
                        dataSource={store.resultAreaStore.data}
                        rowKey="event"
                    // loading={store.activityStore.loading}
                    // onChange={store.activityStore.handleChange}
                    // pagination={{
                    //     showSizeChanger: true,
                    //     total: store.activityStore.total,
                    //     onChange: store.activityStore.onChange,
                    //     onShowSizeChange: store.activityStore.onShowSizeChange,
                    //     pageSize: store.activityStore.pageSize,
                    //     pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                    // }}
                    />
                </Card>
            </Content>
        </div>
    );
}));