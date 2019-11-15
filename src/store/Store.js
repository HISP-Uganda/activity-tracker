import { TrackedEntityInstanceStore } from "./model/TrackedEntityInstance";
import { EventStore } from "./model/Event";
import UI from "./model/UI";
import { observable, action, extendObservable } from "mobx";
import { merge, fromPairs } from 'lodash'
import { RelationshipType } from "./model/RelationshipType";
class Store {
    @observable settings = UI;
    @observable activityStore = new EventStore('EClplZ6Jvlt');
    @observable actionStore = new EventStore('p12qwBMhK3c');
    @observable issueStore = new TrackedEntityInstanceStore('p12qwBMhK3c');
    @observable orgUnit = 'n9tHvdgBOsE';
    @observable projectStore = new EventStore('TTg5i4JO3U6');
    @observable objectiveStore = new EventStore('nqnAO1d0ilV');
    @observable resultAreaStore = new EventStore('lfBEzT9gvOW');
    @observable outputStore = new EventStore('FCs73yoYfWp');
    @observable activityDataStore = new EventStore('yAYNtTb7B03');
    @observable form = []
    @observable currentProgram;
    @observable currentTracker
    @observable root = {}
    @observable d2
    @observable levelOptions = []
    @observable groupOptions = []
    @observable open = false;
    @observable users = [];
    @observable url = '/';

    @observable relationshipTypes = [];

    @action fetchUnits = async () => {
        this.loading = true;
        try {
            const rootLevel = await this.d2
                .models
                .organisationUnit.get('akV6429SUqu', {
                    fields: `id,path,name,level,displayShortName~rename(displayName),children::isNotEmpty`
                });
            this.root = rootLevel;
            this.selected = [{ id: rootLevel.id, path: rootLevel.path, level: rootLevel.level, displayName: rootLevel.name }]
        } catch (error) {
            console.error("Failed to fetch projects", error);
            this.state = "error"
        }
        this.loading = false;
    };

    @action toggleDialog = () => {
        this.open = !this.open
    };

    @action loadOrgUnitGroups = async () => {
        const collection = await this.d2
            .models
            .organisationUnitGroups
            .list({
                fields: `id,displayShortName~rename(displayName)`,
                paging: false,
            });

        this.groupOptions = collection.toArray();
    }

    @action loadOrgUnitLevels = async () => {
        const collection = await this.d2
            .models
            .organisationUnitLevels
            .list({ paging: false });
        this.levelOptions = collection.toArray();
    };

    @action onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    };

    @action setForm = (form) => this.form = form;
    @action setCurrentProgram = (program) => this.currentProgram = program;
    @action setCurrentTracker = (program) => this.currentTracker = program;
    @action setRouter = (router) => this.router = router;
    @action setUrl = (url) => this.url = url;

    @action setD2 = (d2) => {
        this.d2 = d2;
        this.activityStore.setD2(d2);
        this.issueStore.setD2(d2);
        this.projectStore.setD2(d2);
        this.outputStore.setD2(d2);
        this.resultAreaStore.setD2(d2);
        this.activityDataStore.setD2(d2);
        this.objectiveStore.setD2(d2);
        this.actionStore.setD2(d2)
    };

    @action searchUsers = async (search) => {
        if (search && search !== '') {
            const api = this.d2.Api.getApi();
            const { users } = await api.get('users', {
                fields: 'displayName,id,userCredentials[username]',
                paging: true,
                pageSize: 25,
                page: 1,
                totalPages: false,
                query: search
            });

            this.users = users.map(u => {
                return {
                    id: u.id,
                    displayName: `${u.displayName} (${u.userCredentials.username})`
                }
            });
        } else {
            this.users = []
        }
    };

    @action searchEvents = async (search, programStage) => {
        if (search && search !== '') {
            const api = this.d2.Api.getApi();

            const searchByName = api.get('events/query.json', {
                filter: `cIfzworL5Kj:LIKE:${search}`,
                includeAllDataElements: true,
                programStage,
                paging: true,
                pageSize: 25,
                page: 1,
                totalPages: false
            });

            const searchByCode = api.get('events/query.json', {
                filter: `UeKCu1x6gC1:LIKE:${search}`,
                includeAllDataElements: true,
                programStage,
                paging: true,
                pageSize: 25,
                page: 1,
                totalPages: false
            });
            const result = await Promise.all([searchByName, searchByCode]);

            const final = result.map(r => {
                const headers = r.headers.map((h, i) => {
                    return { ...h, index: i }
                });
                const found = r.rows.map(r => {
                    const { event, cIfzworL5Kj, UeKCu1x6gC1 } = Object.assign.apply({}, headers.map(v => ({
                        [v.name]: r[v.index]
                    })));
                    return { event, name: `${UeKCu1x6gC1} - ${cIfzworL5Kj}` }
                });
                return found
            });
            return merge(final[0], final[1]);
        }
        return []
    };

    @action fetchRelationships = async () => {
        const api = this.d2.Api.getApi();
        const { relationshipTypes } = await api.get('relationshipTypes.json', {
            fields: 'id,name,fromToName,toFromName,fromConstraint,toConstraint[relationshipEntity,trackedEntityType,program[id,programStages]]',
            paging: false
        });

        const relationships = relationshipTypes.filter(r => {
            return r.fromConstraint.program.id === this.activityStore.program
        }).map(({ id, name, fromToName, toFromName, fromConstraint, toConstraint }) => {
            return [fromToName, new RelationshipType(id, name, fromToName, toFromName, fromConstraint, toConstraint, this.d2)]
        });

        const objectiveRelationships = relationshipTypes.filter(r => {
            return r.fromConstraint.program.id === this.objectiveStore.program
        }).map(({ id, name, fromToName, toFromName, fromConstraint, toConstraint }) => {
            return [fromToName, new RelationshipType(id, name, fromToName, toFromName, fromConstraint, toConstraint, this.d2)]
        });

        const resultAreaRelationships = relationshipTypes.filter(r => {
            return r.fromConstraint.program.id === this.resultAreaStore.program
        }).map(({ id, name, fromToName, toFromName, fromConstraint, toConstraint }) => {
            return [fromToName, new RelationshipType(id, name, fromToName, toFromName, fromConstraint, toConstraint, this.d2)]
        });

        const activityDataRelationships = relationshipTypes.filter(r => {
            return r.fromConstraint.program.id === this.activityDataStore.program
        }).map(({ id, name, fromToName, toFromName, fromConstraint, toConstraint }) => {
            return [fromToName, new RelationshipType(id, name, fromToName, toFromName, fromConstraint, toConstraint, this.d2)]
        });

        // const outputRelationships = relationshipTypes.filter(r => {
        //     return r.fromConstraint.program.id === this.outputStore.program
        // }).map(({ id, name, fromToName, toFromName, fromConstraint, toConstraint }) => {
        //     return [fromToName, new RelationshipType(id, name, fromToName, toFromName, fromConstraint, toConstraint, this.d2)]
        // });
        extendObservable(this.activityStore, fromPairs(relationships))
        extendObservable(this.objectiveStore, fromPairs(objectiveRelationships))
        extendObservable(this.resultAreaStore, fromPairs(resultAreaRelationships))
        extendObservable(this.activityDataStore, fromPairs(activityDataRelationships))
        // extendObservable(this.outputStore, fromPairs(outputRelationships))
    };
}


export default new Store();
