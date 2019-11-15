import React, { useEffect } from 'react';
import { inject, observer } from "mobx-react";
import { Table, Card } from 'antd';

export const Action = inject("store")(observer(({ store }) => {
    useEffect(() => {
        async function pull() {
            await store.actionStore.fetchProgramStages();
            await store.actionStore.fetchEvents();
            store.setUrl('/activity-form')
        }
        pull()
    }, []);
    return (
        <Card>
            <Table
                style={{ padding: 0 }}
                columns={store.actionStore.columns}
                dataSource={store.actionStore.data}
                rowKey="event"
                // loading={store.actionStore.loading}
                onChange={store.actionStore.handleChange}
                pagination={{
                    showSizeChanger: true,
                    total: store.actionStore.total,
                    // onChange: store.actionStore.onChange,
                    // onShowSizeChange: store.actionStore.onShowSizeChange,
                    pageSize: store.actionStore.pageSize,
                    pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                }}
            />
        </Card>
    );
}));