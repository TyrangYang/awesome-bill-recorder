const state = {
    Users: [
        { id: 'userId1', name: 'testName1' },
        { id: 'userId2', name: 'testName2' },
        { id: 'userId3', name: 'testName3' },
        { id: 'userId4', name: 'testName4' },
        { id: 'userId5', name: 'testName5' },
        { id: 'userId6', name: 'testName6' },
    ],
};

const getters = {
    Users: (state) => state.Users,
};

const actions = {
    // deleteUser(){},
    // addUser({commit}, usr){
    //     commit(add)
    // }
};

const mutations = {
    deleteUser(state, id) {
        // check shows?
        let used = false;
        for (let eachBill of this.state.bills.Bills) {
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
            alert('Remove failed. There are still bills related to this user.');
        } else {
            if (
                confirm(
                    `Do you really want to remove user ${
                        state.Users.filter((each) => each.id == id)[0].name
                    }?`
                )
            ) {
                state.Users = state.Users.filter((each) => each.id !== id);
            }
        }
    },
    addUser(state, usr) {
        state.Users.push(usr);
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
