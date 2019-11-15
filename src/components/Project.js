import React, { useEffect } from 'react';
import { inject, observer } from "mobx-react";
import { Table, Card } from 'antd';

export const Project = inject("store")(observer(({ store }) => {
    useEffect(() => {
        async function pull() {
            await store.projectStore.fetchProgramStages();
            await store.projectStore.fetchEvents();
            store.setUrl('/project-form')
        }
        pull()
    }, []);
    return (
        <Card title="Projects">
            <Table
                style={{ padding: 0 }}
                columns={store.projectStore.columns}
                dataSource={store.projectStore.data}
                rowKey="event"
                // loading={store.projectStore.loading}
                onChange={store.projectStore.handleChange}
                pagination={{
                    showSizeChanger: true,
                    total: store.projectStore.total,
                    // onChange: store.projectStore.onChange,
                    // onShowSizeChange: store.projectStore.onShowSizeChange,
                    pageSize: store.projectStore.pageSize,
                    pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                }}
            />
        </Card>
    );
}));