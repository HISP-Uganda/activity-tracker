import React, { Component } from 'react';

import { inject, observer } from "mobx-react";
import { Layout, Menu, Icon } from 'antd';
import HeaderBar from '@dhis2/d2-ui-header-bar';
import views from "./config/views";
import D2UIApp from "@dhis2/d2-ui-app";
import * as PropTypes from 'prop-types';
import { createMuiTheme } from "@material-ui/core";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import './App.css'
import { Link, StateRouter } from "./modules/router";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            main: '#2C6693'
        }
    }
});

const { Sider } = Layout;

const { SubMenu } = Menu;

class App extends Component {
    getChildContext() {
        return { d2: this.props.d2 };
    }

    render() {
        const { store, d2 } = this.props;
        return (<D2UIApp>
            <MuiThemeProvider theme={theme}>
                <HeaderBar d2={d2} />
                <div style={{ height: 48 }} />
                <Layout style={{ height: '95vh' }}>
                    <Sider trigger={null} collapsible collapsed={store.settings.collapsed} width={256} theme="light">
                        <Menu theme="light" selectedKeys={store.currentLocations} mode="inline">
                            <Menu.Item key="10">
                                <Link router={store.router} view={views.home}>
                                    <Icon type="dashboard" />
                                    <span>Dashboard</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="1">
                                <Link router={store.router} view={views.plannedActivity}>
                                    <Icon type="schedule" />
                                    <span>Planned Activities</span>
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="11">
                                <Link router={store.router} view={views.issues}>
                                    <Icon type="ordered-list" />
                                    <span>Issues and Actions</span>
                                </Link>
                            </Menu.Item>
                            <SubMenu
                                key="sub1"
                                title={
                                    <span><Icon type="user" />Settings </span>
                                }
                            >
                                <Menu.Item key="9">
                                    <Link router={store.router} view={views.activity}>
                                        <Icon type="calculator" />
                                        <span>Activities</span>
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <StateRouter router={store.router} />
                    </Layout>
                </Layout>
            </MuiThemeProvider>
        </D2UIApp>
        );
    }
}

App.childContextTypes = {
    d2: PropTypes.object,
};

App.propTypes = {
    d2: PropTypes.object.isRequired,
};
export default inject("store")(observer(App));