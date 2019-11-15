import { observable } from "mobx";

export class Attribute {
    @observable attribute;
    @observable value = '';
}