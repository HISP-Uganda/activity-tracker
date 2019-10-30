import { flow, getParent, types, getRoot } from "mobx-state-tree";
import { fromPairs } from 'lodash'
import React from 'react'
import { Menu, Icon, Dropdown } from "antd";
import views from '../../config/views'
import { Link } from '../../modules/router'

export const Attribute = types
    .model("Attribute", {
        attribute: types.string,
        value: ''
    });

export const Option = types
    .model("Option", {
        name: types.string,
        code: types.string
    });

export const OptionSet = types
    .model("OptionSet", {
        options: types.array(Option)
    });

export const TrackedEntityAttribute = types
    .model("TrackedEntityAttributes", {
        id: types.identifier,
        name: types.string,
        unique: false,
        optionSet: types.maybeNull(OptionSet)
    });

export const ProgramTrackedEntityAttributes = types
    .model("ProgramTrackedEntityAttributes", {
        trackedEntityAttribute: TrackedEntityAttribute,
        valueType: types.string,
        mandatory: false
    });

export const DataValue = types
    .model("DataValue", {
        value: types.string,
        dataElement: types.string,
    });


export const Event = types
    .model("Attribute", {
        event: types.string,
        orgUnit: types.string,
        program: types.string,
        dataValues: types.array(DataValue)
    });


export const Enrollment = types
    .model("Enrollment", {
        enrollment: types.string,
        orgUnit: types.string,
        program: types.string,
        enrollmentDate: types.string,
        incidentDate: types.string,
        created: types.string,
        trackedEntityType: types.string,
        events: types.array(Event)
    });

export const DataElement = types
    .model("DataElement", {
        id: types.string,
        name: types.string
    });

export const ProgramStageDataElement = types
    .model("ProgramStageDataElement", {
        id: types.string,
        dataElement: DataElement
    });

