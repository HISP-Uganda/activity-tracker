import { OptionSet } from "./OptionSet";
import { observable } from "mobx";

export class DataElement {
    @observable id;
    @observable name;
    @observable optionSet = new OptionSet();
    @observable valueType;
}