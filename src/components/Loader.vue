<template>
   <div id="loader" v-if="display">
        <span class="fas fa-cog fa-2x fa-spin"></span>
        <span class="text">{{ label }}</span>
    </div> 
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component
    export default class Loader extends Vue {
        // non-null assertion operator
        @Prop({ required: true }) label!: string;
        @Prop({ required: true }) display!: boolean;
    }
</script>

<style scoped>
    #loader {
        padding: 15px;
        display: flex;
    }

    #loader .text {
        font-size: 28px;
        font-weight: bold;
        padding-left: 10px;
    }
</style>