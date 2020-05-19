<template>
    <div class="summary-card">
        <h2>Summary</h2>
        <select class="mergeSummary" v-model="mergeState">
            <option value="0">Not merge</option>
            <option value="1">merge by Payer</option>
            <option value="2">merge by receiver</option>
        </select>
        <select class="sortSummary" v-model="sortState">
            <option value="0">Not sort</option>
            <option value="1">Group by Payer</option>
            <option value="2">Group by receiver</option>
            <option value="3">Sort by amount(increasing)</option>
            <option value="4">Sort by amount(decreasing)</option>
        </select>
        <div
            class="oneline"
            v-for="(each, idx) in sortSummary(deepCopySummary)"
            :key="idx"
        >
            <p>
                <b>{{ getUserNameById(each.from) }}</b> should give
                <b>{{ getUserNameById(each.to) }}</b
                >: <b>{{ each.amount.toFormat() }}</b>
            </p>
            <font-awesome-icon icon="archive" @click="settleSummary(each)" />
        </div>
        <!-- <div>{{ mergeSummary(summary) }}</div> -->
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
library.add(faArchive);
import Dinero from 'dinero.js';
export default {
    name: 'Summary',
    props: ['Users', 'Bills'],
    data() {
        return {
            sortState: 0,
            mergeState: 0,
        };
    },
    computed: {
        summary: function() {
            // compress props data into a map
            let m = new Map();
            for (let bill of this.Bills) {
                let avg = bill.amount.divide(bill.participants.length);
                for (let one of bill.participants) {
                    if (one != bill.payer) {
                        let from = one,
                            to = bill.payer,
                            amount = avg,
                            key = '';
                        if (from < to) {
                            key = JSON.stringify([from, to]);
                        } else {
                            key = JSON.stringify([to, from]);
                            amount = Dinero({ amount: 0 }).subtract(avg);
                        }
                        if (!m.has(key)) m.set(key, amount);
                        else {
                            m.set(key, m.get(key).add(amount));
                        }
                    }
                }
            }
            // analysis map
            let res = [];
            m.forEach((val, key) => {
                let [from, to] = JSON.parse(key);
                if (val.getAmount() > 0) {
                    res.push({
                        from,
                        to,
                        amount: val,
                    });
                } else if (val.getAmount() == 0) {
                    return;
                } else {
                    res.push({
                        from: to,
                        to: from,
                        amount: Dinero({ amount: 0 }).subtract(val),
                    });
                }
            });

            return res;
        },
        deepCopySummary: function() {
            let res = [];
            for (let each of this.summary) {
                let { from, to, amount } = each;
                let copy = {
                    from,
                    to,
                    amount: Dinero({ amount: amount.getAmount() }),
                };
                res.push(copy);
            }
            return res;
        },
    },
    methods: {
        getUserNameById(id) {
            return this.Users.filter((each) => each.id === id)[0].name;
        },
        settleSummary(willBecomeNewBill) {
            if (confirm('Will your settle this Bill?')) {
                let newBill = {
                    id: uuid.v4(),
                    payer: willBecomeNewBill.from,
                    amount: willBecomeNewBill.amount,
                    participants: [willBecomeNewBill.to],
                    date: moment(),
                };
                this.$emit('add-bill', newBill);
            }
        },
        sortSummary: function(oriSummary) {
            if (this.sortState == 0) {
                return this.summary;
            }
            if (this.sortState == 1) {
                oriSummary.sort((a, b) => {
                    if (a.from < b.from) return -1;
                    else return 1;
                });
            }
            if (this.sortState == 2) {
                oriSummary.sort((a, b) => {
                    if (a.to < b.to) return -1;
                    else return 1;
                });
            }
            if (this.sortState == 3) {
                oriSummary.sort(
                    (a, b) => a.amount.getAmount() - b.amount.getAmount()
                );
            }
            if (this.sortState == 4) {
                oriSummary.sort(
                    (a, b) => b.amount.getAmount() - a.amount.getAmount()
                );
            }
            return oriSummary;
        },
        mergeSummary: function(oriSummary) {
            if (this.mergeState == 0) {
                return oriSummary;
            }
            let record = {};

            for (let each of oriSummary) {
                if (each.amount.getAmount() > 0) {
                    if (record[each.from] === undefined) {
                        record[each.from] = 0 - each.amount.getAmount();
                    } else {
                        record[each.from] -= each.amount.getAmount();
                    }
                    if (record[each.to] === undefined) {
                        record[each.to] = each.amount.getAmount();
                    } else {
                        record[each.to] += each.amount.getAmount();
                    }
                } else {
                    // < 0 (not == 0)
                    if (record[each.from] === undefined) {
                        record[each.from] = each.amount.getAmount();
                    } else {
                        record[each.from] += each.amount.getAmount();
                    }
                    if (record[each.to] === undefined) {
                        record[each.to] = 0 - each.amount.getAmount();
                    } else {
                        record[each.to] -= each.amount.getAmount();
                    }
                }
            }

            console.log(record);
            return record;
        },
    },
};
</script>

<style lang="css">
.summary-card {
    width: 25%;
    border: 1px solid #333;
    border-radius: 5px;
    padding: 5px;
    text-align: center;
    margin: 1px 20px;
}

.oneline {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
