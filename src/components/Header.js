import React from 'react';
import { inject, observer } from "mobx-react";
import { Layout, Icon } from "antd";
import { Link } from '../modules/router'

import views from '../config/views'

const { Header } = Layout;

export const HeaderBar = inject("store")(observer(({ store }) => {
    return (
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
    );
}));