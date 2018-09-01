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
</style>
