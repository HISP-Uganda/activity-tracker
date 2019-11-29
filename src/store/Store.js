import { types, flow } from "mobx-state-tree";

import UI from "./model/UI";
import { RouterStore } from '../modules/router';
import { Program, ProgramStage, Row } from "./model/Baylor";


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
        issueDialogOpen: false,
        actionDialogOpen: false,
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

        async function afterCreate() {
        }

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
        })
        return {
            setD2,
            onShowSizeChange,
            afterCreate,
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
            setCurrentRow
        }

    });

