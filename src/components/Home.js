import React from 'react';
import { inject, observer } from "mobx-react";
import { Card } from 'antd';

export const Home = inject("store")(observer(({ store, d2 }) => {
    return (
        <Card>
            Coming soon
        </Card>
    );
}));