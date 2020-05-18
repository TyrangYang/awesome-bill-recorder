<template>
    <div class="bill-card">
        <h2>Bills</h2>
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="(error,idx) in errors" :key="idx">{{ error }}</li>
            </ul>
        </p>

        <div class="add-newbill" v-show="adding">
            <label for="payer-select" :class="{'label-err':!payerValid}">Who paid:</label>
            <div :class="{'border-err':!payerValid}">
                <select style="width: 100%;" id="payer-select" v-model="payerId">
                    <option disabled value="">Select payer</option>
                    <option
                        v-for="(user, idx) in Users"
                        :key="idx"
                        :value="user.id"
                        >{{ user.name }}</option
                    >
                </select>
            </div>
            

            <label for="amount-num-box" :class="{'label-err':!amountValid}">Amount:</label>
            <input
                type="number"
                id="amount-num-box"
                placeholder="Please add amount"
                v-model="amount"
                :class="{'border-err':!amountValid}"
            />

            <label for="participants-select" :class="{'label-err':!participantsValid}">Participant(s):</label>
            <div :class="{'border-err':!participantsValid}">
                <select multiple id="participants-select" v-model="participants" style="width: 100%;">
                    <option disabled value=""
                        >Please include everyone covered by the bill</option
                    >
                    <option
                        v-for="(user, idx) in Users"
                        :key="idx"
                        :value="user.id"
                        @mousedown.prevent="multiSelect"
                        >{{ user.name }}</option
                    >
                </select>
            </div>
            
            <div>
                <input type="checkbox" id="date-checkbox" v-model="includeDate">
                <label for="date-checkbox">Include Date</label>
                <br>
                <label for="date-input" v-show="includeDate">Date: </label>
                <div :class="{'border-err':!dateValid}">
                    <input type="date" id="date-input" style="width: 100%;" v-show="includeDate" :value="billDate && billDate.format().substr(0,10)"
                        @input="billDateInput">
                </div>
            </div>
            

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
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="bill in Bills" :key="bill.id">
                        <td>{{ getUserNameById(bill.payer) }}</td>
                        <td>{{ bill.amount.toFormat() }}</td>
                        <td>
                            <div
                                v-for="(person, idx) in bill.participants"
                                :key="idx"
                            >
                                {{ getUserNameById(person) }}
                            </div>
                        </td>
                        <td>
                            {{bill.date && bill.date.format().substr(0,10)}}
                        </td>
                        <!-- <font-awesome-icon icon="edit" /> -->
                        <td>
                            <font-awesome-icon
                                icon="trash-alt"
                                @click="$emit('del-bill', bill.id)"
                            />
                        </td>
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
import Dinero from 'dinero.js';
import moment from 'moment';
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
            errors: [],
            payerValid: true,
            amountValid: true,
            participantsValid: true,
            includeDate: false,
            billDate: moment(),
            dateValid: true
        };
    },
    methods: {
        billDateInput(e){
            console.log('input valueAsDate ' + e.target.value);
            this.billDate = e.target.value && moment(e.target.value);
        },
        getUserNameById(id) {
            return this.Users.filter((each) => each.id === id)[0].name;
        },
        clearBillInputErrors(){
            this.errors = [];
            this.payerValid = true;
            this.amountValid = true;
            this.participantsValid = true;
            //this.billDate = moment();
            this.dateValid = true;
        },
        addingNewBill() {
            this.adding = !this.adding;
            this.clearBillInputErrors();
            this.includeDate = false;
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
            return false;
        },
        checkBillInput(){
            //console.log(this.participants.length)
            if(this.payerId === ''){
                this.errors.push("Payer required.");
                this.payerValid = false;
            }
            if(this.amount === ''){
                this.errors.push("Amount required.");
                this.amountValid = false;
            }
            if(this.participants.length === 0){
                this.errors.push("Participants required.");
                this.participantsValid = false;
            }
            if(this.participants.length === 1 && this.participants[0] === this.payerId){
                this.errors.push("Payer can't be the only participant.")
                this.participantsValid = false;
            }
            if(this.includeDate === true && this.billDate === ''){
                this.errors.push("Date can't be empty when it's included.")
                this.dateValid = false;
            }
            if(!this.payerValid || !this.amountValid || !this.participantsValid || !this.dateValid){
                return false;
            }
            this.clearBillInputErrors();
            return true;
        },
        createBill() {
            this.clearBillInputErrors();
            if (!this.checkBillInput()) {
                this.includeDate = false;
                return;
            }
            if(!this.includeDate){
                this.billDate = ''
            }
            let newBill = {
                id: uuid.v4(),
                payer: this.payerId,
                amount: Dinero({ amount: +this.amount * 100 }),
                participants: this.participants,
                date: this.billDate
            };
            this.$emit('add-bill', newBill);
            this.addingNewBill();
            //clean up
            this.payerId = '';
            this.amount = '';
            this.participants = [];
            this.billDate = moment();
            this.includeDate = false;
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
    width: 50%;
    border: 1px solid #333;
    border-radius: 5px;
    text-align: center;
    margin: 1px 20px;
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
.label-err {
    color:red;
}
.border-err{
    border: 1.5px solid red;
}
table,
td,
th {
    border: 1px solid black;
}

table {
    border-collapse: collapse;
    width: 100%;
}

th {
    height: 50px;
}
</style>
