import React, { useEffect } from 'react';
import { inject, observer } from "mobx-react";
import { Table, Card } from 'antd';

export const Output = inject("store")(observer(({ store }) => {
    useEffect(() => {
        async function pull() {
            await store.outputStore.fetchProgramStages();
            await store.outputStore.fetchEvents();
            store.setUrl('/output-form')
        }
        pull()
    }, []);
    return (
        <Card>
            <Table
                style={{ padding: 0 }}
                columns={store.outputStore.columns}
                dataSource={store.outputStore.data}
                rowKey="event"
                // loading={store.outputStore.loading}
                onChange={store.outputStore.handleChange}
                pagination={{
                    showSizeChanger: true,
                    total: store.outputStore.total,
                    // onChange: store.outputStore.onChange,
                    // onShowSizeChange: store.outputStore.onShowSizeChange,
                    pageSize: store.outputStore.pageSize,
                    pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                }}
            />
        </Card>
    );
}));