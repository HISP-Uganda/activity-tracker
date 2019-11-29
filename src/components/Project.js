import React from 'react';
import { inject, observer } from "mobx-react";
import { Card, Layout, Icon, Table } from 'antd';
import { Link } from '../modules/router';
import views from '../config/views';
const { Header, Content } = Layout;

export const Project = inject("store")(observer(({ store }) => {
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
                    <Link router={store.router} view={views.projectsForm}>Create</Link>
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Card title="Projects">
                    <Table
                        style={{ padding: 0 }}
                        columns={store.project.firstProgramStage ? store.project.firstProgramStage.columns : []}
                        dataSource={store.project.firstProgramStage ? store.project.firstProgramStage.rows : []}
                        rowKey={(record) => record.data[0]}
                        onChange={store.project.firstProgramStage ? store.project.firstProgramStage.handleChange : null}
                        pagination={{
                            showSizeChanger: true,
                            total: store.project.firstProgramStage ? store.project.firstProgramStage.total : 0,
                            pageSize: store.project.firstProgramStage ? store.project.firstProgramStage.pageSize : 5,
                            pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                        }}
                    />
                </Card>
            </Content>
        </div>
    );
}));