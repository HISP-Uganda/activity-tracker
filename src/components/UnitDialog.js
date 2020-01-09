
import { Button } from "antd";
import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import OrgUnitDialog from '@dhis2/d2-ui-org-unit-dialog';

export const UnitDialog = inject("store")(observer(({ store, onUpdate, selected, setSelected }) => {

    const [userOrgUnits, setUserOrgUnits] = useState([]);
    const [group, setGroup] = useState([]);
    const [level, setLevel] = useState([]);


    const onLevelChange = (event) => {
        setLevel(event.target.value);
    };

    const onGroupChange = (event) => {
        setGroup(event.target.value);
    };

    const onDeselectAllClick = () => {
        setSelected([]);
    };

    const handleOrgUnitClick = (event, orgUnit) => {
        if (selected.some(ou => ou.path === orgUnit.path)) {
            setSelected(selected.filter(ou => ou.path !== orgUnit.path));
        } else {
            setSelected([
                ...selected,
                { id: orgUnit.id, displayName: orgUnit.displayName, path: orgUnit.path },
            ]);
        }
    };

    const handleUserOrgUnitClick = (event, checked) => {
        if (checked) {
            setUserOrgUnits([...userOrgUnits, { id: event.target.name }]);
        } else {
            setUserOrgUnits(userOrgUnits.filter(ou => ou.id !== event.target.name));
        }
    };

    const handleMultipleOrgUnitsSelect = (children) => {
        const final = [
            ...selected,
            ...children.map(orgUnit => ({
                id: orgUnit.id,
                displayName: orgUnit.displayName,
                path: orgUnit.path,
            })),
        ];
        setSelected(final);
    };

    const onOrgUnitSelect = () => {
        const selectedOrgUnits = userOrgUnits.length > 0
            ? userOrgUnits
            : selected;
        onUpdate(selectedOrgUnits)
        store.toggleDialog();
    };


    return (
        <div>
            <div >
                <Button ghost size="large" htmlType="button" type="primary" onClick={store.toggleDialog}>
                    Select Activity Sites
                </Button>
            </div>
            {store.root &&
                <OrgUnitDialog
                    open={store.open}
                    root={store.root}
                    d2={store.d2}
                    selected={selected}
                    userOrgUnits={userOrgUnits}
                    level={level}
                    group={group}
                    levelOptions={store.levelOptions}
                    groupOptions={store.groupOptions}
                    onLevelChange={onLevelChange}
                    onGroupChange={onGroupChange}
                    onDeselectAllClick={onDeselectAllClick}
                    handleUserOrgUnitClick={handleUserOrgUnitClick}
                    handleOrgUnitClick={handleOrgUnitClick}
                    handleMultipleOrgUnitsSelect={handleMultipleOrgUnitsSelect}
                    deselectAllTooltipBackgroundColor="#E0E0E0"
                    deselectAllTooltipFontColor="#000000"
                    displayNameProperty={'displayName'}
                    onClose={store.toggleDialog}
                    onUpdate={onOrgUnitSelect}
                    checkboxColor="secondary"
                    maxWidth="lg"
                />
            }
        </div >
    );
}));