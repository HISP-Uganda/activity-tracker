import { DataElement } from "./DataElement"
import { observable } from "mobx";

export class ProgramStageDataElement {
    @observable id;
    @observable compulsory = false;
    @observable dataElement = new DataElement()
}
