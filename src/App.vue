<template>
    <div id="app">
        <div class="mainBoard">
            <Summary :Users="Users" :Bills="Bills" />
            <Bill
                v-bind:Users="Users"
                v-bind:Bills="Bills"
                @add-bill="addBill"
                @del-bill="deleteBill"
            />
            <User
                v-bind:Users="Users"
                @del-user="deleteUser"
                @add-user="addUser"
            />
        </div>
    </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue';
import User from './components/User';
import Bill from './components/Bill';
import Summary from './components/Summary';
import Dinero from 'dinero.js';
export default {
    name: 'App',
    components: {
        User,
        Bill,
        Summary,
    },
    data() {
        return {
            // Initial test data
            Users: [
                { id: 'userId1', name: 'testName1' },
                { id: 'userId2', name: 'testName2' },
                { id: 'userId3', name: 'testName3' },
                { id: 'userId4', name: 'testName4' },
                { id: 'userId5', name: 'testName5' },
            ],
            Bills: [
                {
                    id: 'bill1',
                    payer: 'userId1',
                    amount: Dinero({ amount: 10000 }),
                    participants: ['userId1', 'userId2'],
                },
                {
                    id: 'bill2',
                    payer: 'userId2',
                    amount: Dinero({ amount: 40000 }),
                    participants: ['userId1', 'userId2', 'userId3'],
                },
                {
                    id: 'bill3',
                    payer: 'userId3',
                    amount: Dinero({ amount: 50030 }),
                    participants: ['userId3', 'userId2'],
                },
                {
                    id: 'bill4',
                    payer: 'userId4',
                    amount: Dinero({ amount: 20045 }),
                    participants: ['userId1', 'userId5'],
                },
                {
                    id: 'bill5',
                    payer: 'userId2',
                    amount: Dinero({ amount: 10072 }),
                    participants: ['userId5'],
                },
                {
                    id: 'bill6',
                    payer: 'userId3',
                    amount: Dinero({ amount: 7063 }),
                    participants: [
                        'userId1',
                        'userId2',
                        'userId3',
                        'userId4',
                        'userId5',
                    ],
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
.mainBoard {
    display: flex;
}
</style>
