import React, { useEffect } from 'react';
import { inject, observer } from "mobx-react";
import { Table, Card } from 'antd';

export const ResultArea = inject("store")(observer(({ store }) => {
    useEffect(() => {
        async function pull() {
            await store.resultAreaStore.fetchProgramStages();
            await store.resultAreaStore.fetchEvents();
            store.setUrl('/result-area-form')
        }
        pull()
    }, []);
    return (
        <Card title="Result Areas">
            <Table
                style={{ padding: 0 }}
                columns={store.resultAreaStore.columns}
                dataSource={store.resultAreaStore.data}
                rowKey="event"
                // loading={store.resultAreaStore.loading}
                onChange={store.resultAreaStore.handleChange}
                pagination={{
                    showSizeChanger: true,
                    total: store.resultAreaStore.total,
                    // onChange: store.resultAreaStore.onChange,
                    // onShowSizeChange: store.resultAreaStore.onShowSizeChange,
                    pageSize: store.resultAreaStore.pageSize,
                    pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                }}
            />
        </Card>
    );
}));