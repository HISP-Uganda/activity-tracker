import React, { useEffect, useState } from 'react';
import { inject, observer } from "mobx-react";
// import Table from '@dhis2/d2-ui-table';
import '@dhis2/d2-ui-core/css/Table.css';
import { Table, Card, Button } from "antd";


export const Issue = inject("store")(observer(({ store }) => {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [modalVisible, setModalVisible] = useState();

    useEffect(() => {
        store.issueStore.fetchAttributes();
        store.issueStore.fetchTrackedEntityInstances();
    }, []);

    const onExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.trackedEntityInstance]);
        } else {
            setExpandedRowKeys([])
        }
    }
    const showActionModal = () => {
        setModalVisible(true)
    };
    return (
        <Card>
            <Table
                style={{ padding: 0 }}
                columns={store.issueStore.columns}
                dataSource={store.issueStore.data}
                rowKey="trackedEntityInstance"
                loading={store.issueStore.loading}
                onChange={store.issueStore.handleChange}
                rowClassName={(record) => record.color}
                expandedRowKeys={expandedRowKeys}
                onExpand={onExpand}
                expandIconAsCell={false}
                pagination={{
                    showSizeChanger: true,
                    total: store.issueStore.total,
                    // onChange: store.issueStore.onChange,
                    // onShowSizeChange: store.issueStore.onShowSizeChange,
                    pageSize: store.issueStore.pageSize,
                    pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                }}
                expandedRowRender={record => <Card title="Issue Actions" extra={<Button onClick={showActionModal} size="large">Add Action</Button>} style={{ marginTop: 16 }}>
                    <Table
                        rowKey="event"
                        columns={store.issueStore.dataElementColumns}
                        dataSource={record.events}
                        pagination={false}
                    />
                </Card>
                }
            />
        </Card>
    );
}));