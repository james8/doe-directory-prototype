<template>
    <div id="search">
        <span class="title">{{ title }}</span>
        <SearchBox @returnedSearchResults="ReturnedSearchResults($event);"></SearchBox>
        
        <div class="separator"></div>

        <User v-for="(result, index) in results.queryResults" :key="index" :user="result" :type="(result.NAME_FIRST_TX === '') ? 'school' : 'person'"></User>
        <p v-if="(results.queryResults !== undefined) && (results.queryResults.length === 0)">{{ noResults }}</p>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import SearchBox from "@/components/SearchBox.vue";
    import User from "@/components/User.vue";

    @Component({
        components: {
            SearchBox,
            User
        }
    })
    export default class Search extends Vue {
        title: string = "Directory";
        noResults: string = "No results found. Please try a different search.";
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
</style>