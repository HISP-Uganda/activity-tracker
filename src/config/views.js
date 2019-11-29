import React from 'react';

//models
import { View } from '../modules/router';
import { getParent } from 'mobx-state-tree'

//components
import {
    Home,
    PlannedActivity,
    PlannedActivityForm,
    Activity,
    ActivityForm,
    ActivityDetails,
    Action,
    Issue,
    Report
} from '../components';
import { Row } from '../store/model/Baylor';



const views = {
    home: View.create({
        path: '/',
        name: 'home',
        component: <Home />
    }),
    plannedActivity: View.create({
        path: '/planned-activities',
        name: 'plannedActivity',
        component: <PlannedActivity />,
        hooks: {
            async beforeEnter(self, params) {
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
                p.plannedActivity.setHidden(['le0A6qC3Oap', 'GeIEoCBrKaW'])
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
                await p.activity.fetchEvents();
            }
        }
    }),
    activityForm: View.create({
        path: '/activity/add',
        name: 'activityForm',
        component: <ActivityForm />
    }),


    activityDetails: View.create({
        path: '/activity-details/:instance',
        name: 'activityDetails',
        component: <ActivityDetails />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                p.report.setHidden(['yxGmEyvPfwl']);
                p.plannedActivity.setCurrentInstance(params.instance);
                const r = Row.create({ data: [params.instance] })
                p.setCurrentRow(r);
                await p.currentRow.fetchEvents();
                await p.issue.fetchMetadata();
                p.report.setInstance(params.instance);
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
                await p.issue.fetchEvents();
            }
        }
    }),
    actions: View.create({
        path: '/actions',
        name: 'actions',
        component: <Action />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                await p.action.fetchEvents();
            }
        }
    }),
    reports: View.create({
        path: '/reports',
        name: 'reports',
        component: <Report />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                await p.report.fetchEvents();
            }
        }
    })
};
export default views;