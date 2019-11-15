import { fromPairs } from 'lodash'
import { action, computed, observable } from "mobx";

export class TrackedEntityInstance {
    @observable trackedEntityInstance;
    @observable enrollments;
    @observable orgUnit;
    @observable trackedEntityType;
    @observable attributes;
}

export class TrackedEntityInstanceStore {
    @observable program;
    @observable trackedEntityInstances = [];
    @observable page = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable loading = false;
    @observable attributes = [];
    @observable programStages = [];
    @observable sorter = 'created:desc';
    @observable selectedUnits = [];
    @observable currentInstance;
    @observable d2;
    @observable trackedEntityType = 'LjAGxhyu3Ex';
    constructor(program) {
        this.setProgram(program);
    }

    @computed
    get data() {
        return this.trackedEntityInstances.map(({ attributes, enrollments, relationships, ...rest }) => {
            const attr = fromPairs(attributes.map(a => {
                return [a.attribute, a.value]
            }));
            const { events } = enrollments[0];

            const e = events.map(({ dataValues, ...rest }) => {
                const values = fromPairs(dataValues.map(d => [d.dataElement, d.value]));
                return { ...rest, ...values }
            })
            const color = attributes['qxnGOCHbKAS'] === 'New' ? 'yellow' : 'red'
            return { ...rest, ...attr, color, events: e }
        });
    }

    @computed
    get attributeColumns() {
        return this.headers.filter(r => {
            const attributes = this.attributes.map(a => a.trackedEntityAttribute.id);
            return attributes.indexOf(r.name) !== -1
        });
    }

    @computed
    get dataElementColumns() {
        if (this.programStages.length > 0) {
            const programStage = this.programStages[0];
            const columns = programStage.programStageDataElements.map(a => {
                const { compulsory: mandatory, dataElement: { valueType } } = a;
                return {
                    title: a.dataElement.name,
                    dataIndex: a.dataElement.id,
                    key: a.dataElement.id,
                    mandatory,
                    valueType: valueType,
                    isRelationship: a.dataElement.id === this.relatedDataElement,
                    optionSet: a.dataElement.optionSet
                }
            });

            return [...columns, {
                key: 'assignedUser',
                title: 'Assigned to',
                mandatory: true,
                valueType: '',
                optionSet: null,
                searchUsers: true
            }]
        }

        return []
    }

    @computed
    get formColumns() {
        return this.attributes.map(a => {
            const { mandatory, valueType } = a;
            return {
                key: a.trackedEntityAttribute.id,
                title: a.trackedEntityAttribute.name,
                dataIndex: a.trackedEntityAttribute.id,
                mandatory,
                valueType,
                optionSet: a.trackedEntityAttribute.optionSet
            }
        })

        // return [...columns, {
        //     key: 'assignedUser',
        //     title: 'Assigned to',
        //     mandatory: true,
        //     valueType: '',
        //     optionSet: null,
        //     searchUsers: true
        // }]
    }

    @computed
    get stageColumns() {
        return this.currentInstance.eventStore.columns
    }

    @computed
    get columns() {
        return this.formColumns;
        // return [
        //     ...this.formColumns,
        //     {
        //         title: 'Actions',
        //         render: (text, record) => {
        //             const menu = (
        //                 <Menu>
        //                     <Menu.Item key="1" onClick={() => this.setCurrentInstance(record)}>
        //                         {/* <Link router={this.store.router} view={views.activity} params={{ activity: record.instance }}> */}
        //                         <Icon type="user" />
        //                         1st menu item {record.color}
        //                         {/* </Link> */}
        //                     </Menu.Item>
        //                     <Menu.Item key="2">
        //                         <Link router={this.store.router} view={views.activities}>
        //                             <Icon type="user" />
        //                             <Icon type="user" />
        //                             2nd menu item
        //                             </Link>
        //                     </Menu.Item>
        //                     <Menu.Item key="3">
        //                         <Link router={this.store.router} view={views.activities}>
        //                             <Icon type="user" />
        //                             <Icon type="user" />
        //                             3rd item
        //                             </Link>
        //                     </Menu.Item>
        //                 </Menu>
        //             )
        //             return <Dropdown overlay={menu}>
        //                 <Icon type="more" style={{ fontSize: '24px' }} />
        //             </Dropdown>
        //         }
        //     }
        // ]
    }


