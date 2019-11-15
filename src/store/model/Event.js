
import { fromPairs } from 'lodash'
import React from 'react'
import { Button } from "antd";
import { observable, action, computed, toJS } from "mobx";
import { Link } from 'react-router-dom';
import { generateUid } from '../../utils';
import moment from 'moment';

export class Event {
    @observable relatedTracker
    @observable d2;
    @observable eventData;
    @observable relationships = [];

    @computed get dataValues() {
        if (this.eventData) {
            return fromPairs(this.eventData.dataValues.map(dv => [dv.dataElement, dv.value]))
        }
        return {}
    }

    @computed get currentStatus() {
        let activityStatus = this.dataValues['fy5XDC0rMKj'];
        let plannedStartDate = moment(this.dataValues['JGq3OlNPVEh']);

        let canImplement = false;
        const today = moment();

        let cls = '';
        if (activityStatus === 'On Schedule' && plannedStartDate.diff(today, 'days') <= 7) {
            activityStatus = 'Upcoming';
            cls = 'Upcoming';
        }
        else if (activityStatus === 'On Schedule' && plannedStartDate.diff(today, 'days') <= 0) {
            activityStatus = 'Overdue';
            cls = 'Overdue';
        } else if (activityStatus === 'On Schedule' && plannedStartDate.diff(today, 'days') > 7) {
            activityStatus = 'On Schedule';
            cls = 'OnSchedule';
        } else if (activityStatus === 'Report Submitted') {
            cls = 'ReportSubmitted';
        } else if (activityStatus === 'Report Approved') {
            cls = 'ReportApproved';
        } else if (activityStatus === 'Ongoing') {
            cls = 'Ongoing';
        } else if (activityStatus === 'Implemented') {
            cls = 'Implemented';
        } else if (activityStatus === 'Upcoming') {
            activityStatus = 'Upcoming';
            cls = 'Upcoming';
        }

        if (activityStatus === 'Overdue' || activityStatus === 'Upcoming' || activityStatus === 'On Schedule' || !activityStatus) {
            canImplement = true;
        }

        return {
            canImplement,
            cls
        }
    }

    @computed get disableSubmit() {
        return this.dataValues['fy5XDC0rMKj'] && this.dataValues['fy5XDC0rMKj'] === 'Report Approved'
    }

    @computed get canFinishImplementing() {
        return this.dataValues['fy5XDC0rMKj'] && this.dataValues['fy5XDC0rMKj'] === 'Ongoing'
    }

    @computed get canAddReport() {
        return this.dataValues['fy5XDC0rMKj'] && this.dataValues['fy5XDC0rMKj'] === 'Implemented'
    }

    @computed get canViewAndEditReport() {
        return this.dataValues['fy5XDC0rMKj'] && this.dataValues['fy5XDC0rMKj'] === 'Report Submitted'
    }

    @computed get download() {
        const api = this.d2.Api.getApi();
        const url = api.baseUrl
        return this.canViewAndEditReport ? `${url}/events/files?eventUid=${this.eventData.event}&dataElementUid=yxGmEyvPfwl` : null
    }


