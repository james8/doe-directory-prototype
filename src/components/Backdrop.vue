<template>
    <div id="backdrop"></div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    @Component
    export default class Backdrop extends Vue {
        
    }
</script>


<style scoped>
    #backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        /* top: 48px; */
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
    }
</style>
