import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { Layout, Menu, Icon } from 'antd';
import HeaderBar from '@dhis2/d2-ui-header-bar';
import D2UIApp from "@dhis2/d2-ui-app";
import * as PropTypes from 'prop-types';
import { createMuiTheme } from "@material-ui/core";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';


import { ReportDetails } from './components/ActivityDetails';

import * as Components from './components'
import './App.css';

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
        return (
            <Router>
                <D2UIApp>
                    <MuiThemeProvider theme={theme}>
                        <HeaderBar d2={d2} />
                        <div style={{ height: 48 }} />
                        <Layout style={{ height: '95vh' }}>
                            <Sider trigger={null} collapsible collapsed={store.settings.collapsed} width={256} theme="light">
                                <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
                                    <Menu.Item key="10">
                                        <Link to="/">
                                            <Icon type="ordered-list" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="1">
                                        <Link to="/activities">
                                            <Icon type="ordered-list" />
                                            <span>Planned Activities</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="2">
                                        <Link to="/issues">
                                            <Icon type="calculator" />
                                            <span>Activity Issues</span>
                                        </Link>
                                    </Menu.Item>

                                    <Menu.Item key="3">
                                        <Link to="/actions">
                                            <Icon type="schedule" />
                                            <span>Issue Actions</span>
                                        </Link>
                                    </Menu.Item>

                                    {/* <Menu.Item key="4">
                                        <Link to="/reports">
                                            <Icon type="schedule" />
                                            <span>Activity Reports</span>
                                        </Link>
                                    </Menu.Item> */}

                                    <Menu.Divider />
                                    <Menu.Item key="5">
                                        <Link to="/projects">
                                            <Icon type="calculator" />
                                            <span>Projects</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="6">
                                        <Link to="/objectives">
                                            <Icon type="calculator" />
                                            <span>Objectives</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="7">
                                        <Link to="/result-areas">
                                            <Icon type="calculator" />
                                            <span>Result Areas</span>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="8">
                                        <Link to="/outputs">
                                            <Icon type="calculator" />
                                            <span>Output</span>
                                        </Link>
                                    </Menu.Item>

                                    <Menu.Item key="9">
                                        <Link to="/activity-data">
                                            <Icon type="calculator" />
                                            <span>Activities</span>
                                        </Link>
                                    </Menu.Item>

                                </Menu>
                            </Sider>
                            <Layout>
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
                                        <Link to={store.url}>Create</Link>
                                    </div>
                                </Header>
                                <Content style={{ overflow: 'auto', padding: 10 }}>
                                    <Switch>
                                        <Route path="/activities">
                                            <Components.Activity />
                                        </Route>
                                        <Route path="/events/details/:event">
                                            <ReportDetails />
                                        </Route>
                                        <Route path="/activity-form">
                                            <Components.ActivityForm />
                                        </Route>
                                        <Route path="/issues">
                                            <Components.Issue />
                                        </Route>
                                        <Route path="/actions">
                                            <Components.Action />
                                        </Route>
                                        <Route path="/reports">
                                            <Components.Report />
                                        </Route>
                                        <Route path="/outputs">
                                            <Components.Output />
                                        </Route>
                                        <Route path="/objectives">
                                            <Components.Objective />
                                        </Route>
                                        <Route path="/projects">
                                            <Components.Project />
                                        </Route>
                                        <Route path="/result-areas">
                                            <Components.ResultArea />
                                        </Route>
                                        <Route path="/activity-data">
                                            <Components.ActivityData />
                                        </Route>

                                        <Route path="/output-form">
                                            <Components.OutputForm />
                                        </Route>
                                        <Route path="/objective-form">
                                            <Components.ObjectiveForm />
                                        </Route>

                                        <Route path="/project-form">
                                            <Components.ProjectForm />
                                        </Route>

                                        <Route path="/result-area-form">
                                            <Components.ResultAreaForm />
                                        </Route>
                                        <Route path="/activity-data-form">
                                            <Components.ActivityDataForm />
                                        </Route>

                                        <Route path="/">
                                            <Components.Home />
                                        </Route>
                                    </Switch>
                                </Content>
                            </Layout>
                        </Layout>
                    </MuiThemeProvider>
                </D2UIApp>
            </Router>
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
