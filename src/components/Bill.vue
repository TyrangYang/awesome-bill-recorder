<template>
  <div class="bill-card">
    <h2>Bills</h2>
    <div class="add-newbill" v-show="adding">
        <label for="payer-select">Who paid:</label>
        <select id="payer-select" v-model="payer">
            <option disabled value="">Select payer</option>
            <option v-for="user in Users" :key="user.id">{{user.name}}</option>
        </select>
        
        <label for="amount-num-box">Amount:</label>
        <input type="number" id="amount-num-box" v-model="amount"/>
        
        <label for="participants-select">Who paid:</label>
        <select multiple id="participants-select" v-model="participants">
            <option v-for="user in Users" :key="user.id" @mousedown.prevent="multiSelect">{{user.name}}</option>
        </select>
        <p>Participants: {{participants}}</p>
            
        <button @click="createBill" class="newbill-btn">Confirm</button>
        <button @click="addingNewBill" class="newbill-btn">Cancel</button>
    </div>
    <div class="newbill-btn" @click="addingNewBill" v-show="!adding">
        Add New Bill
    </div>

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
                    <td>{{bill.payer}}</td>
                    <td>{{bill.amount}}</td>
                    <td><div v-for="person in bill.participants" :key="person">{{person}} </div></td>
                    <button class="del" @click="$emit('del-bill',bill.id)">x</button>
                </tr>
            </tbody>
        </table>
    </div>
    
    

    
  </div>
</template>

<script>
import { uuid } from 'vue-uuid';
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
        },
        multiSelect(e){
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
        createBill(){
            let newBill = {
                id:uuid.v4(),
                payer:this.payer,
                amount:this.amount,
                participants:this.participants
            };
            this.$emit('add-bill', newBill);
            this.addingNewBill();
        }
    }
};
</script>


<style scoped>
.bill-card {
  width: 40%;
  border: 1px solid #333;
  border-radius: 5px;
  text-align: center;
}
.newbill-btn{
    display: inline-block;
    padding: 5px 30px;
    background: #4CAF50;
    color: #fff;
    border: 1px #fff solid;
    border-radius: 5px;
    margin-top: 25px;
    opacity: 0.7;
}
.del {
    background: #ff0000;
    color: #fff;
    border: none;
    padding: 5px 9px;
    margin: 20px 10px;
    border-radius: 50%;
    cursor: pointer;
    float: right;
}

</style>