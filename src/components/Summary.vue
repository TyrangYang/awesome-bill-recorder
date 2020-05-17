<template>
    <div class="summary-card">
        <h2>Summary</h2>
        <div class="oneline" v-for="(each, idx) in summary" :key="idx">
            <p>
                <b>{{ getUserNameById(each.from) }}</b> should give
                <b>{{ getUserNameById(each.to) }}</b
                >: <b>{{ each.amount }}</b>
            </p>
        </div>
    </div>
</template>

<script>
import Dinero from 'dinero.js';
export default {
    name: 'Summary',
    props: ['Users', 'Bills'],
    computed: {
        summary: function() {
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
                        amount: val.toFormat(),
                    });
                } else if (val.getAmount() == 0) {
                    console.log();
                } else {
                    res.push({
                        from: to,
                        to: from,
                        amount: Dinero({ amount: 0 })
                            .subtract(val)
                            .toFormat(),
                    });
                }
            });

            return res;
        },
    },
    methods: {
        getUserNameById(id) {
            return this.Users.filter((each) => each.id === id)[0].name;
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
}
</style>
