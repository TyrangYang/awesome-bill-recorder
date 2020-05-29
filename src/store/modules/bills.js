import Dinero from 'dinero.js';
import moment from 'moment';
const state = {
    Bills: [
        {
            id: 'bill1',
            payer: 'userId1',
            amount: Dinero({ amount: 10000 }),
            participants: ['userId1', 'userId2'],
            date: moment('2020-04-20'),
        },
        {
            id: 'bill2',
            payer: 'userId2',
            amount: Dinero({ amount: 40000 }),
            participants: ['userId1', 'userId2', 'userId3'],
            date: moment('2020-01-01'),
        },
        {
            id: 'bill3',
            payer: 'userId3',
            amount: Dinero({ amount: 50030 }),
            participants: ['userId3', 'userId2'],
            date: moment('2020-02-05'),
        },
        {
            id: 'bill4',
            payer: 'userId4',
            amount: Dinero({ amount: 20045 }),
            participants: ['userId1', 'userId5'],
            date: moment('2020-02-09'),
        },
        {
            id: 'bill5',
            payer: 'userId2',
            amount: Dinero({ amount: 10072 }),
            participants: ['userId5'],
            date: moment('2019-12-05'),
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
};

const getters = {
    Bills: (state) => state.Bills,
};

const actions = {};

const mutations = {
    addBill(state, bill) {
        state.Bills.push(bill);
    },
    deleteBill(state, id) {
        let delBill = state.Bills.filter((each) => each.id == id)[0];
        if (
            confirm(
                `Do you really want to delete this bill in the amount of ${delBill.amount}?`
            )
        ) {
            state.Bills = state.Bills.filter((each) => each.id !== id);
        }
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
