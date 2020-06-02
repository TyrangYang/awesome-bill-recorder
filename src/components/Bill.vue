<template>
    <div class="bill-card">
        <h2>Bills</h2>
        <div v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="(error, idx) in errors" :key="idx">{{ error }}</li>
            </ul>
        </div>

        <form @submit.prevent="createBill" class="add-newbill" v-show="adding">
            <label for="payer-select" :class="{ 'label-err': !payerValid }"
                >Who paid:</label
            >
            <div :class="{ 'border-err': !payerValid }">
                <select
                    style="width: 100%;"
                    id="payer-select"
                    v-model="payerId"
                >
                    <option disabled value>Select payer</option>
                    <option
                        v-for="(user, idx) in Users"
                        :key="idx"
                        :value="user.id"
                        >{{ user.name }}</option
                    >
                </select>
            </div>

            <label for="amount-num-box" :class="{ 'label-err': !amountValid }"
                >Amount:</label
            >
            <input
                type="number"
                id="amount-num-box"
                placeholder="Please add amount"
                step=".01"
                v-model="amount"
                @input="limitAmountInput(amount)"
                :class="{ 'border-err': !amountValid }"
            />

            <label
                for="participants-select"
                :class="{ 'label-err': !participantsValid }"
                >Participant(s):</label
            >
            <div :class="{ 'border-err': !participantsValid }">
                <select
                    multiple
                    id="participants-select"
                    v-model="participants"
                    style="width: 100%;"
                >
                    <option disabled value
                        >Please include everyone covered by the bill</option
                    >
                    <option
                        v-for="(user, idx) in Users"
                        :key="idx"
                        :value="user.id"
                        @mousedown.prevent="multiSelectEvent"
                        >{{ user.name }}</option
                    >
                </select>
            </div>

            <div>
                <input
                    type="checkbox"
                    id="date-checkbox"
                    v-model="includeDate"
                />
                <label for="date-checkbox">Include Date</label>
                <br />
                <label for="date-input" v-show="includeDate">Date:</label>
                <div :class="{ 'border-err': !dateValid }">
                    <input
                        type="date"
                        id="date-input"
                        style="width: 100%;"
                        v-show="includeDate"
                        :value="billDate && billDate.format().substr(0, 10)"
                        @input="billDateInput"
                    />
                </div>
            </div>

            <div id="unevenly-split">
                <input
                    type="checkbox"
                    id="Unevenly-checkbox"
                    v-model="unevenlySplit"
                />
                <label
                    for="Unevenly-checkbox"
                    :class="{
                        'label-err': !unevenlySplitValid && unevenlySplit,
                    }"
                    >Split unevenly</label
                >
                <span v-show="unevenlySplit && amount === ''" style="color: red"
                    >(amount should not empty)</span
                >
                <div
                    v-show="unevenlySplit && amount !== ''"
                    v-for="(each, idx) in participants"
                    :key="idx"
                >
                    <label for="idx"
                        >{{ getUserNameById(each) }} should spend:</label
                    >
                    <span v-text="displayUnevenlyRecord[each] / 100"></span>
                    <br />
                    <input
                        type="number"
                        min="0"
                        step=".01"
                        :max="amount"
                        :value="displayUnevenlyRecord[each] / 100"
                        @input="limitUnevenlySplitInput(each, $event)"
                    />
                    <input
                        type="range"
                        id="idx"
                        min="0"
                        :max="amount * 100"
                        step="500"
                        v-model="displayUnevenlyRecord[each]"
                        @input="unevenlySplitSlider(each)"
                    />
                </div>
            </div>

            <input type="submit" class="newbill-btn" value="Confirm" />
            <button @click.prevent="addingNewBill" class="newbill-btn">
                Cancel
            </button>
        </form>
        <div class="newbill-btn" @click="addingNewBill" v-show="!adding">
            Add New Bill
        </div>
        <!-- display -->
        <BillDisplay />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import BillDisplay from './BillDisplay';
