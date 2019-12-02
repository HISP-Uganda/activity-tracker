import { types, flow, getRoot, getParent } from "mobx-state-tree";
import React from 'react';
import { unionBy, fromPairs, flatten, groupBy } from 'lodash';
import moment from 'moment';

import { Icon, Menu, Dropdown, Button } from 'antd';
import views from '../../config/views'

export const Attribute = types.model("Attribute", {
    attribute: types.string,
    value: ''
});

export const Option = types.model("Option", {
    name: types.string,
    code: types.string
});

export const OptionSet = types.model("OptionSet", {
    options: types.array(Option)
});

export const DataElement = types.model("DataElement", {
    id: types.string,
    name: types.string,
    optionSet: types.maybeNull(OptionSet),
    valueType: types.string
});


export const TrackedEntityAttribute = types
    .model("TrackedEntityAttributes", {
        id: types.identifier,
        name: types.string,
        unique: false,
        optionSet: types.maybeNull(OptionSet)
    });

export const ProgramTrackedEntityAttributes = types.model("ProgramTrackedEntityAttributes", {
    trackedEntityAttribute: TrackedEntityAttribute,
    valueType: types.string,
    mandatory: false
});


export const ProgramStageDataElement = types.model("ProgramStageDataElement", {
    id: types.string,
    compulsory: false,
    dataElement: DataElement
});

export const Header = types.model("Header", {
    name: types.string,
    column: types.string,
    type: types.string,
    hidden: types.boolean,
    meta: types.boolean,
});