export const ProgramStage = types.model('ProgramStage', {
    id: types.string,
    name: types.string,
    programStageDataElements: types.array(ProgramStageDataElement)
})
export const EventStore = types
    .model("EventStore", {
        events: types.optional(types.array(Event), []),
        program: types.identifier,
        page: 1,
        pageSize: 10,
        total: 0,
        sorter: 'created:desc',
        programStages: types.array(ProgramStage),
        relatedProgram: types.maybe(types.reference(types.late(() => EventStore))),
        relatedTracker: types.maybe(types.reference(types.late(() => TrackedEntityInstance))),
        instance: '',
        relatedDataElement: ''
    }).views(self => ({
        get store() {
            return getParent(self)
        },
        get columns() {
            const programStage = self.programStages[0];
            return programStage.programStageDataElements.map(de => {
                return {
                    title: de.dataElement.name,
                    dataIndex: de.dataElement.id,
                    key: de.dataElement.id,
                    isRelationship: de.dataElement.id === self.relatedDataElement
                }
            });
        },
        get data() {
            return self.events.map(event => {

                let { dataValues, ...rest } = event
                dataValues = dataValues.map(d => {
                    return [d.dataElement, d.value]
                });

                return { ...rest, ...fromPairs(dataValues) };
            });

        }
    })).actions(self => {
        const fetchProgramStages = flow(function* () {
            const api = getRoot(self).d2.Api.getApi();
            try {
                const { programStages } = yield api.get(`programs/${self.program}`, {
                    fields: 'programStages[id,name,programStageDataElements[id,dataElement[id,name]]]'
                });
                self.programStages = programStages;
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
        });

        const fetchEvents = flow(function* () {
            const api = getRoot(self).d2.Api.getApi();

            self.loading = true;
            try {
                let defaults = {
                    program: self.program,
                    totalPages: true,
                    pageSize: self.pageSize,
                    order: self.sorter,
                    ouMode: 'ALL',
                    fields: '*'
                }
                if (self.instance !== '') {
                    defaults = {
                        ...defaults,
                        trackedEntityInstance: self.instance
                    }
                }
                const { events, pager } = yield api.get('events.json', defaults);

                self.total = pager.total;
                self.events = events
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });

        const addProject = flow(function* (data) {
            const api = getRoot(self).d2.Api.getApi();

            self.loading = true;

            const dataValues = Object.keys(data).map(dataElement => {
                return { dataElement, value: data[dataElement] };
            });
            const event = {
                eventDate: new Date().toISOString(),
                status: 'COMPLETED',
                completedDate: new Date().toISOString(),
                program: self.program,
                orgUnit: self.store.orgUnit,
                dataValues
            }
            try {
                yield api.post('events', event);
                switch (self.program) {
                    case 'TTg5i4JO3U6':
                        self.store.router.setView(views.projects, {})
                        break;
                    case 'nqnAO1d0ilV':
                        self.store.router.setView(views.objectives, {})
                        break;
                    case 'lfBEzT9gvOW':
                        self.store.router.setView(views.resultAreas, {})
                        break;
                    case 'FCs73yoYfWp':
                        self.store.router.setView(views.outputs, {})
                        break;

                    case 'yAYNtTb7B03':
                        self.store.router.setView(views.activityData, {})
                        break;
                    default:
                        console.log('None')

                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });

        const setProgram = (program) => self.program = program;

        const setRelatedProgram = (program) => self.relatedProgram = program;
        const setRelatedDataElement = (dataElement) => self.relatedDataElement = dataElement;
        const setInstance = (instance) => self.instance = instance;

        return {
            fetchProgramStages,
            fetchEvents,
            addProject,
            setProgram,
            setRelatedProgram,
            setRelatedDataElement,
            setInstance
        }
    });
export const TrackedEntityInstance = types
    .model("TrackedEntityInstance", {
        instance: types.identifier,
        created: types.string,
        lastupdated: types.string,
        ou: types.string,
        ouname: types.string,
        te: types.string,
        inactive: types.string,
        attributes: types.array(Attribute),
        eventStore: types.optional(EventStore, { program: 'Y7SLdPodxhM' }),
    }).actions(self => ({
        // fetchEnrollments: flow(function* () {
        //     const root = getRoot(self)
        //     const api = root.d2.Api.getApi();
        //     const program = root.currentTracker.program;
        //     try {
        //         const { enrollments } = yield api.get(`trackedEntityInstances/${self.instance}.json`, {
        //             fields: '*',
        //             program
        //         });
        //         self.enrollments = enrollments
        //     } catch (error) {
        //         console.error("Failed to fetch projects", error);
        //         self.state = "error"
        //     }
        // }),
        afterCreate: function () {
            self.eventStore.setInstance(self.instance);
            // yield self.eventStore.fetchEvents()
        }
    }));



export const TrackedEntityInstanceStore = types
    .model("TrackedEntityInstanceStore", {
        trackedEntityInstances: types.array(TrackedEntityInstance),
        program: types.identifier,
        page: 1,
        pageSize: 10,
        total: 0,
        loading: false,
        attributes: types.optional(types.array(ProgramTrackedEntityAttributes), []),
        headers: types.optional(types.array(types.frozen()), []),
        otherData: types.frozen(),
        sorter: 'created:desc',
        users: types.optional(types.array(types.frozen()), []),
        trackedEntityType: 'LjAGxhyu3Ex',
        selectedUnits: types.optional(types.array(types.frozen()), []),
        currentInstance: types.maybe(types.reference(TrackedEntityInstance)),
    }).views(self => ({
        get store() {
            return getParent(self)
        },
        get columns() {
            return [
                ...self.headers.filter(h => ['cyEYXCpq7iK', 'aZuLz2kDasY', 'ouname', 'KpWl6PY0YK2', 'xZ38An174EP'].indexOf(h.name) !== -1).map(h => {
                    return {
                        title: h.column,
                        dataIndex: h.name,
                        key: h.name,
                        sorter: true,
                    }
                }),
                {
                    title: 'Actions',
                    render: (text, record) => {
                        const menu = (
                            <Menu>
                                <Menu.Item key="1" onClick={() => self.setCurrentInstance(record)}>
                                    {/* <Link router={self.store.router} view={views.activity} params={{ activity: record.instance }}> */}
                                    <Icon type="user" />
                                    1st menu item
                                    {/* </Link> */}
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link router={self.store.router} view={views.activities}>
                                        <Icon type="user" />
                                        <Icon type="user" />
                                        2nd menu item
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <Link router={self.store.router} view={views.activities}>
                                        <Icon type="user" />
                                        <Icon type="user" />
                                        3rd item
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        )
                        return <Dropdown overlay={menu}>
                            <Icon type="more" style={{ fontSize: '24px' }} />
                        </Dropdown>
                    }
                }
            ]
        },
        get data() {
            return self.trackedEntityInstances.map(trackedEntityInstance => {
                const attributes = fromPairs(trackedEntityInstance.attributes.map(a => {
                    return [a.attribute, a.value]
                }));
                return { ...trackedEntityInstance, ...attributes }
            });
        },
        get attributeColumns() {
            return self.headers.filter(r => {
                const attributes = self.attributes.map(a => a.trackedEntityAttribute.id);
                return attributes.indexOf(r.name) !== -1
            });
        },
        get defaultColumns() {
            return self.headers.filter(r => {
                const attributes = self.attributes.map(a => a.trackedEntityAttribute.id);
                return attributes.indexOf(r.name) === -1
            });
        },
        get formColumns() {
            return self.attributes.map(a => {
                const { mandatory, valueType } = a;
                return {
                    key: a.trackedEntityAttribute.id,
                    title: a.trackedEntityAttribute.name,
                    mandatory,
                    valueType,
                    optionSet: a.trackedEntityAttribute.optionSet,
                    searchUsers: a.trackedEntityAttribute.id === 'HU1ppQMn5JY'
                }
            })
        }
    })).actions(self => {
        const api = getParent(self).d2.Api.getApi();
        const fetchTrackedEntityInstances = flow(function* () {
            self.loading = true;
            try {
                const { headers, rows, metaData: { pager } } = yield api.get('trackedEntityInstances/query.json', {
                    program: self.program,
                    totalPages: true,
                    pageSize: self.pageSize,
                    order: self.sorter,
                    ouMode: 'ALL'
                });

                self.headers = headers.map((h, i) => {
                    return { ...h, index: i }
                });
                const found = rows.map(r => {
                    const entity = Object.assign.apply({}, self.defaultColumns.map(v => ({
                        [v.name]: r[v.index]
                    })));
                    const attributes = self.attributeColumns.map(h => {
                        return { attribute: h.name, value: r[h.index] }
                    });

                    return { ...entity, attributes }
                });

                self.total = pager.total;
                self.trackedEntityInstances = found
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });

        const searchUsers = flow(function* (search) {
            const { users } = yield api.get('users', {
                fields: 'displayName,id,userCredentials[username]',
                paging: true,
                pageSize: 25,
                page: 1,
                totalPages: false,
                query: search
            });

            self.users = users.map(u => {
                return {
                    id: u.id,
                    displayName: `${u.displayName} (${u.userCredentials.username})`
                }
            });
        })

        const findData = flow(function* (activity) {
            try {
                const { dataValues } = yield api.get(`events/${activity}.json`, {});

                const activities = fromPairs(dataValues.map(d => {
                    return [d.dataElement, d.value]
                }));



                const { dataValues: data } = yield api.get(`events/${activities['Cwu1KVVPMzp']}.json`, {});

                const resultAreas = fromPairs(data.map(d => {
                    return [d.dataElement, d.value]
                }));

                const { dataValues: data1 } = yield api.get(`events/${resultAreas['Z0oFe9Y0AkF']}.json`, {});

                const objectives = fromPairs(data1.map(d => {
                    return [d.dataElement, d.value]
                }));



                const { dataValues: data2 } = yield api.get(`events/${objectives['fWpwKdGRp9r']}.json`, {});

                const projects = fromPairs(data2.map(d => {
                    return [d.dataElement, d.value]
                }));

                self.otherData = {
                    R6fQYmqE2a7: projects['UeKCu1x6gC1'],
                    IvU5WlAUioy: objectives['UeKCu1x6gC1'],
                    jfB1imcdlXr: resultAreas['UeKCu1x6gC1'],
                    aZuLz2kDasY: activities['UeKCu1x6gC1'],
                    cyEYXCpq7iK: activities['cIfzworL5Kj']
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
        });


        const addTrackedEntityInstance = flow(function* (data) {
            self.loading = true;

            const { organisationUnits, assignedUser, activity, KKOW94YoIZT, sIruXpp3PX1, c3NJ0qpnSbh, ...others } = data;

            const attributes = Object.keys(others).map(attribute => {
                return { attribute, value: data[attribute] };
            });

            const date = new Date().toISOString()

            const trackedEntityInstances = organisationUnits.map(orgUnit => {
                return {
                    orgUnit,
                    trackedEntityType: self.trackedEntityType,
                    assignedUser,
                    attributes,
                    enrollments: [{
                        orgUnit,
                        program: self.program,
                        enrollmentDate: date,
                        incidentDate: date

                    }]
                }
            });

            try {
                yield api.post('trackedEntityInstances', { trackedEntityInstances });
                switch (self.program) {
                    case 'Y7SLdPodxhM':
                        self.store.router.setView(views.activities, {})
                        break;
                    case 'p12qwBMhK3c':
                        self.store.router.setView(views.issues, {})
                        break;
                    default:
                        console.log('None')

                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });

        const fetchAttributes = flow(function* () {
            try {
                const { programTrackedEntityAttributes } = yield api.get(`programs/${self.program}`, {
                    fields: 'programTrackedEntityAttributes[mandatory,valueType,trackedEntityAttribute[id,name,unique,optionSet[options[name,code]]]]'
                });
                self.attributes = programTrackedEntityAttributes;
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
        });

        const handleChange = flow(function* (pagination, filters, sorter) {
            self.loading = true;
            const order = sorter.field && sorter.order ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}` : 'created:desc';
            const page = pagination.pageSize !== self.pageSize || order !== self.sorter ? 1 : pagination.current;
            self.sorter = order;
            const api = getParent(self).d2.Api.getApi();
            try {
                const { headers, rows, metaData: { pager } } = yield api.get('trackedEntityInstances/query.json', {
                    program: self.program,
                    totalPages: true,
                    pageSize: pagination.pageSize,
                    order,
                    page,
                    ouMode: 'ALL'
                });

                self.headers = headers.map((h, i) => {
                    return { ...h, index: i }
                });
                const found = rows.map(r => {
                    const entity = Object.assign.apply({}, self.defaultColumns.map(v => ({
                        [v.name]: r[v.index]
                    })));

                    const attributes = self.attributeColumns.map(h => {
                        return { attribute: h.name, value: r[h.index] }
                    });

                    return { ...entity, attributes }
                });
                self.total = pager.total;
                self.pageSize = pager.pageSize;
                self.trackedEntityInstances = found
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });

        const setProgram = (program) => self.program = program;
        const setSelectedUnits = (units) => self.selectedUnits = units;
        const setCurrentInstance = (instance) => {
            self.currentInstance = self.trackedEntityInstances.find(i => i.instance === instance.instance);
            self.store.router.setView(views.activity, { activity: instance.instance })
        }

        return {
            fetchTrackedEntityInstances,
            fetchAttributes,
            handleChange,
            setProgram,
            findData,
            searchUsers,
            setSelectedUnits,
            addTrackedEntityInstance,
            setCurrentInstance
        }
    });



