<template>
    <div class="summary-card">
        <h2>Summary</h2>
        <select class="mergeSummary" v-model="mergeState">
            <option value="0">Not merge</option>
            <option value="1">Merge</option>
        </select>
        <select class="sortSummary" v-model="sortState">
            <option value="0">Group by Payer</option>
            <option value="1">Group by receiver</option>
            <option value="2">Sort by amount(increasing)</option>
            <option value="3">Sort by amount(decreasing)</option>
        </select>
        <div
            class="oneline"
            v-for="(each, idx) in sortSummary(mergeSummary(summary))"
            :key="idx"
        >
            <p>
                <b>{{ getUserNameById(each.from) }}</b> should give
                <b>{{ getUserNameById(each.to) }}</b
                >: <b>{{ each.amount.toFormat() }}</b>
            </p>
            <font-awesome-icon icon="archive" @click="settleSummary(each)" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { uuid } from 'vue-uuid';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
library.add(faArchive);
import Dinero from 'dinero.js';
export default {
    name: 'Summary',
    // props: ['Users', 'Bills'],
    data() {
        return {
            sortState: 0,
            mergeState: 0,
        };
    },
    computed: {
        ...mapGetters(['Bills', 'Users', 'getUserNameById']),
        summary: function() {
            console.log('summary init');
            // compress props data into a map
            let m = new Map();
            for (let bill of this.Bills) {
                let avg = bill.amount.divide(bill.participants.length);
                let diff = Math.abs(
                    avg.getAmount() * bill.participants.length -
                        bill.amount.getAmount()
                );
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
                // console.log(diff);
                m.forEach((val, key, m) => {
                    if (diff > 0) {
                        if (val.getAmount > 0)
                            m.set(key, val.add(Dinero({ amount: 1 })));
                        else m.set(key, val.subtract(Dinero({ amount: 1 })));
                    }
                    diff--;
                });
                // m.forEach((val, key) => {
                //     console.log(key, val.getAmount());
                // });
                // console.log(diff);
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
    },
    methods: {
        settleSummary(willBecomeNewBill) {
            let confirmed = false;
            if (this.mergeState != 0) {
                confirmed =
                    confirm('Will your settle this Bill?') &&
                    confirm(
                        'WARRING!! Settle merged a bill will affect other bills!'
                    );
            } else confirmed = confirm('Will your settle this Bill?');
            if (confirmed) {
                let newBill = {
                    id: uuid.v4(),
                    payer: willBecomeNewBill.from,
                    amount: willBecomeNewBill.amount,
                    participants: [willBecomeNewBill.to],
                    date: moment(),
                };
                this.$store.commit('addBill', newBill);
            }
        },
        sortSummary: function(oriSummary) {
            if (this.sortState == 0) {
                oriSummary.sort((a, b) => {
                    if (a.from < b.from) return -1;
                    else return 1;
                });
            }
            if (this.sortState == 1) {
                oriSummary.sort((a, b) => {
                    if (a.to < b.to) return -1;
                    else return 1;
                });
            }
            if (this.sortState == 2) {
                oriSummary.sort(
                    (a, b) => a.amount.getAmount() - b.amount.getAmount()
                );
            }
            if (this.sortState == 3) {
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

            for (let usr of this.Users) {
                record[usr.id] = 0;
            }

            for (let each of oriSummary) {
                if (each.amount.getAmount() > 0) {
                    record[each.from] -= each.amount.getAmount();
                    record[each.to] += each.amount.getAmount();
                } else {
                    // < 0 (not == 0)
                    record[each.from] += each.amount.getAmount();
                    record[each.to] -= each.amount.getAmount();
                }
            }

            let payerList = [],
                receiverList = [];
            for (let each in record) {
                if (record[each] < 0) {
                    payerList.push([each, record[each]]);
                } else if (record[each] > 0) {
                    receiverList.push([each, record[each]]);
                } else {
                    // record[each] == 0
                    continue;
                }
            }
            // sort two list
            payerList.sort((a, b) => a[1] - b[1]);
            receiverList.sort((a, b) => b[1] - a[1]);

            // Greedy method to calculate a relative less transaction
            let res = [];
            while (payerList.length != 0) {
                let curPayer = payerList.pop();
                while (curPayer[1] != 0) {
                    // current payer still need pay somebody
                    let curReceiver = receiverList.pop();
                    if (curReceiver[1] <= Math.abs(curPayer[1])) {
                        res.push({
                            from: curPayer[0],
                            to: curReceiver[0],
                            amount: Dinero({ amount: curReceiver[1] }),
                        });
                        curPayer[1] += curReceiver[1];
                    } else {
                        res.push({
                            from: curPayer[0],
                            to: curReceiver[0],
                            amount: Dinero({ amount: 0 - curPayer[1] }),
                        });
                        curReceiver[1] -= Math.abs(curPayer[1]);
                        curPayer[1] = 0;
                        receiverList.push(curReceiver);
                    }
                }
            }

            return res;
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
