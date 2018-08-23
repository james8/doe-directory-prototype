<template>
    <div id="frequently-called-result">
        <div class="wrapper">
            <span class="title">{{ result.Title }}</span>
            <div class="info">
                <span>Phone</span>
                <span>{{ result.Phone }}</span>
            </div>
            <div class="info" v-if="result.Phone2 !== undefined">
                <span>Phone 2</span>
                <span>{{ result.Phone2 }}</span>
            </div>
            <div class="info" v-if="result.Email !== undefined">
                <span>Email</span>
                <span class="longVal">{{ result.Email }}</span>
            </div>
            <div class="info" v-if="result.Site !== undefined">
                <span>Site</span>
                <span class="longVal">{{ result.Site }}</span>
            </div>
            <div class="info">
                <span>Modified</span>
                <span class="longVal">{{ result.Modified }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component
    export default class FrequentlyCalledResult extends Vue {
        @Prop() result: any;
    }
</script>

<style scoped>
    #frequently-called-result {
        border-bottom: 1px dotted #000;
    }

    .wrapper {
        margin: 5px;
        padding: 15px;
    }

    .wrapper:hover {
        background-color: #eab21d;
        border-radius: 5px;
    }

    .title {
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 10px;
        text-align: left;
        display: flex;
        justify-content: flex-start;
    }

    .info {
        border-bottom: 1px solid #000;
        display: grid;
        grid-template-columns: 100px auto;
    }

    .info:last-of-type {
        border-bottom: none;
    }

    .info:hover {
        background-color: #e8c770;
        border-radius: 3px;
    }

    .info span {
        cursor: default;
        padding: 5px 15px;
        display: flex;
        justify-content: flex-start;
    }

    .info span:first-child {
        background-color: rgba(243, 243, 243, 0.5);
    }

    .longVal {
        text-align: left;
        word-break: break-all;
    }
</style>