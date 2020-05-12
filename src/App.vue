<template>
    <div id="app">
        <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
        <User v-bind:Users="Users" @del-user="deleteUser" @add-user="addUser" />
    </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import User from './components/User';
export default {
    name: 'App',
    components: {
        User,
    },
    data() {
        return {
            Users: [],
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
