import React from 'react';

//models
import { View } from '../modules/router';

//components
import { Home } from '../components/Home';
import { Issue } from "../components/Issue";
import { Activity } from "../components/Activity";
import { Action } from "../components/Action";
import { getParent } from "mobx-state-tree";
import { ActivityData } from "../components/ActivityData";
import { Output } from "../components/Output";
import { Objective } from "../components/Objective";
import { Project } from "../components/Project";
import { ResultArea } from "../components/ResultArea";
import { Report } from '../components/Report';
import { ActivityForm } from '../components/forms/ActivityForm';
import { ProjectForm } from '../components/forms/ProjectForm';
import { ReportDetails } from '../components/ActivityDetails';


const views = {
    home: View.create({
        path: '/',
        name: 'home',
        component: <Home />
    }),
    activities: View.create({
        path: '/activities',
        name: 'activities',
        component: <Activity />,
        hooks: {
            async beforeEnter(self, params) {
                await getParent(self.router).activityStore.fetchAttributes();
                await getParent(self.router).activityStore.fetchTrackedEntityInstances();
            }
        }
    }),
    activity: View.create({
        path: '/activities/details/:activity',
        name: 'activity',
        component: <ReportDetails />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                const a = p.activityStore;
                p.setCurrentTracker(a);
                await a.currentInstance.eventStore.fetchProgramStages()
                await a.currentInstance.eventStore.fetchEvents()
            }
        }
    }),
    activityForm: View.create({
        path: '/activities/add',
        name: 'activityForm',
        component: <ActivityForm />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                const a = p.activityStore;
                await a.fetchAttributes();
                await p.activityDataStore.fetchEvents()
                p.setCurrentTracker(a)
            }
        }

    }),
    issues: View.create({
        path: '/issues',
        name: 'issues',
        component: <Issue />,
        hooks: {
            async beforeEnter(self, params) {
                await getParent(self.router).issueStore.fetchAttributes();
                await getParent(self.router).issueStore.fetchTrackedEntityInstances();
            }
        }
    }),
    actions: View.create({
        path: '/actions',
        name: 'actions',
        component: <Action />,
    }),
    reports: View.create({
        path: '/reports',
        name: 'reports',
        component: <Report />,
    }),
    activityData: View.create({
        path: '/activity-data',
        name: 'activityData',
        component: <ActivityData />,
        hooks: {
            async beforeEnter(self, params) {
                await getParent(self.router).activityDataStore.fetchProgramStages();
                await getParent(self.router).activityDataStore.fetchEvents();
            }
        }
    }),
    activityDataForm: View.create({
        path: '/activity-data/add',
        name: 'activityDataForm',
        component: <ProjectForm />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                const a = p.activityDataStore;
                await a.fetchProgramStages();
                await a.relatedProgram.fetchProgramStages();
                await a.relatedProgram.fetchEvents();
                p.setCurrentProgram(a)
            }
        }
    }),
    outputs: View.create({
        path: '/outputs',
        name: 'outputs',
        component: <Output />,

        hooks: {
            async beforeEnter(self, params) {
                await getParent(self.router).outputStore.fetchProgramStages();
                await getParent(self.router).outputStore.fetchEvents();
            }
        }
    }),
    outputForm: View.create({
        path: '/outputs/add',
        name: 'outputForm',
        component: <ProjectForm />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                const a = p.outputStore;
                await a.fetchProgramStages();
                await a.relatedProgram.fetchProgramStages();
                await a.relatedProgram.fetchEvents();
                p.setCurrentProgram(a)
            }
        }
    }),
    objectives: View.create({
        path: '/objectives',
        name: 'objectives',
        component: <Objective />,
        hooks: {
            async beforeEnter(self, params) {
                await getParent(self.router).objectiveStore.fetchProgramStages();
                await getParent(self.router).objectiveStore.fetchEvents();
            }
        }
    }),
    objectiveForm: View.create({
        path: '/objectives/add',
        name: 'objectiveForm',
        component: <ProjectForm />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                const a = p.objectiveStore;
                await a.fetchProgramStages();
                await a.relatedProgram.fetchProgramStages();
                await a.relatedProgram.fetchEvents();
                p.setCurrentProgram(a)
            }
        }
    }),
    projects: View.create({
        path: '/projects',
        name: 'projects',
        component: <Project />,
        hooks: {
            async beforeEnter(self, params) {
                await getParent(self.router).projectStore.fetchProgramStages();
                await getParent(self.router).projectStore.fetchEvents();
            }
        }
    }),
    projectsForm: View.create({
        path: '/projects/add',
        name: 'projectsForm',
        component: <ProjectForm />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                const a = p.projectStore;
                await a.fetchProgramStages();
                p.setCurrentProgram(a)
            }
        }
    }),
    resultAreas: View.create({
        path: '/result-areas',
        name: 'resultAreas',
        component: <ResultArea />,
        hooks: {
            async beforeEnter(self, params) {
                await getParent(self.router).resultAreaStore.fetchProgramStages();
                await getParent(self.router).resultAreaStore.fetchEvents();
            }
        }
    }),
    resultAreaForm: View.create({
        path: '/result-areas/add',
        name: 'resultAreaForm',
        component: <ProjectForm />,
        hooks: {
            async beforeEnter(self, params) {
                const p = getParent(self.router);
                const a = p.resultAreaStore;
                await a.fetchProgramStages();
                await a.relatedProgram.fetchProgramStages();
                await a.relatedProgram.fetchEvents();
                p.setCurrentProgram(a)

            }
        }
    }),
};
export default views;
