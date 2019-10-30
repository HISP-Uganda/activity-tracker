import { types } from "mobx-state-tree"

const UI = types
    .model("UI", {
        collapsed: false
    })
    .actions(self => ({
        toggle() {
            self.collapsed = !self.collapsed
        }
    }));

export default UI;