    @action fetchTrackedEntityInstances = async () => {
        const api = this.d2.Api.getApi();
        this.loading = true;
        try {
            const { trackedEntityInstances, pager: { total } } = await api.get('trackedEntityInstances.json', {
                program: this.program,
                totalPages: true,
                pageSize: this.pageSize,
                order: this.sorter,
                ouMode: 'ALL',
                fields: '*'
            });
            this.total = total;
            this.trackedEntityInstances = trackedEntityInstances
        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
        this.loading = false;
    };

    @action fetchTrackedSpecificEntityInstances = async (instances) => {
        const api = this.d2.Api.getApi();
        this.loading = true;
        try {
            const { trackedEntityInstances } = await api.get('trackedEntityInstances.json', {
                program: this.program,
                trackedEntityInstances: instances,
                fields: '*'
            });

            this.trackedEntityInstances = trackedEntityInstances

        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
        this.loading = false;
    };

    @action findData = async (activity) => {
        const api = this.d2.Api.getApi();
        try {
            const { dataValues } = await api.get(`events/${activity}.json`, {});

            const activities = fromPairs(dataValues.map(d => {
                return [d.dataElement, d.value]
            }));

            const { dataValues: data } = await api.get(`events/${activities['Cwu1KVVPMzp']}.json`, {});

            const resultAreas = fromPairs(data.map(d => {
                return [d.dataElement, d.value]
            }));

            const { dataValues: data1 } = await api.get(`events/${resultAreas['Z0oFe9Y0AkF']}.json`, {});

            const objectives = fromPairs(data1.map(d => {
                return [d.dataElement, d.value]
            }));
            const { dataValues: data2 } = await api.get(`events/${objectives['fWpwKdGRp9r']}.json`, {});

            const projects = fromPairs(data2.map(d => {
                return [d.dataElement, d.value]
            }));

            this.otherData = {
                R6fQYmqE2a7: projects['UeKCu1x6gC1'],
                IvU5WlAUioy: objectives['UeKCu1x6gC1'],
                jfB1imcdlXr: resultAreas['UeKCu1x6gC1'],
                aZuLz2kDasY: activities['UeKCu1x6gC1'],
                cyEYXCpq7iK: activities['cIfzworL5Kj']
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
    };


    @action addTrackedEntityInstance = async (data) => {
        const api = this.d2.Api.getApi();

        this.loading = true;

        const { organisationUnits, activity, trackedEntityInstance, enrollment, events, ...others } = data;

        const attributes = Object.keys(others).map(attribute => {
            return { attribute, value: data[attribute] };
        });

        console.log(others);

        const date = new Date().toISOString()

        const trackedEntityInstances = organisationUnits.map(orgUnit => {
            let currentEnrollment = {
                orgUnit,
                program: this.program,
                enrollmentDate: date,
                incidentDate: date
            }
            if (enrollment) {
                currentEnrollment = { ...currentEnrollment, enrollment }
            }
            let tei = {
                orgUnit,
                trackedEntityType: this.trackedEntityType,
                attributes,
                enrollments: [currentEnrollment]
            }

            if (trackedEntityInstance) {
                tei = { ...tei, trackedEntityInstance }
            }
            return tei;
        });

        try {
            await api.post('trackedEntityInstances', { trackedEntityInstances });
        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error";

        }
        this.loading = false;
    };

    @action fetchAttributes = async () => {
        const api = this.d2.Api.getApi();

        try {
            const { programTrackedEntityAttributes, programStages } = await api.get(`programs/${this.program}`, {
                fields: 'programTrackedEntityAttributes[mandatory,valueType,trackedEntityAttribute[id,name,unique,optionSet[options[name,code]]]],programStages[id,name,programStageDataElements[id,compulsory,dataElement[id,name,valueType,optionSet[options[name,code]]]]]'
            });
            this.attributes = programTrackedEntityAttributes;
            this.programStages = programStages;
        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
    };

    @action handleChange = async (pagination, filters, sorter) => {
        this.loading = true;
        const order = sorter.field && sorter.order ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}` : 'created:desc';
        const page = pagination.pageSize !== this.pageSize || order !== this.sorter ? 1 : pagination.current;
        this.sorter = order;
        const api = this.d2.Api.getApi();
        try {
            const { trackedEntityInstances, pager: { total, pageSize } } = await api.get('trackedEntityInstances.json', {
                program: this.program,
                totalPages: true,
                pageSize: pagination.pageSize,
                order,
                page,
                ouMode: 'ALL',
                fields: '*'
            });
            this.total = total;
            this.pageSize = pageSize;
            this.trackedEntityInstances = trackedEntityInstances

        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
        this.loading = false;
    };

    @action setProgram = (program) => this.program = program;
    @action setSelectedUnits = (units) => this.selectedUnits = units;
    @action setD2 = val => this.d2 = val;
    @action addInstance = (instance) => {
        const found = this.trackedEntityInstances.find(i => {
            return i.instance === instance.instance;
        })

        if (!found) {
            this.trackedEntityInstances = [...this.trackedEntityInstances, instance];
        }

    }
    @action setCurrentInstance = (instance) => {
        //this.currentInstance =this.trackedEntityInstances.find(i => i.instance === instance.instance);
        //this.store.router.setView(views.activity, { activity: instance.instance })
        this.currentInstance = instance
    }

    @action setDetails = async (instance) => {
        this.addInstance(instance);

        const found = this.trackedEntityInstances.find(i => {
            return i.instance === instance.instance;
        });
        this.setCurrentInstance(found);
        this.currentInstance.setProgram(this.program);
        this.currentInstance.setEventStore();
        await this.currentInstance.eventStore.fetchProgramStages();
        await this.currentInstance.eventStore.fetchEvents();
    }

    @action setTrackedEntityInstances = trackedEntityInstances => {
        this.trackedEntityInstances = trackedEntityInstances
    }

    @action
    updateDHISEvents = async (event, data) => {
        const api = this.d2.Api.getApi();
        const calls = Object.entries(data).map(ev => {
            const dataElement = ev[0];
            // const value = ev[1];
            return api.update('events/' + event.event + '/' + dataElement, ev.event, {})
        })
    };

    @action addEvent = async (data) => {
        const api = this.d2.Api.getApi();

        const { orgUnit, assignedUser, activity, trackedEntityInstance, enrollment, events, ...others } = data;
        this.loading = true;

        const dataValues = Object.keys(others).map(dataElement => {
            return { dataElement, value: data[dataElement] };
        });

        let event = {
            eventDate: new Date().toISOString(),
            status: 'COMPLETED',
            completedDate: new Date().toISOString(),
            program: this.program,
            orgUnit,
            dataValues,
            trackedEntityInstance,
            programStage: this.programStages[0].id
        }
        try {
            await api.post('events', event);
        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
        this.loading = false;
    };
}

