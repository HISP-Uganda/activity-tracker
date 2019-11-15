import { types, flow } from "mobx-state-tree";
import {
    TrackedEntityInstanceStore,
    EventStore
} from "./model/Baylor";

import UI from "./model/UI";
import { RouterStore } from '../modules/router';


export const Store = types
    .model("Store", {
        settings: types.optional(UI, {}),
        activityStore: types.optional(EventStore, { program: 'EClplZ6Jvlt' }),
        issueStore: types.optional(TrackedEntityInstanceStore, { program: 'p12qwBMhK3c' }),
        orgUnit: 'n9tHvdgBOsE',
        projectStore: types.optional(EventStore, { program: 'TTg5i4JO3U6' }),
        objectiveStore: types.optional(EventStore, { program: 'nqnAO1d0ilV', relatedDataElement: 'fWpwKdGRp9r' }),
        resultAreaStore: types.optional(EventStore, { program: 'lfBEzT9gvOW', relatedDataElement: 'Z0oFe9Y0AkF' }),
        outputStore: types.optional(EventStore, { program: 'FCs73yoYfWp', relatedDataElement: 'fWpwKdGRp9r' }),
        activityDataStore: types.optional(EventStore, { program: 'yAYNtTb7B03', relatedDataElement: 'Cwu1KVVPMzp' }),
        router: RouterStore,
        form: types.optional(types.array(types.frozen()), []),
        currentProgram: types.maybe(types.reference(types.late(() => EventStore))),
        currentTracker: types.maybe(types.reference(types.late(() => TrackedEntityInstanceStore))),
        root: types.optional(types.frozen(), {}),
        d2: types.frozen(),
        levelOptions: types.optional(types.array(types.frozen()), []),
        groupOptions: types.optional(types.array(types.frozen()), []),
        open: false,
        users: types.optional(types.array(types.frozen()), []),
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

        function afterCreate() {
            self.resultAreaStore.setRelatedProgram(self.objectiveStore);
            self.objectiveStore.setRelatedProgram(self.projectStore);
            self.activityDataStore.setRelatedProgram(self.resultAreaStore);
            self.outputStore.setRelatedProgram(self.projectStore);
            self.activityStore.setRelatedProgram(self.activityDataStore);
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
            searchUsers
        }

    });