    @action fetchRelationShips = async () => {
        const api = this.d2.Api.getApi();
        this.loading = true;
        try {
            const relationships = await api.get('relationships.json', { event: this.eventData.event });
            const data = relationships.filter(r => {
                return r.to.trackedEntityInstance
            }).map(r => {
                const { to: { trackedEntityInstance } } = r
                return trackedEntityInstance.trackedEntityInstance
            });
            if (data.length > 0) {
                const { trackedEntityInstances } = await api.get('trackedEntityInstances', { trackedEntityInstance: data.join(';'), fields: '*' })
                this.relatedTracker.setTrackedEntityInstances(trackedEntityInstances);
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
        this.loading = false;
    };

    @action addRelationShip = async (to, relationshipType) => {
        const api = this.d2.Api.getApi();
        this.loading = true;
        const payload = {
            relationshipType,
            from: {
                event: {
                    event: this.eventData.event
                }
            },
            to
        }

        try {
            await api.post('relationships', payload);

        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
        this.loading = false;
    };
    @action setRelatedTracker = (tracker) => this.relatedTracker = tracker;
    @action setD2 = val => this.d2 = val;
    @action setEventData = val => this.eventData = val;
    @action setRelationships = val => this.relationships = val;
    @action setQueryData = val => this.queryData = val;

    @action updateEvent = async (data) => {
        const eventData = toJS(this.eventData);
        const api = this.d2.Api.getApi();
        let dataValues = eventData.dataValues;
        Object.keys(data).forEach(dv => {
            const objIndex = dataValues.findIndex(obj => obj.dataElement === dv);
            if (objIndex !== -1) {
                const updatedObj = { ...dataValues[objIndex], value: data[dv] };
                dataValues = [
                    ...dataValues.slice(0, objIndex),
                    updatedObj,
                    ...dataValues.slice(objIndex + 1),
                ];
            } else {
                dataValues = [...dataValues, { dataElement: dv, value: data[dv] }]
            }
        });
        const update = { ...eventData, dataValues };
        await api.update(`events/${update.event}`, update);
        this.setEventData(update);
    }

}

export class EventStore {
    @observable events = []
    @observable program;
    @observable page = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable sorter = 'created:desc';
    @observable programStages = []
    @observable relatedProgram;
    @observable d2;
    @observable currentEvent = new Event();

    constructor(program) {
        this.setProgram(program);
    }

    @computed
    get columns() {
        if (this.programStages.length > 0) {
            const programStage = this.programStages[0];
            let defaultColumns = programStage.programStageDataElements.map(de => {
                return {
                    title: de.dataElement.name,
                    dataIndex: de.dataElement.id,
                    key: de.dataElement.id,
                    sorter: true,
                }
            });

            if (this.program === 'EClplZ6Jvlt') {
                const f = ['Z0oFe9Y0AkF', 'fWpwKdGRp9r', 'lX4Ae98tFFl', 'yxGmEyvPfwl', 'Cwu1KVVPMzp', 'iCnLNYXlxLI', 'fy5XDC0rMKj']
                defaultColumns = defaultColumns.filter(w => f.indexOf(w.key) === -1)
                defaultColumns = [{
                    title: 'Activity Location',
                    dataIndex: 'orgUnitName',
                    key: 'orgUnitName',
                    sorter: true,
                    render: (text) => {
                        return text
                    }
                }, ...defaultColumns, {
                    title: 'Implementor',
                    dataIndex: 'implementor',
                    key: 'implementor',
                    // sorter: true,
                    render: (text, record) => {
                        return record.currentEvent.eventData.assignedUserUsername
                    }
                }, {
                    title: 'Status',
                    dataIndex: 'fy5XDC0rMKj',
                    key: 'fy5XDC0rMKj',
                    sorter: true,
                    render: (text, record) => {

                        return {
                            props: {
                                className: record.currentEvent.currentStatus.cls,
                            },
                            children: <div>{text || record.currentEvent.currentStatus.cls}</div>,
                        };
                    }
                },

                {
                    title: 'Actions',
                    render: (text, record) => {
                        return <div>
                            {record.currentEvent.currentStatus.canImplement ? <Button onClick={async () => await record.currentEvent.updateEvent({ fy5XDC0rMKj: 'Ongoing' })}>Start Implementing</Button> : null}
                            {record.currentEvent.canFinishImplementing ? <Button onClick={async () => await record.currentEvent.updateEvent({ fy5XDC0rMKj: 'Implemented' })}>Mark as Implemented</Button> : null}
                            {record.currentEvent.canAddReport ? <Link to={`/events/details/${record.event}`}>Add Report</Link> : null}
                            {record.currentEvent.canViewAndEditReport ? <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Link to={`/events/details/${record.event}`}>View Report</Link>
                                {record.currentEvent.download ? <a href={record.currentEvent.download}>Download</a> : null}
                            </div> : null}
                        </div>
                    }
                }

                ]
            }
            return defaultColumns
        }
        return [];
    }

    @computed
    get data() {
        return this.events

        // .map(event => {
        //     let { dataValues, ...rest } = event
        //     dataValues = dataValues.map(d => {
        //         return [d.dataElement, d.value]
        //     });
        //     return { ...rest, ...fromPairs(dataValues) };
        // });
    }

    @computed
    get formColumns() {
        if (this.programStages.length > 0) {
            const programStage = this.programStages[0];
            return programStage.programStageDataElements.map(a => {
                const { compulsory: mandatory, dataElement: { valueType } } = a;
                return {
                    title: a.dataElement.name,
                    dataIndex: a.dataElement.id,
                    key: a.dataElement.id,
                    mandatory,
                    valueType,
                    isRelationship: a.dataElement.id === this.relatedDataElement,
                    optionSet: a.dataElement.optionSet
                }
            });
            // return [...columns, {
            //     key: 'assignedUser',
            //     title: 'Assigned to',
            //     mandatory: true,
            //     valueType: '',
            //     optionSet: null,
            //     searchUsers: true
            // }]
        }

        return []
    }

    @computed
    get invertedFormColumns() {
        if (this.programStages.length > 0) {
            const programStage = this.programStages[0];
            const columns = programStage.programStageDataElements.map(a => {
                const { compulsory: mandatory, dataElement: { valueType } } = a;
                return [a.dataElement.id, {
                    title: a.dataElement.name,
                    dataIndex: a.dataElement.id,
                    key: a.dataElement.id,
                    mandatory,
                    valueType: a.dataElement.id === 'lX4Ae98tFFl' ? 'HTML' : valueType,
                    isRelationship: a.dataElement.id === this.relatedDataElement,
                    optionSet: a.dataElement.optionSet
                }]
            });
            return fromPairs(columns);
        }
        return {}
    }

    @action fetchProgramStages = async () => {
        const api = this.d2.Api.getApi();
        try {
            const { programStages } = await api.get(`programs/${this.program}`, {
                fields: 'programStages[id,name,programStageDataElements[id,compulsory,dataElement[id,name,valueType,optionSet[options[name,code]]]]]'
            });
            this.programStages = programStages;
        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
    };

    @action fetchEvents = async () => {
        const api = this.d2.Api.getApi();
        this.loading = true;

        const { headers, rows, metaData: { pager } } = await api.get('events/query.json', {
            includeAllDataElements: true,
            programStage: this.programStages[0].id,
            pageSize: this.pageSize,
            assignedUserMode: 'CURRENT',
            page: 1,
            order: this.sorter,
            totalPages: true
        });

        const changedHeaders = headers.map((h, i) => {
            return { ...h, index: i }
        });

        const events = rows.map(r => {
            return Object.assign.apply({}, changedHeaders.map(v => {
                let val = r[v.index]
                if (String(v.column).toLowerCase().includes('date') && moment(val).isValid()) {
                    val = moment(val).format('YYYY-MM-DD')
                }
                return { [v.name]: val }
            }));
        });

        this.total = pager.total;

        const evs = events.map(e => {
            return api.get('relationships.json', { event: e.event });
        });

        const evs1 = events.map(e => {
            return api.get(`events/${e.event}.json`);
        });


        const result = await Promise.all(evs);
        const result1 = await Promise.all(evs1);

        this.events = events.map((e, i) => {
            const currentEvent = new Event();
            currentEvent.setD2(this.d2);
            currentEvent.setEventData(result1[i]);
            currentEvent.setRelationships(result[i]);
            // currentEvent.setQueryData(e)
            return { ...e, currentEvent };
        });

        this.loading = false;
    };


    @action handleChange = async (pagination, filters, sorter) => {
        this.loading = true;
        const order = sorter.field && sorter.order ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}` : 'created:desc';
        const page = pagination.pageSize !== this.pageSize || order !== this.sorter ? 1 : pagination.current;
        this.sorter = order;
        const api = this.d2.Api.getApi();
        try {
            const { headers, rows, metaData: { pager } } = await api.get('events/query.json', {
                programStage: this.programStages[0].id,
                includeAllDataElements: true,
                totalPages: true,
                pageSize: pagination.pageSize,
                order,
                page
            });

            const changedHeaders = headers.map((h, i) => {
                return { ...h, index: i }
            });

            const events = rows.map(r => {
                return Object.assign.apply({}, changedHeaders.map(v => {
                    let val = r[v.index]
                    if (String(v.column).toLowerCase().includes('date') && moment(val).isValid()) {
                        val = moment(val).format('YYYY-MM-DD')
                    }
                    return { [v.name]: val }
                }));
            });

            const evs = events.map(e => {
                return api.get('relationships.json', { event: e.event });
            });

            const evs1 = events.map(e => {
                return api.get(`events/${e.event}.json`);
            });


            const result = await Promise.all(evs);
            const result1 = await Promise.all(evs1);

            this.events = events.map((e, i) => {
                const currentEvent = new Event();
                currentEvent.setD2(this.d2);
                currentEvent.setEventData(result1[i]);
                currentEvent.setRelationships(result[i]);
                // currentEvent.setQueryData(e)
                return { ...e, currentEvent };
            });
            this.total = pager.total;
            this.pageSize = pager.pageSize;
        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
        this.loading = false;
    };

    @action addProject = async (data) => {
        const api = this.d2.Api.getApi();

        const { organisationUnits, assignedUser, ...others } = data;

        this.loading = true;

        const dataValues = Object.keys(others).map(dataElement => {
            return { dataElement, value: data[dataElement] };
        });

        if (organisationUnits && organisationUnits.length > 0) {
            const events = organisationUnits.map(ou => {
                let event = {
                    event: generateUid(),
                    eventDate: new Date().toISOString(),
                    status: 'COMPLETED',
                    completedDate: new Date().toISOString(),
                    program: this.program,
                    orgUnit: ou,
                    dataValues,
                    programStage: this.programStages[0].id
                }
                if (this.instance) {
                    event = { ...event, trackedEntityInstance: this.instance }
                }
                if (assignedUser) {
                    event = { ...event, assignedUser }
                }
                return event;
            });
            try {
                await api.post('events', { events });
                return events.map(e => e.event)
            } catch (error) {
                console.error("Failed to fetch projects", error);
                this.state = "error";
                return []
            }
        }

        this.loading = false;
    };

    @action setProgram = (program) => this.program = program;
    @action setRelatedProgram = (program) => this.relatedProgram = program;
    @action setRelatedDataElement = (dataElement) => this.relatedDataElement = dataElement;
    @action setInstance = (instance) => this.instance = instance;
    @action setD2 = val => this.d2 = val;
    @action setCurrentEvent = event => this.currentEvent = event;

    @action searchEvent = async (id) => {
        const api = this.d2.Api.getApi();
        const event = await api.get(`events/${id}.json`);
        this.currentEvent.setEventData(event);
    };

    @action addEventRelationShip = async (fromEvents, eve2, relationshipType) => {
        const api = this.d2.Api.getApi();
        this.loading = true;

        try {
            const inserts = fromEvents.map(e => {
                const payload = {
                    relationshipType: relationshipType,
                    from: {
                        event: {
                            event: e
                        }
                    },
                    to: {
                        event: {
                            event: eve2
                        }
                    }
                }
                return api.post('relationships', payload)
            })
            await Promise.all(inserts);
        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
        this.loading = false;
    };

    @action setCurrentEvent = (event) => {
        this.currentEvent = event
    }
}