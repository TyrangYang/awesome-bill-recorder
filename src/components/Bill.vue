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
            <div :class="{'select-err':!payerValid}">
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
                :class="{'select-err':!amountValid}"
            />

            <label for="participants-select" :class="{'label-err':!participantsValid}">Participant(s):</label>
            <div :class="{'select-err':!participantsValid}">
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
            errors:[],
            payerValid:true,
            amountValid:true,
            participantsValid:true
        };
    },
    methods: {
        getUserNameById(id) {
            return this.Users.filter((each) => each.id === id)[0];
        },
        clearBillInputErrors(){
            this.errors = [];
            this.payerValid = true;
            this.amountValid = true;
            this.participantsValid = true;
        },
        addingNewBill() {
            this.adding = !this.adding;
            this.clearBillInputErrors();
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
            if(!this.payerValid || !this.amountValid || !this.participantsValid){
                return false;
            }
            this.clearBillInputErrors();
            return true;
        },
        createBill() {
            this.clearBillInputErrors();
            if (!this.checkBillInput()) {
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
            this.errors = [];
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
.label-err {
    color:red;
}
.select-err{
    border: 1.5px solid red;
}
</style>
