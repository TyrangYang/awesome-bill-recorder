<template>
    <div id="app">
        <div class="mainBoard">
            <Summary />
            <Bill />
            <User />
        </div>
        <div><button @click="generatePdf">download</button></div>
    </div>
</template>

<script>
import User from './components/User';
import Bill from './components/Bill';
import Summary from './components/Summary';
import jspdf from 'jspdf';
export default {
    name: 'App',
    components: {
        User,
        Bill,
        Summary,
    },
    methods: {
        generatePdf() {
            const doc = new jspdf();
            let table = document.getElementById('billTable');
            console.log(table);
            doc.fromHTML(table, 15, 15, { width: 150 });
            doc.save('test.pdf');
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
.mainBoard {
    display: flex;
}
</style>
