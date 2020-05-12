<template>
    <div id="app">
        <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
        <User v-bind:Users="Users" @del-user="deleteUser" @add-user="addUser" />
        <Bill v-bind:Users="Users" v-bind:Bills="Bills"/>
    </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import User from './components/User';
import Bill from './components/Bill';
export default {
    name: 'App',
    components: {
        User,
        Bill
    },
    data() {
        return {
            Users: [],
            Bills: [
              {
                "payer":"xd",
                "amount":40,
                "participants":["xd","hl"]
              }
            ],
        };
    },
    methods: {
        deleteUser(id) {
            this.Users = this.Users.filter((each) => each.id !== id);
        },
        addUser(usr) {
            this.Users.push(usr);
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
