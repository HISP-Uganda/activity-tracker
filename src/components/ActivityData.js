import React, { useEffect } from 'react';
import { inject, observer } from "mobx-react";
import { Table, Card } from 'antd';

export const ActivityData = inject("store")(observer(({ store }) => {
    useEffect(() => {
        async function pull() {
            await store.activityDataStore.fetchProgramStages();
            await store.activityDataStore.fetchEvents();
            store.setUrl('/activity-data-form')
        }
        pull()
    }, []);
    return (
        <Card>
            <Table
                style={{ padding: 0 }}
                columns={store.activityDataStore.columns}
                dataSource={store.activityDataStore.data}
                rowKey="event"
                // loading={store.activityDataStore.loading}
                onChange={store.activityDataStore.handleChange}
                pagination={{
                    showSizeChanger: true,
                    total: store.activityDataStore.total,
                    // onChange: store.activityDataStore.onChange,
                    // onShowSizeChange: store.activityDataStore.onShowSizeChange,
                    pageSize: store.activityDataStore.pageSize,
                    pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                }}
            />
        </Card>
    );
}));