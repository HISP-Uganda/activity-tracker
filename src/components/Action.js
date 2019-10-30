import React from 'react';
import { inject, observer } from "mobx-react";
import { Layout, Icon } from 'antd';
const { Header, Content } = Layout;


export const Action = inject("store")(observer(({ store }) => {
    return (
        <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
                <Icon
                    className="trigger"
                    type={store.settings.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={store.settings.toggle}
                    style={{ paddingLeft: 10, fontSize: 20 }}
                />
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                Actions
            </Content>
        </Layout>
    );
}));