<template>
    <div id="search">
        <header class="title">{{ title }}</header>
        <advanced-search-options @advancedSearchString="ReturnedSearchOptions($event);" tabindex="-1"></advanced-search-options>
        <search-box :advancedOptions="advancedSearchString" @returnedSearchResults="ReturnedSearchResults($event);"></search-box>
        
        <div class="separator"></div>

        <div class="paginator" id="top-paginator" v-if="(results.queryResults !== undefined) && (results.queryResults.length > 0)">
            <div class="resultTotal">{{results.queryResults.length}} result(s) found</div>
            <div class="paginatorLink prev" @click="prevPage('top')">Prev</div>
            <div class="pageNum">{{pageNumber+1}} of {{pageCount()}}</div>
            <div class="paginatorLink next" @click="nextPage('top')">Next</div>
        </div>
        
        <br />

        <user v-for="(result, index) in paginatedData()" :key="index" :index="index" :user="result" :type="(result.emplId === undefined) ? 'school' : 'office'"></user>
        <p v-if="(results.queryResults !== undefined) && (results.queryResults.length === 0)">{{ noResults }}</p>        

        <div class="paginator" v-if="(results.queryResults !== undefined) && (results.queryResults.length > 0)">
            <div class="resultTotal">{{bottomCount()}}</div>
            <div class="paginatorLink prev" @click="prevPage('bottom')">Prev</div>
            <div class="pageNum">{{pageNumber+1}} of {{pageCount()}}</div>
            <div class="paginatorLink next" @click="nextPage('bottom')">Next</div>
        </div>

        <br />
        <br />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import AdvancedSearchOptions from "@/components/AdvancedSearchOptions.vue";
    import SearchBox from "@/components/SearchBox.vue";
    import User from "@/components/User.vue";
import { setTimeout } from 'timers';

    @Component({
        components: {
            AdvancedSearchOptions,
            SearchBox,
            User
        }
    })
    export default class Search extends Vue {
        title: string = "Search";
        
        advancedSearchString: string = "";

        pageNumber: number = 0;
        resultSize: number = 10;
        
        nextPage(pos:string): void{
            if(this.pageNumber < this.pageCount() -1){
                this.pageNumber++; 
                if(pos === 'bottom'){
                    //let container = this.$el.querySelector("#search-box-form");
                    //container.scrollIntoView({behavior:"smooth"});
                    (document.getElementById('top-paginator') as HTMLElement).scrollIntoView({behavior:"smooth", block:"start"});
                }
            }
        }
        prevPage(pos:string): void{
            if(this.pageNumber !== 0){
                this.pageNumber--;            
                if(pos === 'bottom'){
                    //let container = this.$el.querySelector("#search-box-form");
                    //container.scrollIntoView({behavior:"smooth"});                    
                    (document.getElementById('top-paginator') as HTMLElement).scrollIntoView({behavior:"smooth", block:"start"});
                }
            }
        }

        pageCount(): number{
            let l = this.resultsArray.length,
            s = this.resultSize;
            return Math.ceil(l/s);
        }

        bottomCount(): string{
            let lastOne: number;
            let count: string;
            if(this.pageCount() === 1) return "showing 1 - " + this.resultsArray.length.toString()
            else {
                lastOne = (this.pageNumber * this.resultSize) + this.resultSize;
                if(this.resultsArray.length > lastOne) count = lastOne.toString()
                else count = this.resultsArray.length.toString()
                return "showing " + ((this.pageNumber * this.resultSize) + 1) + "-" + count + " of " + this.resultsArray.length.toString()
            }
        }

        paginatedData(): Array<object>{
            const start = this.pageNumber * this.resultSize,
            end = start + this.resultSize;
            return this.resultsArray.slice(start,end);
        }

        // search
        noResults: string = "No results found. Please try a different search.";
        results: Object = {};
        resultsArray: Array<object> = [];

        created(): void {
            // setTimeout(() => { (document.getElementById('advanced-search-options') as HTMLElement).focus(); }, 50);
        }

        ReturnedSearchOptions(event: string): void {
            this.advancedSearchString = event;
        }

        ReturnedSearchResults(event: string): void {
            this.results = event;
            this.resultsArray = this.results.queryResults;
            this.pageNumber = 0;
            let scrollTo:string = '';
            if(this.resultsArray.length > 0) scrollTo = 'top-paginator';
            else scrollTo = 'search-box-form'
            setTimeout(() => {(document.getElementById(scrollTo) as HTMLElement).scrollIntoView({behavior:"smooth", block:"start"})},300);
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

    .paginator {
        padding-top:10px;
        text-align:center;
    }

    .paginatorLink{
        text-decoration: underline;
        cursor: pointer;
        float:left;
        height:30px;
        width:100px;
    }

    .prev{
        margin-left:130px;
    }

    .next{
    }

    .pageNum{
        float:left;
    }

    .resultTotal{
        float:left;
        font-size:.8em;
        width:140px;
    }

    br{
        clear:both;
    }
</style>