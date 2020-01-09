import React from 'react';
import { inject, observer } from "mobx-react";
import moment from 'moment';
import { Card, Layout, Icon, Table, DatePicker, Select, Menu, Dropdown, Button, Input } from 'antd';
import * as  XLSX from 'xlsx';
const { Header, Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;


export const Home = inject("store")(observer(({ store }) => {
    const columns = [{
        key: 'Activity',
        title: 'Activities Planned',
        index: 'Activity',
        render: (record) => {
            return <div>{record['Activity']}</div>
        }
    }, {
        key: 'Expected output',
        title: 'Expected Output (target)',
        index: 'Expected output',
        render: (record) => {
            return <div>{record['Expected output']}</div>
        }
    }, {
        key: 'Activity Status ',
        title: 'Activities Implemented, indicate:',
        index: 'Activity Status ',
        render: (record) => {
            return {
                props: {
                    className: String(record['Activity Status ']).split(' ').join(''),
                },
                children: <div>{record['Activity Status ']}</div>,
            };
        }
    }, {
        key: 'rCsc2qFs8Ar ',
        title: 'Major Results Achieved',
        index: 'rCsc2qFs8Ar',
        render: (record) => {
            return <div>{record['rCsc2qFs8Ar']}</div>
        }
    }
    , {
        key: 'bzClpRHuBGs ',
        title: 'Comments on results achieved versus targets',
        index: 'bzClpRHuBGs',
        render: (record) => {
            return <div>{record['bzClpRHuBGs']}</div>
        }
    }, {
        key: 'Activity Implementor',
        title: 'Activity Implementor',
        index: 'Activity Implementor',
        render: (record) => {
            return <div>{record['Activity Implementor']}</div>
        }
    }, {
        key: 'XGGgKwzx0op ',
        title: 'Responsible Person',
        index: 'XGGgKwzx0op',
        render: (record) => {
            return <div>{record['XGGgKwzx0op']}</div>
        }
    }
];

    const onChange = async (date, dateString) => {
        store.setDates(dateString);
        await store.fetchInstances();
    }

    const handleChange = async (value) => {
        await store.searchInstances('fXVrCt5zPf7', value);
    }

    const search = async (search) => {
        await store.queryInstances(search)
    };

    const download = () => {
        const wb = XLSX.utils.table_to_book(document.getElementById('activities'), { sheet: "Activities" });
        XLSX.writeFile(wb, 'activities.xlsx');
    }

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={download}>
                Download
            </Menu.Item>
        </Menu>
    );
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
                    Search by Date &nbsp;&nbsp;
                    <RangePicker size="large" onChange={onChange} defaultValue={[moment(store.startDate), moment(store.endDate)]} />
                    &nbsp;&nbsp; Search by Project &nbsp;&nbsp;
                    <Select size="large" style={{ width: 400 }} onChange={handleChange}>
                        <Option value="Accelerating Epidemic Control in Fort Portal Region in the Republic of Uganda under the Presidents Emergency Plan for AIDS Relief(PEPFAR)">
                            Accelerating Epidemic Control in Fort Portal Region in the Republic of Uganda under the Presidents Emergency Plan for AIDS Relief(PEPFAR)
                        </Option>
                        <Option value="TASO-Baylor Uganda Global Fund Project">
                            TASO-Baylor Uganda Global Fund Project
                        </Option>
                        <Option value="Strengthening technical and management capacity for RMNCAH/HIV/AIDS/TB and Nutrition services in 13 districts in Eastern Central Midwestern and South western Uganda">
                            Strengthening technical and management capacity for RMNCAH/HIV/AIDS/TB and Nutrition services in 13 districts in Eastern Central Midwestern and South western Uganda
                        </Option>
                    </Select>&nbsp;&nbsp;
                    Search by Other Fields &nbsp;&nbsp;
                    <Search
                        size="large"
                        placeholder="input search text"
                        onSearch={search}
                        style={{ width: 400 }}
                    />
                </div>
            </Header>
            <Content style={{ overflow: 'auto', padding: 10 }}>
                <Card extra={<div>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button type="link">
                            <Icon type="down" />
                        </Button>
                    </Dropdown>&nbsp;&nbsp;

                </div>}>
                    <Table
                        id="activities"
                        key="activities"
                        style={{ padding: 0 }}
                        columns={columns}
                        dataSource={store.data}
                        rowKey="trackedEntityInstance"
                        pagination={false}
                    />
                </Card>
            </Content>
        </div>
    );
}));