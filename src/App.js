import React, { Component } from 'react';

import { inject, observer } from "mobx-react";
import { Layout, Menu, Icon, Divider } from 'antd';
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

const { Header, Content, Sider } = Layout;

// const { SubMenu } = Menu;


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
                        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="10">
                                <Link router={store.router} view={views.home} store={store}>
                                    <Icon type="ordered-list" />
                                    <span>Dashboard</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="1">
                                <Link router={store.router} view={views.activities} store={store}>
                                    <Icon type="ordered-list" />
                                    <span>Planned Activities</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link router={store.router} view={views.issues} store={store}>
                                    <Icon type="calculator" />
                                    <span>Activity Issues</span>
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="3">
                                <Link router={store.router} view={views.actions} store={store}>
                                    <Icon type="schedule" />
                                    <span>Issue Actions</span>
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="4">
                                <Link router={store.router} view={views.reports} store={store}>
                                    <Icon type="schedule" />
                                    <span>Activity Reports</span>
                                </Link>
                            </Menu.Item>

                            <Menu.Divider />

                            {/* <Divider style={{ margin: 5 }} /> */}

                            <Menu.Item key="5">
                                <Link router={store.router} view={views.projects} store={store}>
                                    <Icon type="calculator" />
                                    <span>Projects</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <Link router={store.router} view={views.objectives} store={store}>
                                    <Icon type="calculator" />
                                    <span>Objectives</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="7">
                                <Link router={store.router} view={views.resultAreas} store={store}>
                                    <Icon type="calculator" />
                                    <span>Result Areas</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="8">
                                <Link router={store.router} view={views.outputs} store={store}>
                                    <Icon type="calculator" />
                                    <span>Output</span>
                                </Link>
                            </Menu.Item>

                            <Menu.Item key="9">
                                <Link router={store.router} view={views.activityData} store={store}>
                                    <Icon type="calculator" />
                                    <span>Activities</span>
                                </Link>
                            </Menu.Item>

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
