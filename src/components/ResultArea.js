import React from 'react';
import { inject, observer } from "mobx-react";
import { Card, Layout, Icon, Table } from 'antd';
import { Link } from '../modules/router';
import views from '../config/views';
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
                <Card title="Objectives">
                    <Table
                        style={{ padding: 0 }}
                        columns={store.resultArea.firstProgramStage ? store.resultArea.firstProgramStage.columns : []}
                        dataSource={store.resultArea.firstProgramStage ? store.resultArea.firstProgramStage.rows : []}
                        rowKey={(record) => record.data[0]}
                        onChange={store.resultArea.firstProgramStage ? store.resultArea.firstProgramStage.handleChange : null}
                        pagination={{
                            showSizeChanger: true,
                            total: store.resultArea.firstProgramStage ? store.resultArea.firstProgramStage.total : 0,
                            pageSize: store.resultArea.firstProgramStage ? store.project.firstProgramStage.pageSize : 5,
                            pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                        }}
                    />
                </Card>
            </Content>
        </div>
    );
}));