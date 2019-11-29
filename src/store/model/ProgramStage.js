import { observable } from "mobx";

export class ProgramStage {
    @observable id;
    @observable name;
    @observable programStageDataElements = [];

    @observable events = [];
}