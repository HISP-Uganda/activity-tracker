import { observable } from "mobx";
export class Enrollment {
    @observable enrollment;
    @observable orgUnit;
    @observable program;
    @observable enrollmentDate;
    @observable incidentDate;
    @observable created;
    @observable trackedEntityType;
    @observable events = []
}