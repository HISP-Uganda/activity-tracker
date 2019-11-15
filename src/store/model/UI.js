import { observable, action } from "mobx";

class UI {
    @observable collapsed = false;

    @action
    toggle = () => {
        this.collapsed = !this.collapsed
    }
}

export default new UI();
