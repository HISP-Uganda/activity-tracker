import React from 'react';

import { View } from '../modules/router';
import { getParent } from 'mobx-state-tree'
import shortid from 'shortid';

//components
import {
    Home,
    PlannedActivity,
    PlannedActivityForm,
    Activity,
    IssueForm,
    ActivityDetails,
    Issue,
} from '../components';
import { FieldActivity } from '../store/model/Baylor';

const views = {
    home: View.create({
        path: '/',
        name: 'home',
        component: <Home />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                p.setCurrentLocations(['10'])
                await getParent(self.router).fetchInstances();
            }
        }
    }),
    plannedActivity: View.create({
        path: '/planned-activities',
        name: 'plannedActivity',
        component: <PlannedActivity />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                p.setCurrentLocations(['1'])
                await getParent(self.router).plannedActivity.fetchAttributes();
            }
        }
    }),
    plannedActivityForm: View.create({
        path: '/planned-activities/add',
        name: 'plannedActivityForm',
        component: <PlannedActivityForm />,
        hooks: {
            beforeEnter(self, params) {
                const p = getParent(self.router);
                p.plannedActivity.setHidden(['GeIEoCBrKaW', 'XdmZ9lk11i4']);
                p.setCurrentLocations(['1'])
                const r = FieldActivity.create({ transactionCode: shortid.generate() })
                p.setCurrentActivity(r);
            }
        }
    }),
    editPlannedActivity: View.create({
        path: '/planned-activities/:instance',
        name: 'editPlannedActivity',
        component: <PlannedActivityForm />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                p.setCurrentLocations(['1'])
                p.plannedActivity.setHidden(['GeIEoCBrKaW', 'XdmZ9lk11i4']);
                const r = FieldActivity.create({ transactionCode: params.instance })
                p.setCurrentActivity(r);
                await p.currentActivity.fetchTrackedInstances();
            }
        }
    }),
    activity: View.create({
        path: '/activity',
        name: 'activity',
        component: <Activity />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                p.setCurrentLocations(['sub1','9'])
                await p.activity.fetchEvents();
            }
        }
    }),
    activityDetails: View.create({
        path: '/activity-details/:instance',
        name: 'activityDetails',
        component: <ActivityDetails />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                p.setCurrentLocations(['1'])
                p.report.setHidden(['yxGmEyvPfwl']);
                p.issue.setHidden(['b3KvFkSwZLn']);
                const r = FieldActivity.create({ transactionCode: params.instance })
                p.setCurrentActivity(r);
                await p.currentActivity.fetchTrackedInstances();
                await p.issue.fetchMetadata();
            }
        }
    }),
    issues: View.create({
        path: '/issues',
        name: 'issues',
        component: <Issue />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                p.setCurrentLocations(['11'])
                p.issue.setHidden(['b3KvFkSwZLn']);
                await p.issue.fetchRawEvents();
            }
        }
    }),
    issueForm: View.create({
        path: '/issues/add',
        name: 'issueForm',
        component: <IssueForm />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                p.issue.setHidden(['b3KvFkSwZLn']);
                await p.issue.fetchRawEvents();
            }
        }
    }),
};
export default views;