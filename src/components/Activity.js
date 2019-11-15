import React, { useEffect, useState } from 'react';
import { inject, observer } from "mobx-react";
import { Table, Card, Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const Activity = inject("store")(observer(({ store }) => {
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const onExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.event]);
        } else {
            setExpandedRowKeys([])
        }
    }

    useEffect(() => {
        async function pull() {
            await store.activityStore.fetchProgramStages();
            await store.activityStore.fetchEvents();
            store.setUrl('/activity-form')
        }
        pull()
    }, []);

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
            </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    const handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    return (
        <Card title="Planned Activities" extra={<a href="#">More</a>}>
            <Table
                style={{ padding: 0 }}
                columns={store.activityStore.columns}
                dataSource={store.activityStore.data}
                rowKey="event"
                // loading={store.activityStore.loading}
                // expandedRowKeys={expandedRowKeys}
                // onExpand={onExpand}
                // expandIconAsCell={false}
                // rowClassName={(record) => record.currentEvent.currentStatus.cls}
                onChange={store.activityStore.handleChange}
                // expandedRowRender={record => <ReactQuill
                //     value={record['lX4Ae98tFFl'] || ''}
                //     theme={'snow'}
                //     readOnly={true}
                // />
                // }
                pagination={{
                    showSizeChanger: true,
                    total: store.activityStore.total,
                    // onChange: store.activityStore.onChange,
                    // onShowSizeChange: store.activityStore.onShowSizeChange,
                    pageSize: store.activityStore.pageSize,
                    pageSizeOptions: ['5', '10', '15', '20', '25', '50', '100']
                }}
            />
        </Card>
    );
}));