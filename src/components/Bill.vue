<template>
  <div class="bill-card">
    <h2>Bills</h2>
    <div class="newbill-btn" @click="addingNewBill">
        Add New Bill
    </div>
    <div class="add-newbill" v-show="adding">
        <label for="payer-select">Who paid:</label>
            <select id="payer-select" v-model="payer">
                <option disabled value="">please select one payer</option>
                <option v-for="user in Users" :key="user.id">{{user.name}}</option>
            </select>
            <!-- <input type="submit" value="Confirm" class="btn" /> -->
            <button >Confirm</button>
            <button >
                Cancel
            </button>
    </div>
    <table id="billTable">
        <thead>
            <tr>
                <th>Who paid?</th>
                <th>Amount</th>
                <th>Participants</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="bill in Bills" :key="bill.payer">
                <td>{{bill.payer}}</td>
                <td>{{bill.amount}}</td>
                <td><div v-for="person in bill.participants" :key="person">{{person}} </div></td>
            </tr>
        </tbody>
    </table>
    

    
  </div>
</template>

<script>
export default {
    name:'Bill',
    props: ['Bills','Users'],
    data(){
        return{
            payer:'',
            amount:'',
            participants:[],
            adding: false,
        }
    },
    methods:{
        addingNewBill(){
            this.adding = !this.adding;
        }
    }
};
</script>


<style scoped>
.bill-card {
  width: 50%;
  border: 1px solid #333;
  border-radius: 5px;
  text-align: center;
}
.newbill-btn{
    background-color: #4CAF50;
    padding: 10px 24px;
    border-radius: 4px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    color:white
}
</style>