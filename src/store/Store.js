import { types, flow } from "mobx-state-tree";
import moment from 'moment';
import UI from "./model/UI";
import { RouterStore } from '../modules/router';
import { Program, ProgramStage, Row, FieldActivity } from "./model/Baylor";
import { fromPairs } from 'lodash';


export const Store = types
    .model("Store", {
        settings: types.optional(UI, {}),
        orgUnit: 'akV6429SUqu',
        router: RouterStore,
        root: types.optional(types.frozen(), {}),
        d2: types.frozen(),
        levelOptions: types.optional(types.array(types.frozen()), []),
        groupOptions: types.optional(types.array(types.frozen()), []),
        open: false,
        users: types.optional(types.array(types.frozen()), []),
        plannedActivity: types.optional(Program, { id: 'lINGRWR9UFx', related: { id: 'dnwNW4Oxz8K' } }),
        activity: types.optional(ProgramStage, { id: 'dnwNW4Oxz8K' }),
        issue: types.optional(ProgramStage, { id: 'qky1qGVPe7e' }),
        action: types.optional(ProgramStage, { id: 'eXOOIxW2cAZ' }),
        report: types.optional(ProgramStage, { id: 'gCp6ffVmx0g' }),
        currentRow: types.optional(Row, {}),
        currentActivity: types.optional(FieldActivity, {}),
        issueDialogOpen: false,
        actionDialogOpen: false,
        sections: types.optional(types.array(types.frozen()), []),
        startDate: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
        endDate: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
        data: types.optional(types.frozen(), []),
        currentLocations:types.optional(types.array(types.string),['10'])
    }).actions(self => {
        const fetchUnits = flow(function* () {
            self.loading = true;
            try {
                const rootLevel = yield self.d2
                    .models
                    .organisationUnit.get('akV6429SUqu', {
                        fields: `id,path,name,level,displayShortName~rename(displayName),children::isNotEmpty`
                    });
                self.root = rootLevel;
                self.selected = [{ id: rootLevel.id, path: rootLevel.path, level: rootLevel.level, displayName: rootLevel.name }]
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });

        const fetchSections = flow(function* () {
            self.loading = true;
            try {
                const api = self.d2.Api.getApi();
                const { programStageSections } = yield api.get('programSections', {
                    fields: 'id,name,sortOrder,dataElements[id,name]',
                    paging: false,
                });
                self.sections = programStageSections
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });

        const toggleDialog = () => {
            self.open = !self.open
        };

        const loadOrgUnitGroups = flow(function* () {
            const collection = yield self.d2
                .models
                .organisationUnitGroups
                .list({
                    fields: `id,displayShortName~rename(displayName)`,
                    paging: false,
                });
            self.groupOptions = collection.toArray();
        });

        const loadOrgUnitLevels = flow(function* () {
            const collection = yield self.d2
                .models
                .organisationUnitLevels
                .list({ paging: false });
            self.levelOptions = collection.toArray();
        });

        const onShowSizeChange = (current, pageSize) => {
            console.log(current, pageSize);
        };

        const setForm = (form) => self.form = form;
        const setCurrentProgram = (program) => self.currentProgram = program;
        const setCurrentTracker = (program) => self.currentTracker = program;
        const showIssueDialog = () => self.issueDialogOpen = true;
        const hideIssueDialog = () => self.issueDialogOpen = false;
        const showActionDialog = () => self.actionDialogOpen = true;
        const hideActionDialog = () => self.actionDialogOpen = false;
        const setCurrentRow = (row) => self.currentRow = row;
        const setCurrentLocations = (row) => self.currentLocations = row;

        const setD2 = (d2) => {
            self.d2 = d2
        };


        const searchUsers = flow(function* (search) {
            if (search && search !== '') {
                const api = self.d2.Api.getApi();
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
            } else {
                self.users = []
            }
        });

        const fetchCurrentActivity = flow(function* (code) {
            const api = self.d2.Api.getApi();
            self.loading = true;
            try {
                const { listGrid: { rows } } = yield api.get('sqlViews/cQkRtgHShh1/data.json', {
                    paging: false,
                    var: `code:${code}`
                });
                self.currentActivity = {
                    transactionCode: rows[0][1],
                    attributes: rows[0][2].value
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });
        const queryInstances = flow(function* (query) {
            const api = self.d2.Api.getApi();
            self.loading = true;
            try {
                const { rows } = yield api.get('trackedEntityInstances/query.json', {
                    paging: false,
                    program: 'lINGRWR9UFx',
                    query: `LIKE:${query}`,
                    ouMode: 'ALL'
                });
                if (rows.length > 0) {
                    const { trackedEntityInstances } = yield api.get('trackedEntityInstances', {
                        paging: false,
                        fields: '*',
                        program: 'lINGRWR9UFx',
                        trackedEntityInstance: rows.map(r => r[0]).join(';'),
                        ouMode: 'ALL'
                    });
                    self.data = trackedEntityInstances.map(({ attributes, enrollments, ...rest }) => {
                        attributes = fromPairs(attributes.map(a => [a.displayName, a.value]))
                        const { events } = enrollments[0];
                        const foundEvent = events.find(e => e.programStage === 'gCp6ffVmx0g');
                        let event = {};
                        if (foundEvent) {
                            event = fromPairs(foundEvent.dataValues.map(dv => [dv.dataElement, dv.value]));
                        }
                        return { ...rest, ...attributes, ...event };

                    });
                } else {
                    self.data = [];
                }

            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });
        const fetchInstances = flow(function* () {
            const api = self.d2.Api.getApi();
            self.loading = true;
            try {
                const { trackedEntityInstances } = yield api.get('trackedEntityInstances', {
                    paging: false,
                    fields: '*',
                    program: 'lINGRWR9UFx',
                    filter: `eN9jthkmMds:GE:${self.startDate}&filter=pyQEzpRRcqH:LE:${self.endDate}`,
                    ouMode: 'ALL'
                });
                self.data = trackedEntityInstances.map(({ attributes, enrollments, ...rest }) => {
                    attributes = fromPairs(attributes.map(a => [a.displayName, a.value]))
                    const { events } = enrollments[0];
                    const foundEvent = events.find(e => e.programStage === 'gCp6ffVmx0g');
                    let event = {};
                    if (foundEvent) {
                        event = fromPairs(foundEvent.dataValues.map(dv => [dv.dataElement, dv.value]));
                    }
                    return { ...rest, ...attributes, ...event };

                });
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });

        const searchInstances = flow(function* (field, value) {
            const api = self.d2.Api.getApi();
            self.loading = true;
            try {
                const { trackedEntityInstances } = yield api.get('trackedEntityInstances', {
                    paging: false,
                    fields: '*',
                    program: 'lINGRWR9UFx',
                    filter: `${field}:EQ:${value}`,
                    ouMode: 'ALL'
                });
                self.data = trackedEntityInstances.map(({ attributes, enrollments, ...rest }) => {
                    attributes = fromPairs(attributes.map(a => [a.displayName, a.value]))
                    const { events } = enrollments[0];
                    const foundEvent = events.find(e => e.programStage === 'gCp6ffVmx0g');
                    let event = {};
                    if (foundEvent) {
                        event = fromPairs(foundEvent.dataValues.map(dv => [dv.dataElement, dv.value]));
                    }
                    return { ...rest, ...attributes, ...event };

                });
            } catch (error) {
                console.error("Failed to fetch projects", error);
                self.state = "error"
            }
            self.loading = false;
        });
        const setCurrentActivity = val => self.currentActivity = val;
        const setDates = val => {
            self.startDate = val[0];
            self.endDate = val[1]
        }
        return {
            setD2,
            onShowSizeChange,
            setForm,
            setCurrentProgram,
            setCurrentTracker,
            fetchUnits,
            toggleDialog,
            loadOrgUnitGroups,
            loadOrgUnitLevels,
            searchUsers,
            showIssueDialog,
            hideIssueDialog,
            showActionDialog,
            hideActionDialog,
            setCurrentRow,
            fetchCurrentActivity,
            setCurrentActivity,
            fetchSections,
            fetchInstances,
            setDates,
            queryInstances,
            searchInstances,
            setCurrentLocations
        }

    });

