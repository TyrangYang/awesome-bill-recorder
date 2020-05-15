<template>
    <div id="app">
        <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
        <User v-bind:Users="Users" @del-user="deleteUser" @add-user="addUser" />
        <Bill
            v-bind:Users="Users"
            v-bind:Bills="Bills"
            @add-bill="addBill"
            @del-bill="deleteBill"
        />
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
        Bill,
    },
    data() {
        return {
            // Initial test data
            Users: [
                { id: 'userId1', name: 'testName1' },
                { id: 'userId2', name: 'testName2' },
            ],
            Bills: [
                {
                    id: 'bill1',
                    payer: 'userId1',
                    amount: 100,
                    participants: ['userId1', 'userId2'],
                },
            ],

            // Users: [],
            // Bills: [],
        };
    },
    methods: {
        deleteUser(id) {
            // check shows?
            let used = false;
            for (let eachBill of this.Bills) {
                if (eachBill.payer == id) {
                    used = true;
                    break;
                }
                for (let eachParticpent of eachBill.participants) {
                    if (eachParticpent == id) {
                        used = true;
                        break;
                    }
                }
            }
            if (used) {
                alert('User already in bills! Delete not allow!');
            } else {
                if (
                    confirm(
                        `Do you really want to delete ${
                            this.Users.filter((each) => each.id == id)[0].name
                        }?`
                    )
                ) {
                    this.Users = this.Users.filter((each) => each.id !== id);
                }
            }
        },
        addUser(usr) {
            this.Users.push(usr);
        },
        addBill(bill) {
            this.Bills.push(bill);
        },
        deleteBill(id) {
            if (confirm(`Do you really want to delete ${id}?`)) {
                this.Bills = this.Bills.filter((each) => each.id !== id);
            }
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
