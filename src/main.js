import Vue from 'vue';
import App from './App.vue';

// UUID
import UUID from 'vue-uuid';
Vue.use(UUID);

// FontAwesomeIcon
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
Vue.component('font-awesome-icon', FontAwesomeIcon);

// store
import store from './store';

Vue.config.productionTip = false;

new Vue({
    store,
    render: (h) => h(App),
}).$mount('#app');
