<template>
    <div class="table-wrap">
        <table id="billTable">
            <thead>
                <tr>
                    <th @click="sort('payer')">
                        Who paid?
                        <font-awesome-icon icon="sort" />
                    </th>
                    <th @click="sort('amount')">
                        Amount
                        <font-awesome-icon icon="sort" />
                    </th>
                    <th>Participants</th>
                    <th @click="sort('date')">
                        Date
                        <font-awesome-icon icon="sort" />
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="bill in sortedBills(deepCopyBills)" :key="bill.id">
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
                        {{ bill.date && bill.date.format().substr(0, 10) }}
                    </td>
                    <!-- <font-awesome-icon icon="edit" /> -->
                    <td>
                        <font-awesome-icon
                            icon="trash-alt"
                            @click="$store.commit('deleteBill', bill.id)"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Dinero from 'dinero.js';
import moment from 'moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faEdit, faSort } from '@fortawesome/free-solid-svg-icons';

library.add(faTrashAlt, faEdit, faSort);
export default {
    name: 'BillDisplay',
    data() {
        return {
            currentSort: 'payer',
            currentSortDir: 'asc',
        };
    },
    computed: {
        ...mapGetters(['Bills', 'getUserNameById']),
        deepCopyBills() {
            let billsCopy = [];
            for (let bill of this.Bills) {
                let oneBill = {
                    payer: bill.payer,
                    amount: Dinero({ amount: bill.amount.getAmount() }),
                    id: bill.id,
                    participants: JSON.parse(JSON.stringify(bill.participants)),
                    date: bill.date && moment(bill.date.format()),
                };
                billsCopy.push(oneBill);
            }
            return billsCopy;
        },
    },
    methods: {
        sortedBills(oriBills) {
            return oriBills.sort((a, b) => {
                let modifier = 1;
                if (this.currentSortDir === 'desc') modifier = -1;

                if (this.currentSort === 'date') {
                    //move all bills without date to the end of the list
                    if (!a['date'] && b['date']) return 1;
                    if (a['date'] && !b['date']) return -1;
                    if (!a['date'] && !b['date']) return 0;
                    if (a['date'].isBefore(b['date'])) return -1 * modifier;
                    if (a['date'].isAfter(b['date'])) return 1 * modifier;
                    return 0;
                }
                if (this.currentSort === 'amount') {
                    if (
                        a[this.currentSort].getAmount() <
                        b[this.currentSort].getAmount()
                    )
                        return -1 * modifier;
                    if (
                        a[this.currentSort].getAmount() >
                        b[this.currentSort].getAmount()
                    )
                        return 1 * modifier;
                    return 0;
                }
                if (a[this.currentSort] < b[this.currentSort])
                    return -1 * modifier;
                if (a[this.currentSort] > b[this.currentSort])
                    return 1 * modifier;
                return 0;
            });
        },
        sort(s) {
            //if s == current sort, reverse
            if (s === this.currentSort) {
                this.currentSortDir =
                    this.currentSortDir === 'asc' ? 'desc' : 'asc';
            }
            this.currentSort = s;
        },
    },
};
</script>

<style>
table,
td,
th {
    border: 1px solid #ddd;
    text-align: left;
}

table {
    border-collapse: collapse;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5px;
}

th,
td {
    padding: 7px;
}
th {
    cursor: pointer;
}
tr:hover {
    background-color: #f5f5f5;
}
</style>