export const Row = types.model('Row', {
    data: types.array(types.string),
    event: types.optional(types.frozen(), {})
}).views(self => ({
    get getAttributes() {
        const program = getParent(self, 2);
        const data = program.programTrackedEntityAttributes.map(a => {

            const deIndex = program.headers.findIndex((x) => {
                return x.name === a.trackedEntityAttribute.id
            });

            let value = null;

            if (deIndex !== -1) {
                value = self.data[deIndex];
            }
            return [a.trackedEntityAttribute.id, value];
        });

        let attributes = fromPairs(data);

        const ouIndex = program.headers.findIndex((x) => {
            return x.name === 'ou'
        });
        return { ...attributes, organisationUnits: [self.data[ouIndex]], trackedEntityInstance: self.data[0] }
    },

    get programStageData() {
        const enrollment = self.event.enrollments[0];
        return groupBy(enrollment.events, 'programStage');
    },

    get previousReport() {
        const events = self.programStageData['gCp6ffVmx0g']
        if (events) {
            const e = events[0].dataValues.map(e => [e.dataElement, e.value]);
            return fromPairs(e);
        }
        return {}
    },

    get issues() {
        const events = self.programStageData['qky1qGVPe7e'] || [];
        return events.map(({ dataValues, ...e }) => {
            const dv = dataValues.map(d => [d.dataElement, d.value]);
            return { ...e, ...fromPairs(dv) }
        })
    },

    get report() {
        const events = self.programStageData['gCp6ffVmx0g'] || [];
        const reports = events.map(({ dataValues, ...e }) => {
            const dv = dataValues.map(d => [d.dataElement, d.value]);
            return { ...e, ...fromPairs(dv) }
        });

        if (reports.length > 0) {
            return reports[0]
        }
        return {};
    },

    get currentIssueNumbers() {
        return self.issues.map(i => {
            return { code: i['fdlUSNSkcO5'], name: i['fdlUSNSkcO5'] };
        }).filter(i => !!i);
    },
    get actions() {
        const events = self.programStageData['eXOOIxW2cAZ'] || [];
        return events.map(({ dataValues, ...e }) => {
            const dv = dataValues.map(d => [d.dataElement, d.value]);
            return { ...e, ...fromPairs(dv) }
        })
    },

    get getData() {
        const store = getRoot(self);
        const data = store.plannedActivity.programTrackedEntityAttributes.map(a => {

            const deIndex = store.plannedActivity.headers.findIndex((x) => {
                return x.name === a.trackedEntityAttribute.id
            });

            let value = null;

            if (deIndex !== -1) {
                value = self.data[deIndex];
            }
            return [a.trackedEntityAttribute.id, value];
        });

        return fromPairs(data);
    },
    get activityStatusIndex() {
        const store = getRoot(self);
        return store.plannedActivity.headers.findIndex((x) => {
            return x.name === 'GeIEoCBrKaW'
        });

    },
    get activityStatus() {
        if (self.activityStatusIndex !== -1 && self.data.length > 1) {
            return self.data[self.activityStatusIndex]
        } else if (self.event.attributes) {
            const status = self.event.attributes.find(a => a.attribute === 'GeIEoCBrKaW');
            if (status) {
                return status.value;
            }
        }
        return null
    },
    get plannedStartDate() {
        const program = getParent(self, 2);
        const index = program.headers.findIndex((x) => {
            return x.name === 'eN9jthkmMds'
        });
        if (index !== -1) {
            return moment(self.data[index])
        }
        return null
    },
    get currentStatus() {
        let canImplement = false;
        const today = moment();
        let cls = '';

        if (self.activityStatus === 'On Schedule' && self.plannedStartDate && self.plannedStartDate.diff(today, 'days') <= 0) {
            cls = 'Overdue';
        } else if (self.activityStatus === 'On Schedule' && self.plannedStartDate && self.plannedStartDate.diff(today, 'days') <= 7) {
            cls = 'Upcoming';
        }
        else if (self.activityStatus === 'On Schedule' && self.plannedStartDate && self.plannedStartDate.diff(today, 'days') > 7) {
            cls = 'OnSchedule';
        } else if (self.activityStatus === 'Report Submitted') {
            cls = 'ReportSubmitted';
        } else if (self.activityStatus === 'Report Approved') {
            cls = 'ReportApproved';
        } else if (self.activityStatus === 'Ongoing') {
            cls = 'Ongoing';
        } else if (self.activityStatus === 'Implemented') {
            cls = 'Implemented';
        } else if (self.activityStatus === 'Upcoming') {
            cls = 'Upcoming';
        } else if (self.plannedStartDate && self.plannedStartDate.diff(today, 'days') <= 0) {
            cls = 'Overdue';
        } else if (self.plannedStartDate && self.plannedStartDate.diff(today, 'days') <= 7) {
            cls = 'Upcoming';
        } else if (self.plannedStartDate && self.plannedStartDate.diff(today, 'days') > 7) {
            cls = 'OnSchedule';
        }

        if (self.activityStatus === 'Overdue' || self.activityStatus === 'Upcoming' || self.activityStatus === 'On Schedule' || !self.activityStatus) {
            canImplement = true;
        }
        return {
            canImplement,
            cls
        }
    },
    get disableSubmit() {
        return self.activityStatus === 'Report Approved'
    },
    get canFinishImplementing() {
        return self.activityStatus === 'Ongoing'
    },
    get canAddReport() {
        return self.activityStatus === 'Implemented'
    },
    get canViewAndEditReport() {
        return self.activityStatus === 'Report Submitted'
    },
    get download() {
        const store = getRoot(self);
        const api = store.d2.Api.getApi();
        const url = api.baseUrl;
        if (store.report.rows.length > 0) {
            return `${url}/events/files?eventUid=${store.report.rows[0].data[0]}&dataElementUid=yxGmEyvPfwl`
        }
        return '';
    }
})).actions(self => ({
    afterCreate: flow(function* () {
        // yield self.fetchEvents()
    }),
    updateActivityStatus: flow(function* (status) {
        if (self.activityStatusIndex !== -1) {
            self.data[self.activityStatusIndex] = status;
            const program = getParent(self, 2);
            yield program.updateTrackedEntityInstance(self.getAttributes);
            yield program.refresh()
        }
    }),
    fetchEvents: flow(function* () {
        const store = getRoot(self);
        const api = store.d2.Api.getApi();
        const event = yield api.get(`trackedEntityInstances/${self.data[0]}`, {
            fields: '*',
            program: store.plannedActivity.id
        });

        self.event = event;
    }),
}));

