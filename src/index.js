import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import store from './store/Store';

import App from './App';
import { init } from 'd2';
import Loading from './components/Loading'
const config = {};
if (process.env.NODE_ENV === 'development') {
    config.baseUrl = `http://localhost:8080/api`; // Baylor
    config.headers = { Authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=' }; // admin
} else {
    let baseUrl = '';
    let urlArray = window.location.pathname.split('/');
    let apiIndex = urlArray.indexOf('api');
    if (apiIndex > 1) {
        baseUrl = '/' + urlArray[apiIndex - 1] + '/';
    } else {
        baseUrl = '/';
    }
    baseUrl = window.location.protocol + '//' + window.location.host + baseUrl;
    config.baseUrl = baseUrl + 'api'
}

ReactDOM.render(<Loading />, document.getElementById('root'));

const initialize = async () => {
    const d2 = await init(config);
    console.log(d2);
    d2.i18n.translations['id'] = 'Id';
    d2.i18n.translations['program_name'] = 'Program Name';
    d2.i18n.translations['program_type'] = 'Program Type';
    d2.i18n.translations['last_updated'] = 'Last Updated';
    d2.i18n.translations['last_run'] = 'Last Run';
    d2.i18n.translations['run'] = 'Run';
    d2.i18n.translations['schedule'] = 'Schedule';
    d2.i18n.translations['logs'] = 'Logs';
    d2.i18n.translations['delete'] = 'Delete';
    d2.i18n.translations['actions'] = 'Actions';
    d2.i18n.translations['display_name'] = 'Program Name';
    d2.i18n.translations['mapping_id'] = 'Mapping Id';
    d2.i18n.translations['name'] = 'Name';
    d2.i18n.translations['app_search_placeholder'] = 'Search Apps';
    d2.i18n.translations['manage_my_apps'] = 'Manage My Apps';
    d2.i18n.translations['settings'] = 'Settings';
    d2.i18n.translations['account'] = 'Account';
    d2.i18n.translations['profile'] = 'Profile';
    d2.i18n.translations['log_out'] = 'Logout';
    d2.i18n.translations['help'] = 'Help';
    d2.i18n.translations['about_dhis2'] = 'About DHIS2';
    store.setD2(d2);

    await store.fetchUnits();
    await store.loadOrgUnitGroups();
    await store.loadOrgUnitLevels();
    await store.fetchRelationships();

    store.resultAreaStore.setRelatedProgram(store.objectiveStore);
    store.objectiveStore.setRelatedProgram(store.projectStore);
    store.activityDataStore.setRelatedProgram(store.resultAreaStore);
    store.outputStore.setRelatedProgram(store.projectStore);
    store.activityStore.setRelatedProgram(store.activityDataStore);

    ReactDOM.render(<Provider store={store}>
        <App d2={d2} />
    </Provider>, document.getElementById('root'));

}
initialize().then(d2 => {
    console.log('finished')
}).catch(e => ReactDOM.render(<div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
    fontSize: 28
}}>
    {JSON.stringify(e)}
</div>, document.getElementById('root'))
);



