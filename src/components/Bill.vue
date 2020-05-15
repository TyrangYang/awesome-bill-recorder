<template>
    <div class="bill-card">
        <h2>Bills</h2>
        <div class="add-newbill" v-show="adding">
            <label for="payer-select">Who paid:</label>
            <select id="payer-select" v-model="payerId">
                <option disabled value="">Select payer</option>
                <option
                    v-for="(user, idx) in Users"
                    :key="idx"
                    :value="user.id"
                    >{{ user.name }}</option
                >
            </select>

            <label for="amount-num-box">Amount:</label>
            <input
                type="number"
                id="amount-num-box"
                placeholder="Please add amount"
                v-model="amount"
            />

            <label for="participants-select">Participants:</label>
            <select multiple id="participants-select" v-model="participants">
                <option disabled value="">Please select one</option>
                <option
                    v-for="(user, idx) in Users"
                    :key="idx"
                    :value="user.id"
                    @mousedown.prevent="multiSelect"
                    >{{ user.name }}</option
                >
            </select>

            <button @click="createBill" class="newbill-btn">Confirm</button>
            <button @click="addingNewBill" class="newbill-btn">Cancel</button>
        </div>
        <div class="newbill-btn" @click="addingNewBill" v-show="!adding">
            Add New Bill
        </div>
        <!-- display -->
        <div class="table-wrap">
            <table id="billTable">
                <thead>
                    <tr>
                        <th>Who paid?</th>
                        <th>Amount</th>
                        <th>Participants</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="bill in Bills" :key="bill.id">
                        <td>{{ getUserNameById(bill.payer).name }}</td>
                        <td>{{ bill.amount }}</td>
                        <td>
                            <div
                                v-for="(person, idx) in bill.participants"
                                :key="idx"
                            >
                                {{ getUserNameById(person).name }}
                            </div>
                        </td>
                        <!-- <font-awesome-icon icon="edit" /> -->
                        <font-awesome-icon
                            icon="trash-alt"
                            @click="$emit('del-bill', bill.id)"
                        />
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
library.add(faTrashAlt, faEdit);
export default {
    name: 'Bill',
    props: ['Bills', 'Users'],
    data() {
        return {
            payerId: '',
            amount: '',
            participants: [],
            adding: false,
        };
    },
    methods: {
        getUserNameById(id) {
            return this.Users.filter((each) => each.id === id)[0];
        },
        addingNewBill() {
            this.adding = !this.adding;
        },
        multiSelect(e) {
            e.target.parentElement.focus();
            e.target.selected = !e.target.selected;
            if (e.target.selected) {
                this.participants.push(e.target.value);
            } else {
                this.participants = this.participants.filter(
                    (each) => each !== e.target.value
                );
            }
            console.log(e.target.selected);
            console.log(this.participants);
            return false;
        },
        createBill() {
            if (
                this.payerId === '' ||
                this.amount === '' ||
                this.participants.length === 0
            ) {
                alert('Input Error');
                return;
            }
            let newBill = {
                id: uuid.v4(),
                payer: this.payerId,
                amount: +this.amount,
                participants: this.participants,
            };
            this.$emit('add-bill', newBill);
            this.addingNewBill();
            //clean up
            this.payerId = '';
            this.amount = '';
            this.participants = [];
        },
    },
};
</script>

<style scoped>
.add-newbill {
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
}
.bill-card {
    width: 40%;
    border: 1px solid #333;
    border-radius: 5px;
    text-align: center;
}
.newbill-btn {
    display: inline-block;
    padding: 5px 30px;
    background: #4caf50;
    color: #fff;
    border: 1px #fff solid;
    border-radius: 5px;
    opacity: 0.7;
}
.del {
    background: #ff0000;
    color: #fff;
    border: none;
    padding: 5px 9px;
    margin: 20px 10px;
    border-radius: 50%;
    cursor: pointer;
    float: right;
}
</style>
