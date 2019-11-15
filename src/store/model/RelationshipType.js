import { observable, action } from "mobx";
import { unionBy } from 'lodash'
export class RelationshipType {
    @observable id;
    @observable name = '';
    @observable toFromName = '';
    @observable fromToName = '';
    @observable fromConstraint = {};
    @observable toConstraint = {};
    @observable events = [];
    @observable d2;

    @observable selected;

    constructor(id, name, fromToName, toFromName, fromConstraint, toConstraint, d2) {
        this.id = id;
        this.name = name;
        this.fromToName = fromToName;
        this.toFromName = toFromName;
        this.fromConstraint = fromConstraint;
        this.toConstraint = toConstraint;
        this.d2 = d2;
    }

    @action searchEvents = async (search) => {
        if (search && search !== '') {
            const api = this.d2.Api.getApi();
            const searchByName = api.get('events/query.json', {
                filter: `cIfzworL5Kj:LIKE:${search}`,
                includeAllDataElements: true,
                programStage: this.toConstraint.program.programStages[0].id,
                paging: true,
                pageSize: 25,
                page: 1,
                totalPages: false
            });

            const searchByCode = api.get('events/query.json', {
                filter: `UeKCu1x6gC1:LIKE:${search}`,
                includeAllDataElements: true,
                programStage: this.toConstraint.program.programStages[0].id,
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
                    const { cIfzworL5Kj, UeKCu1x6gC1, ...rest } = Object.assign.apply({}, headers.map(v => ({
                        [v.name]: r[v.index]
                    })));
                    return { ...rest, name: `${UeKCu1x6gC1} - ${cIfzworL5Kj}` }
                });
                return found
            });
            this.events = unionBy(final[0], final[1], 'event');
        } else {
            this.events = []
        }
    };

    @action setSelected = val => {
        this.selected = this.events.find(event => event.event === val);
    }
}