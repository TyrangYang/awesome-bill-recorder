<template>
    <div class="user-card">
        <h2>User List</h2>
        <div class="one-name" v-for="user in Users" :key="user.id">
            <p>{{ user.name }}</p>
            <font-awesome-icon
                icon="trash-alt"
                @click="$emit('del-user', user.id)"
            />
        </div>
        <!-- @submit.prevent="createUser" -->
        <form @submit.prevent="createUser" v-show="adding">
            <label for="new-user-text-box">Name:</label>
            <input
                type="text"
                id="new-user-text-box"
                v-model="newUserName"
                placeholder="New Name"
            />
            <input type="submit" value="Confirm" class="btn" />
            <!-- <button @click="createUser" class="btn">Confirm</button> -->
            <button class="btn" @click.prevent="addingUser" v-show="adding">
                Cancel
            </button>
        </form>

        <button class="btn" @click="addingUser" v-show="!adding">ADD</button>
    </div>
</template>

<script>
import { uuid } from 'vue-uuid';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
library.add(faTrashAlt);

export default {
    name: 'User',
    props: ['Users'],

    data() {
        return {
            newUserName: '',
            adding: false,
        };
    },
    methods: {
        addingUser() {
            this.adding = !this.adding;
        },
        createUser() {
            let isExist = false;
            for (let each of this.Users) {
                if (each.name === this.newUserName.toUpperCase()) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) {
                alert(
                    'User name already exists. Please note that user names are not case sensitive.'
                );
                return;
            }
            let newUser = {
                id: uuid.v4(),
                name: this.newUserName.toUpperCase(),
            };

            this.$emit('add-user', newUser);
            // cleanup
            this.newUserName = '';
            this.addingUser();
        },
    },
};
</script>

<style scoped>
.user-card {
    width: 20%;
    border: 1px solid #333;
    border-radius: 5px;
    padding: 5px;
    text-align: center;
}
.one-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px;
}
.btn {
    display: inline-block;
    width: 50%;
    padding: 5px 30px;
    background: #555;
    color: #fff;
    border: 1px #fff solid;
    border-radius: 5px;
    margin-top: 15px;
    opacity: 0.7;
}
li {
    list-style: none;
}
</style>
