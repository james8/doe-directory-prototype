<template>
    <div id="app">
        <NavigationTabs></NavigationTabs>
        <router-view/>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import NavigationTabs from "@/components/NavigationTabs.vue";

    @Component({
        components: { NavigationTabs }
    })
    export default class App extends Vue {
    };
</script>

<style>
    body {
        margin: 0px;
    }
    
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
    }

    #nav a {
        font-weight: bold;
        color: #000;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }

    
    .title {
        font-size: 32px;
        font-weight: bold;
        padding: 10px;
        display: flex;
    }

    .subTitle {
        border-bottom: 1px solid #bbb;
        font-size: 24px;
        font-weight: bold;
        margin-top: 30px;
        padding: 10px;
        display: flex;
    }

    .indent {
        padding-left: 20px;
    }

    table {
        border: 1px solid #000;
        margin: 20px;
        table-layout: fixed;
        width: calc(100% - 40px);
    }

    th {
        background: linear-gradient(#166f94, #10536f);
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #000;
        color: #fff;
        font-weight: bold;
    }

    th, td {
        padding: 10px;
        text-align: left;
        vertical-align: top;
    }

    th:last-of-type, td:last-of-type {
        border-right: none;
    }

    tbody tr:nth-child(even) {
        background-color: #ddd;
    }

    table .resultIcon {
        width: 23px;
    }

    table .resultIcon button {
        background-color: transparent;
        border: none;
        font-size: 21px;
        padding: 0px;
    }

    table .resultIcon .fas {
        cursor: pointer;
    }

    table .resultPhone {
        width: 110px;
    }

    table .resultExt {
        width: 45px;
    }

    table .resultDate {
        width: 80px;
    }

    table .wordBreak {
        word-break: break-all;
    }

    table .resultModified {
        width: 90px;
    }

    .btn {
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
        color: #000;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        margin: 5px 10px;
        padding: 10px;
    }

    .btnNormal {
        background-color: #42A5F5;
    }

    .btnNormal:hover {
        background-color: #1E88E5;
    }

    .btnSuccess {
        background-color: #66BB6A;
    }

    .btnSuccess:hover {
        background-color: #43A047;
    }

    .btnError {
        background-color: #EF5350;
    }

    .btnError:hover {
        background-color: #E53935;
    }

    .btnDisabled, .btnDisabled:hover {
        background-color: #d0d0d0;
        color: #5f5f5f;
        cursor: not-allowed;
    }

    .modalTip {
        background-color: rgba(197, 245, 193, 0.5);
        border-radius: 5px;
        font-size: 14px;
        font-style: italic;
        margin-top: 10px;
        padding: 10px;
        text-align: left;
    }
    
    /* hack for ambiguous links */
    .hidden {
        height: 1px;
        width: 1px;
        overflow: hidden;
        display: block;
    }

    /* form element */
    .form header {
        border-bottom: 4px double #000;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
        padding: 10px;
    }

    .form .requireAlert {
        font-style: italic;
    }

    .form form {
        background-color: #fff;
        border-radius: 5px;
        border: 1px solid #000;
        box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.5);
        overflow: auto;
        padding: 20px;
        position: fixed;
        top: 10%;
        right: 25%;
        bottom: 10%;
        left: 25%;
    }

    .form .buttons {
        padding-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    .form .buttons button {
        width: 50%;
    }

    @media screen and (max-width: 600px) {
        .form form {
            right: 5%;
            left: 5%;
        }

        .form .buttons {
            flex-direction: column;
        }

        .form .buttons button {
            width: initial;
        }
    }
</style>
