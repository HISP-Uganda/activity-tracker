import { observable } from "mobx";
import { TrackedEntityAttribute } from './TrackedEntityAttribute'
export class ProgramTrackedEntityAttribute {
    @observable trackedEntityAttribute = new TrackedEntityAttribute()
    @observable valueType;
    @observable mandatory = false;
}