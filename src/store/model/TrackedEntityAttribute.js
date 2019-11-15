
import { OptionSet } from './OptionSet';
import { observable } from 'mobx';

export class TrackedEntityAttribute {
    @observable id;
    @observable name;
    @observable unique = false;
    @observable optionSet = new OptionSet()
}