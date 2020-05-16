import Vue from 'vue';
import App from './App.vue';
import UUID from 'vue-uuid';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.use(UUID);

new Vue({
    render: (h) => h(App),
}).$mount('#app');