export const ProgramStage = types.model('ProgramStage', {
    id: '',
    page: 1,
    pageSize: 5,
    total: 0,
    sorter: 'created:desc',
    headers: types.array(Header),
    rows: types.optional(types.array(Row), []),
    programStageDataElements: types.array(ProgramStageDataElement),
    related: types.maybe(types.late(() => ProgramStage)),
    hidden: types.optional(types.array(types.string), []),
    instance: '',
    row: types.optional(Row, {})
}).views(self => ({
    get nameAndCodeColumn() {
        const codeIndex = self.headers.findIndex((x) => {
            return x.name === 'UeKCu1x6gC1'
        });
        const nameIndex = self.headers.findIndex((x) => {
            return x.name === 'cIfzworL5Kj'
        });

        if (codeIndex !== -1 && nameIndex !== -1) {
            return { nameIndex, codeIndex }
        }

        return {}
    },
    get getData() {
        // const store = getRoot(self);
        const data = self.programStageDataElements.map(a => {
            const deIndex = self.headers.findIndex((x) => {
                return x.name === a.dataElement.id
            });

            let value = null;

            if (deIndex !== -1) {
                // console.log(JSON.stringify(self.rows));
                // value = self.rows.data[deIndex];
            }
            return [a.dataElement.id, value];
        });

        return fromPairs(data);

    },
    get columns() {
        if (self.headers.length > 0 && self.rows.length > 0) {
            const columns = self.programStageDataElements.map(a => {
                return a.dataElement.id
            });
            let cols = self.headers.map((a, i) => {
                return {
                    key: a.name,
                    title: a.column,
                    dataIndex: a.name,
                    render: (text, row) => {
                        if (a.name === 'GeIEoCBrKaW') {
                            return {
                                props: {
                                    className: row.currentStatus.cls,
                                },
                                children: <div>{row.data[i] || row.currentStatus.cls}</div>,
                            };
                        }
                        return <div>{row.data[i]}</div>
                    }
                }
            }).filter(h => {
                return columns.indexOf(h.key) !== -1
            });

            if (self.id === 'qky1qGVPe7e') {
                cols = cols.filter(c => {
                    return ['fdlUSNSkcO5', 'POFNc2t3zCO'].indexOf(c.key) !== -1
                })
            } else if (self.id === 'eXOOIxW2cAZ') {
                cols = cols.filter(c => {
                    return ['fdlUSNSkcO5', 'HF1r9NG0jNT'].indexOf(c.key) !== -1
                })
            }

            return cols;
        } else {
            let cols = self.programStageDataElements.map(a => {
                return {
                    key: a.dataElement.id,
                    title: a.dataElement.name,
                    dataIndex: a.dataElement.id,
                    render: (text) => {
                        return <div>{text}</div>
                    }
                }
            });


            if (self.id === 'qky1qGVPe7e') {
                cols = cols.filter(c => {
                    return ['fdlUSNSkcO5', 'POFNc2t3zCO'].indexOf(c.key) !== -1
                })
            } else if (self.id === 'eXOOIxW2cAZ') {
                cols = cols.filter(c => {
                    return ['fdlUSNSkcO5', 'HF1r9NG0jNT'].indexOf(c.key) !== -1
                })
            }

            return cols

        }
    },
    get form() {
        const store = getRoot(self)
        return self.programStageDataElements.map(de => {
            const { compulsory: mandatory, dataElement: { valueType } } = de;
            const hidden = self.hidden.indexOf(de.dataElement.id) !== -1;
            if (self.id === 'eXOOIxW2cAZ' && de.dataElement.id === 'fdlUSNSkcO5' && store.currentRow && store.currentRow.currentIssueNumbers) {
                return {
                    title: de.dataElement.name,
                    dataIndex: de.dataElement.id,
                    key: de.dataElement.id,
                    mandatory,
                    valueType,
                    hidden,
                    optionSet: { options: store.currentRow.currentIssueNumbers }
                }
            } else {
                return {
                    title: de.dataElement.name,
                    dataIndex: de.dataElement.id,
                    key: de.dataElement.id,
                    mandatory,
                    valueType,
                    hidden,
                    optionSet: de.dataElement.optionSet
                }
            }
        });
    }
})).actions(self => {
    const afterCreate = flow(function* () {
        yield self.fetchMetadata();
        // yield self.fetchEvents();
    });
    const fetchMetadata = flow(function* () {
        const api = getRoot(self).d2.Api.getApi();
        try {
            const { programStageDataElements } = yield api.get(`programStages/${self.id}`, {
                fields: 'programStageDataElements[id,compulsory,dataElement[id,name,valueType,optionSet[options[name,code]]]]'
            });
            self.programStageDataElements = programStageDataElements;
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error"
        }
    });

    const fetchEvents = flow(function* () {
        const api = getRoot(self).d2.Api.getApi();
        self.loading = true;

        let params = {
            programStage: self.id,
            totalPages: true,
            pageSize: self.pageSize,
            includeAllDataElements: true,
            order: self.sorter,
            ouMode: 'ALL'
        }
        try {

            if (self.instance !== '') {
                params = { ...params, trackedEntityInstance: self.instance }
            }
            const { headers, rows, metaData: { pager } } = yield api.get('events/query.json', params);
            self.headers = headers;
            self.rows = rows.map(r => {
                return { data: r }
            });
            self.total = pager.total;
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error"
        }
        self.loading = false;
    });
    const fetchInstanceEvents = flow(function* (trackedEntityInstance) {
        const api = getRoot(self).d2.Api.getApi();
        self.loading = true;
        let params = {
            programStage: self.id,
            totalPages: true,
            pageSize: self.pageSize,
            trackedEntityInstance,
            includeAllDataElements: true,
            order: self.sorter,
            ouMode: 'ALL'
        }

        if (self.instance !== '') {
            params = { ...params, trackedEntityInstance: self.instance }
        }
        try {
            const { headers, rows, metaData: { pager } } = yield api.get('events/query.json', params);
            self.headers = headers;
            self.rows = rows.map(r => {
                return { data: r }
            });
            self.total = pager.total;
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error"
        }
        self.loading = false;
    });

    const searchEvents = flow(function* (search) {
        const api = getRoot(self).d2.Api.getApi();
        if (search && search !== '') {
            const searchByName = api.get('events/query.json', {
                filter: `cIfzworL5Kj:LIKE:${search}`,
                includeAllDataElements: true,
                programStage: self.id,
                paging: true,
                pageSize: 25,
                page: 1,
                totalPages: false
            });

            const searchByCode = api.get('events/query.json', {
                filter: `UeKCu1x6gC1:LIKE:${search}`,
                includeAllDataElements: true,
                programStage: self.id,
                paging: true,
                pageSize: 25,
                page: 1,
                totalPages: false
            });
            const result = yield Promise.all([searchByName, searchByCode]);
            const headers = result[0].headers
            let final = result.map(r => {
                return r.rows;
            });

            final = flatten(final)

            const rows = unionBy(final, (e) => {
                return e[0]
            });

            self.rows = rows.map(r => {
                return { data: r }
            });
            self.headers = headers;
        } else {
            self.events = {}
        }
    });

    const handleChange = flow(function* (pagination, filters, sorter) {
        self.loading = true;
        const order = sorter.field && sorter.order ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}` : 'created:desc';
        const page = pagination.pageSize !== self.pageSize || order !== self.sorter ? 1 : pagination.current;
        self.sorter = order;
        self.page = page;
        self.pageSize = pagination.pageSize
        const api = getRoot(self).d2.Api.getApi();
        try {
            const { headers, rows, metaData: { pager } } = yield api.get('events/query.json', {
                programStage: self.id,
                totalPages: true,
                pageSize: self.pageSize,
                includeAllDataElements: true,
                order: self.sorter,
                ouMode: 'ALL',
                query: self.search === '' ? '' : `LIKE:${self.search}`,
                page,
            });
            self.total = pager.total;
            self.pageSize = pager.pageSize;
            self.rows = rows.map(r => {
                return { data: r }
            });
            self.headers = headers
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error"
        }
        self.loading = false;
    });
    const setHidden = (values) => self.hidden = values;
    const setInstance = (values) => self.instance = values;

    return {
        searchEvents,
        fetchEvents,
        fetchInstanceEvents,
        afterCreate,
        handleChange,
        fetchMetadata,
        setHidden,
        setInstance
    }
});;


export const Program = types.model('Program', {
    id: types.identifier,
    page: 1,
    pageSize: 10,
    total: 0,
    sorter: 'created:desc',
    programTrackedEntityAttributes: types.optional(types.array(ProgramTrackedEntityAttributes), []),
    headers: types.optional(types.array(Header), []),
    rows: types.optional(types.array(Row), []),
    programStages: types.optional(types.array(ProgramStage), []),
    related: types.optional(ProgramStage, {}),
    hidden: types.optional(types.array(types.string), []),
    trackedEntityType: 'b41rJVoJ4B3',
    currentInstance: '',
    currentOU: '',
    search: '',
    attribute: ''
}).views(self => ({
    get columns() {
        if (self.rows) {
            const columns = self.programTrackedEntityAttributes.map(a => {
                return a.trackedEntityAttribute.id
            });
            let cols = self.headers.map((a, i) => {
                return {
                    key: a.name,
                    title: a.column,
                    dataIndex: a.name,
                    index: i,
                    render: (text, row) => {
                        if (a.name === 'GeIEoCBrKaW') {
                            return {
                                props: {
                                    className: row.currentStatus.cls,
                                },
                                children: <div>{row.data[i] || row.currentStatus.cls}</div>,
                            };
                        }
                        return <div>{row.data[i]}</div>
                    }
                }
            }).filter(h => {
                return columns.indexOf(h.key) !== -1 || h.key === 'ouname'
            });

            if (self.id === 'lINGRWR9UFx') {
                const store = getRoot(self);
                const columns = ['le0A6qC3Oap', 'GeIEoCBrKaW', 'eN9jthkmMds', 'pyQEzpRRcqH', 'ouname'];
                cols = cols.filter(c => columns.indexOf(c.key) !== -1)
                cols = [...cols, {
                    title: 'Actions',
                    key: 'lINGRWR9UFx',
                    render: (text, record) => {
                        let l = [];
                        if (record.currentStatus.canImplement) {
                            l = [...l, <Menu.Item key="1" onClick={async () => await record.updateActivityStatus('Ongoing')}>
                                Start Implementing
                            </Menu.Item>]
                        }

                        if (record.canFinishImplementing) {
                            l = [...l, <Menu.Item key="2" onClick={async () => await record.updateActivityStatus('Implemented')}>
                                Mark As Implemented
                            </Menu.Item>]
                        }
                        if (record.canAddReport) {
                            l = [...l, <Menu.Item key="3" onClick={() => {
                                self.setRow(record);
                                store.router.setView(views.activityDetails, { instance: record.data[0] })
                            }}>
                                Add Report
                            </Menu.Item>]
                        }
                        if (record.canViewAndEditReport || record.disableSubmit) {
                            l = [...l, <Menu.Item key="4" onClick={() => {
                                self.setRow(record);
                                store.router.setView(views.activityDetails, { instance: record.data[0] });
                            }}>
                                View Report
                            </Menu.Item>]

                            if (record.download) {
                                l = [...l, <Menu.Item key="5">
                                    <a href={record.download}>Download Report</a>
                                </Menu.Item>]
                            }

                            if (!record.disableSubmit) {
                                l = [...l, <Menu.Item key="6" onClick={async () => await record.updateActivityStatus('Report Approved')}>
                                    Approve Report
                                </Menu.Item>]
                            }
                        }
                        const menu = (
                            <Menu>
                                {l.map(m => m)}
                            </Menu>
                        );
                        return <Dropdown overlay={menu} trigger={['click']}>
                            <Button type="link">
                                <Icon type="down" />
                            </Button>
                        </Dropdown>
                    }
                }]
            }

            return cols;
        }
        return []
    },
    get form() {
        if (self.programTrackedEntityAttributes) {
            return self.programTrackedEntityAttributes.map(a => {
                const { mandatory, valueType } = a;
                const hidden = self.hidden.indexOf(a.trackedEntityAttribute.id) !== -1
                return {
                    key: a.trackedEntityAttribute.id,
                    title: a.trackedEntityAttribute.name,
                    mandatory,
                    valueType,
                    hidden,
                    optionSet: a.trackedEntityAttribute.optionSet
                }
            })
        }
        return []
    },
    get eventForms() {
        const forms = self.programStages.map(programStage => {
            const defaultColumns = programStage.programStageDataElements.map(de => {
                const { compulsory: mandatory, dataElement: { valueType } } = de;

                const hidden = self.hidden.indexOf(de.dataElement.id) !== -1
                return {
                    title: de.dataElement.name,
                    dataIndex: de.dataElement.id,
                    key: de.dataElement.id,
                    mandatory,
                    valueType,
                    hidden,
                    optionSet: de.dataElement.optionSet
                }
            });
            return [programStage.id, defaultColumns]
        });
        return fromPairs(forms)
    },
    get ouIndex() {
        return self.headers.findIndex((x) => {
            return x.name === 'ou'
        })
    },

    get firstProgramStage() {
        return self.programStages[0]
    }

})).actions(self => {
    const fetchAttributes = flow(function* () {
        const api = getRoot(self).d2.Api.getApi();
        self.loading = true;
        try {
            const { headers, rows, metaData: { pager } } = yield api.get('trackedEntityInstances/query.json', {
                query: self.search === '' ? '' : `LIKE:${self.search}`,
                program: self.id,
                totalPages: true,
                pageSize: self.pageSize,
                order: self.sorter,
                ouMode: 'ALL',
            });
            self.rows = rows.map(r => {
                return { data: r }
            });
            self.headers = headers
            self.total = pager.total;
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error"
        }
        self.loading = false;
    });
    const fetchMetadata = flow(function* () {
        const api = getRoot(self).d2.Api.getApi();
        try {
            const { programTrackedEntityAttributes } = yield api.get(`programs/${self.id}`, {
                fields: 'programTrackedEntityAttributes[mandatory,valueType,trackedEntityAttribute[id,name,unique,optionSet[options[name,code]]]]'
            });
            self.programTrackedEntityAttributes = programTrackedEntityAttributes
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error"
        }
    });

    async function afterCreate() {
        await self.fetchMetadata();
    }

    const handleChange = flow(function* (pagination, filters, sorter) {
        self.loading = true;
        const order = sorter.field && sorter.order ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}` : 'created:desc';
        const page = pagination.pageSize !== self.pageSize || order !== self.sorter ? 1 : pagination.current;
        self.sorter = order;
        self.page = page;
        const api = getRoot(self).d2.Api.getApi();
        try {
            const { headers, rows, metaData: { pager } } = yield api.get('trackedEntityInstances/query.json', {
                program: self.id,
                totalPages: true,
                pageSize: self.pageSize,
                order: self.sorter,
                ouMode: 'ALL',
                query: self.search === '' ? '' : `LIKE:${self.search}`,
                page,
            });
            self.total = pager.total;
            self.pageSize = pager.pageSize;
            self.rows = rows.map(r => {
                return { data: r }
            });
            self.headers = headers
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error"
        }
        self.loading = false;
    });


    const refresh = flow(function* () {
        self.loading = true;
        const api = getRoot(self).d2.Api.getApi();
        try {
            const { headers, rows } = yield api.get('trackedEntityInstances/query.json', {
                program: self.id,
                pageSize: self.pageSize,
                order: self.sorter,
                ouMode: 'ALL',
                page: self.page,
                query: self.search === '' ? '' : `LIKE:${self.search}`,
            });
            self.rows = rows.map(r => {
                return { data: r }
            });
            self.headers = headers
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error"
        }
        self.loading = false;
    });

    const addEvent = flow(function* (data) {
        const api = getRoot(self).d2.Api.getApi();

        const { organisationUnits, programStage, trackedEntityInstance, ...others } = data;

        self.loading = true;

        const dataValues = Object.keys(others).map(dataElement => {
            return { dataElement, value: data[dataElement] };
        });

        let events = []

        if (organisationUnits && organisationUnits.length > 0) {
            events = organisationUnits.map(ou => {
                let event = {
                    eventDate: new Date().toISOString(),
                    status: 'COMPLETED',
                    completedDate: new Date().toISOString(),
                    program: self.id,
                    orgUnit: ou,
                    dataValues,
                    programStage,
                    trackedEntityInstance
                }
                return event;
            });
        }
        try {
            yield api.post('events', { events });
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error"
        }
        self.loading = false;
    });

    const setHidden = (values) => self.hidden = values;

    const addTrackedEntityInstance = flow(function* (data) {
        const api = getRoot(self).d2.Api.getApi();

        self.loading = true;

        const { organisationUnits, activity, trackedEntityInstance, enrollment, events, ...others } = data;

        const attributes = Object.keys(others).map(attribute => {
            return { attribute, value: data[attribute] };
        });

        const date = new Date().toISOString()

        const trackedEntityInstances = organisationUnits.map(orgUnit => {
            let currentEnrollment = {
                orgUnit,
                program: self.id,
                enrollmentDate: date,
                incidentDate: date
            }
            if (enrollment) {
                currentEnrollment = { ...currentEnrollment, enrollment }
            }
            let tei = {
                orgUnit,
                trackedEntityType: self.trackedEntityType,
                attributes,
                enrollments: [currentEnrollment]
            }

            if (trackedEntityInstance) {
                tei = { ...tei, trackedEntityInstance }
            }
            return tei;
        });

        try {
            yield api.post('trackedEntityInstances', { trackedEntityInstances });
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error";

        }
        self.loading = false;
    });


    const updateTrackedEntityInstance = flow(function* (data) {
        const api = getRoot(self).d2.Api.getApi();

        self.loading = true;

        const { organisationUnits, activity, trackedEntityInstance, enrollment, events, ...others } = data;

        const attributes = Object.keys(others).map(attribute => {
            return { attribute, value: data[attribute] };
        });
        const trackedEntityInstances = organisationUnits.map(orgUnit => {

            let tei = {
                orgUnit,
                trackedEntityType: self.trackedEntityType,
                attributes
            }

            if (trackedEntityInstance) {
                tei = { ...tei, trackedEntityInstance }
            }
            return tei;
        });

        try {
            yield api.post('trackedEntityInstances', { trackedEntityInstances });
        } catch (error) {
            console.error("Failed to fetch projects", error);
            self.state = "error";

        }
        self.loading = false;
    });

    const setSearch = flow(function* (search) {
        self.search = search;
        yield self.fetchAttributes();
    });

    const setCurrentInstance = val => self.currentInstance = val;
    const setCurrentOU = val => self.currentOU = val;
    const setRow = val => self.row = val;


    return {
        afterCreate,
        fetchAttributes,
        fetchMetadata,
        handleChange,
        addEvent,
        setHidden,
        addTrackedEntityInstance,
        refresh,
        setSearch,
        setCurrentInstance,
        setCurrentOU,
        updateTrackedEntityInstance,
        setRow
    }

});


