<template>
    <div id="search">
        <span class="title">{{ title }}</span>
        <SearchBox @returnedSearchResults="ReturnedSearchResults($event);"></SearchBox>
        <div class="separator"></div>
        <div id="search-results" v-if="Object.keys(results).length > 0">
            <span class="queryTitle">Results for {{ results.category.toUpperCase() }}: "{{ results.searchParam.toUpperCase() }}"</span>
            <hr>
            <SearchResult v-for="(result, index) in results.queryResults" :key="index" :result="result"></SearchResult>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import SearchBox from '../components/SearchBox.vue';
    import SearchResult from '../components/SearchResult.vue';

    @Component({
        components: { SearchBox, SearchResult }
    })
    export default class Search extends Vue {
        title: string = "Directory";
        results: Object = {};

        ReturnedSearchResults(event: Object) {
            this.results = event;
        }
    }
</script>

<style scoped>
    #search {
        margin: 0px auto;
        max-width: 800px;
    }

    .title {
        font-size: 32px;
        font-weight: bold;
        padding: 10px;
        display: flex;
    }

    .separator {
        border-bottom: 4px double #01a0e6;
        margin-right: 10px;
        margin-left: 10px;
    }

    #search-results {
        margin: 0px auto;
        max-width: 800px;
        padding-top: 15px;
    }

    #search-results span {
        font-size: 24px;
        padding: 0px 15px;
    }
</style>