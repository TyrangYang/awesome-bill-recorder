import Vuex from 'vuex';
import Vue from 'vue';
import users from './modules/users';
import bills from './modules/bills';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        users,
        bills,
    },
});

export default store;
