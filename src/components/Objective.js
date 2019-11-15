import React, { useEffect } from 'react';
import { inject, observer } from "mobx-react";
import { Table, Card } from 'antd';

export const Objective = inject("store")(observer(({ store }) => {
    useEffect(() => {
        async function pull() {
            await store.objectiveStore.fetchProgramStages();
            await store.objectiveStore.fetchEvents();
            store.setUrl('/objective-form')
        }
        pull()
    }, []);
    return (
        <Card>
            <Table
                style={{ padding: 0 }}
                columns={store.objectiveStore.columns}
                dataSource={store.objectiveStore.data}
                rowKey="event"
                // loading={store.objectiveStore.loading}
                onChange={store.objectiveStore.handleChange}
                pagination={{
                    showSizeChanger: true,
                    total: store.objectiveStore.total,
                    // onChange: store.objectiveStore.onChange,
                    // onShowSizeChange: store.objectiveStore.onShowSizeChange,
                    pageSize: store.objectiveStore.pageSize,
                    pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                }}
            />
        </Card>
    );
}));