import Dinero from 'dinero.js';
import moment from 'moment';
library.add(faTrashAlt, faEdit);
export default {
    name: 'Bill',
    // props: ['Bills', 'Users'],
    components: {
        BillDisplay,
    },
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
            unevenlySplitValid: true,
            dateValid: true,
            includeDate: false,
            billDate: moment(),
            unevenlySplit: false,
            unevenlyRecord: {},
        };
    },

    computed: {
        ...mapGetters(['Bills', 'Users', 'getUserNameById']),
        // Users() {
        //     return this.$store.getters.Users;
        // },
        // Bills() {
        //     return this.$store.getters.Bills;
        // },

        displayUnevenlyRecord() {
            let tmpAmount = Dinero({ amount: +this.amount * 100 });
            tmpAmount = tmpAmount.divide(this.participants.length);

            // Eliminate errors caused by amounts that cannot be divisible
            let diff =
                tmpAmount.getAmount() * this.participants.length -
                +this.amount * 100;
            let addDiff = false;
            if (diff < 0) {
                addDiff = true;
                diff = 0 - diff;
            }

            for (const each of this.participants) {
                if (diff > 0) {
                    if (addDiff)
                        this.$set(
                            this.unevenlyRecord,
                            each,
                            tmpAmount.getAmount() + 1
                        );
                    else
                        this.$set(
                            this.unevenlyRecord,
                            each,
                            tmpAmount.getAmount() - 1
                        );
                } else
                    this.$set(this.unevenlyRecord, each, tmpAmount.getAmount());
                diff--;
            }
            return this.unevenlyRecord;
        },
    },
    methods: {
        limitAmountInput() {
            let stringValue = this.amount.toString();
            let regex = /^(\d{1,15}|\d{0,15}\.\d{1,2}|.)$/;
            if (!stringValue.match(regex)) {
                this.amount = stringValue.slice(0, stringValue.length - 1);
            }
        },
        limitUnevenlySplitInput(userId, event) {
            if (+event.target.value > event.target.max)
                event.target.value = event.target.max;
            if (+event.target.value < event.target.min)
                event.target.value = event.target.min;
            let stringValue = event.target.value.toString();
            let regex = /^(\d{1,15}|\d{0,15}\.\d{1,2}|.)$/;
            if (!stringValue.match(regex)) {
                this.$set(
                    this.displayUnevenlyRecord,
                    userId,
                    stringValue.slice(0, stringValue.length - 1) * 100
                );
                event.target.value = stringValue.slice(
                    0,
                    stringValue.length - 1
                );
            } else {
                this.$set(
                    this.displayUnevenlyRecord,
                    userId,
                    stringValue * 100
                );
            }
            this.balanceOtherUnevenlySplit(userId);
        },
        unevenlySplitSlider(userId) {
            this.balanceOtherUnevenlySplit(userId);
        },
        balanceOtherUnevenlySplit(userId) {
            let total = 0;
            for (let each of this.participants) {
                total += +this.displayUnevenlyRecord[each];
            }
            let diff = total - this.amount * 100;
            if (diff > 0) {
                let notCurrentUser = this.participants.filter(
                    (val) => val !== userId
                );
                let idx = notCurrentUser.length - 1;
                while (diff != 0) {
                    if (
                        diff > this.displayUnevenlyRecord[notCurrentUser[idx]]
                    ) {
                        this.displayUnevenlyRecord[notCurrentUser[idx]] = 0;
                        diff -= this.displayUnevenlyRecord[notCurrentUser[idx]];
                        idx--;
                    } else {
                        this.displayUnevenlyRecord[notCurrentUser[idx]] -= diff;
                        diff = 0;
                    }
                }
            }
        },
        billDateInput(e) {
            this.billDate = e.target.value && moment(e.target.value);
        },

        clearBillInputErrors() {
            this.errors = [];
            this.payerValid = true;
            this.amountValid = true;
            this.participantsValid = true;
            //this.billDate = moment();
            this.dateValid = true;
            this.unevenlySplitValid = true;
        },
        addingNewBill() {
            this.adding = !this.adding;
            this.clearBillInputErrors();
            this.includeDate = false;
        },
        multiSelectEvent(e) {
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

        checkBillInput() {
            if (this.payerId === '') {
                this.errors.push('Payer required.');
                this.payerValid = false;
            }
            if (this.amount === '') {
                this.errors.push('Amount required.');
                this.amountValid = false;
            }
            if (this.participants.length === 0) {
                this.errors.push('Participants required.');
                this.participantsValid = false;
            }
            if (
                this.participants.length === 1 &&
                this.participants[0] === this.payerId
            ) {
                this.errors.push("Payer can't be the only participant.");
                this.participantsValid = false;
            }
            if (this.includeDate === true && this.billDate === '') {
                this.errors.push("Date can't be empty when it's included.");
                this.dateValid = false;
            }

            if (this.unevenlySplit === true) {
                let total = 0;
                for (let each of this.participants) {
                    total += +this.displayUnevenlyRecord[each];
                }
                if (total != this.amount * 100) {
                    // error
                    this.errors.push(
                        'Unevenly Split amount is not equal to amount your pervided.'
                    );
                    this.unevenlySplitValid = false;
                }
            }

            if ((+this.amount / this.participants.length).toFixed(4) < 0.01) {
                this.errors.push(
                    'The mininum average split for each participant is 0.01.'
                );
                this.amountValid = false;
            }
            if (
                !this.payerValid ||
                !this.amountValid ||
                !this.participantsValid ||
                !this.dateValid ||
                !this.unevenlySplitValid
            ) {
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
            if (!this.includeDate) {
                this.billDate = '';
            }

            if (this.unevenlySplit) {
                for (const each in this.unevenlyRecord) {
                    if (each == this.payerId || this.unevenlyRecord[each] == 0)
                        continue;
                    let newBill = {
                        id: uuid.v4(),
                        payer: this.payerId,
                        amount: Dinero({ amount: +this.unevenlyRecord[each] }),
                        participants: [each],
                        date: this.billDate,
                    };
                    this.$store.commit('addBill', newBill);
                }
            } else {
                let newBill = {
                    id: uuid.v4(),
                    payer: this.payerId,
                    amount: Dinero({ amount: +this.amount * 100 }),
                    participants: this.participants,
                    date: this.billDate,
                };
                this.$store.commit('addBill', newBill);
            }

            this.addingNewBill();
            //clean up
            this.payerId = '';
            this.amount = '';
            this.participants = [];
            this.unevenlyRecord = {};
            this.unevenlySplit = false;
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
    color: red;
}
.border-err {
    border: 1.5px solid red;
}
</style>
