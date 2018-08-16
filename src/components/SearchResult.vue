<template>
    <div id="search-result">
        <div class="wrapper">
            <span class="title">{{ result.FirstName }} {{ result.LastName }}</span>
            <div class="info">
                <span>Phone</span>
                <span>{{ result.Phone }}</span>
            </div>
            <div class="info" v-if="result.Fax !== undefined">
                <span>Fax</span>
                <span>{{ result.Fax }}</span>
            </div>
            <div class="info" v-if="result.Cellular !== undefined">
                <span>Cellular</span>
                <span>{{ result.Cellular }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component
    export default class SearchResult extends Vue {
        @Prop() result: any;
    }
</script>

<style scoped>
    #search-result {
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
        display: flex;
        justify-content: flex-start;
    }

    .info {
        display: grid;
        grid-template-columns: 100px auto;
    }

    .info:hover {
        background-color: #e8c770;
        border-radius: 3px;
    }

    .info span {
        cursor: default;
        padding: 5px 25px;
        display: flex;
        justify-content: flex-start;
    }
</style>