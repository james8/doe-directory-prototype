<template>
    <div id="search">
        <header class="title">{{ title }}</header>
        <advanced-search-options @advancedSearchString="ReturnedSearchOptions($event);" tabindex="-1"></advanced-search-options>
        <search-box :advancedOptions="advancedSearchString" @returnedSearchResults="ReturnedSearchResults($event);"></search-box>
        
        <div class="separator" id="top-separator"></div>        

        <div class="search-wrap" v-if="(results.queryResults !== undefined) && (results.queryResults.length > 0)">
            <div class="resultTotal">{{results.queryResults.length}} result(s) found</div>
            <div class="resultSort">
                <label for="sortList">Sort By&nbsp;</label>
                <select id="sortList" @change="sortResults($event)">
                    <option value="FirstName">First Name</option>
                    <option value="LastName">Last Name</option>
                    <option value="District">District / Office</option>
                    <option value="ComplexArea">Complex Area / Branch</option>
                    <option value="Complex">Complex / Section</option>
                    <option value="School">School / Sub-Section</option>
                    <option value="Position">Position</option>
                </select>
            </div>
        </div>
        
        <br />

        <user v-for="(result, index) in lazyResults" :key="index" :index="index" :user="result" :type="(result.emplId === undefined) ? 'school' : 'office'"></user>
        <p v-if="(results.queryResults !== undefined) && (results.queryResults.length === 0)">{{ noResults }}</p>        

        <div class="search-wrap" v-if="!reachedEnd && (results.queryResults !== undefined) && (results.queryResults.length > 0)">
            <div @click="loadMore()" id="load-more">Loading...</div>
        </div>

        <br />
        <br />
        
        <div id="back-to-top">
            <a href="#navigation-tabs">Back to Top</a>
        </div>

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
        resultSize: number = 10;
        lazyLoadTrigger: boolean = false;
        reachedEnd: boolean = true;

        // search
        noResults: string = "No results found. Please try a different search.";
        results: Object = {};
        resultsArray: Array<object> = [];
        lazyResults: Array<object> = [];

        created(): void {
            // setTimeout(() => { (document.getElementById('advanced-search-options') as HTMLElement).focus(); }, 50);
            window.addEventListener('scroll',this.handleScroll);
        }

        destroyed(): void{
            window.removeEventListener('scroll',this.handleScroll)
        }

        handleScroll(){
            if(scrollY > 700) (document.getElementById('back-to-top') as HTMLElement).classList.add("visible");
            else (document.getElementById('back-to-top') as HTMLElement).classList.remove("visible");
            if(scrollY >= (document.body.scrollHeight - window.innerHeight-50) && this.resultsArray.length > 0 && this.lazyLoadTrigger){
                setTimeout(()=> this.loadMore(),800);
                this.lazyLoadTrigger = false;
            }
        }        
        
        loadMore(): void{
            this.resultsArray.slice(this.resultSize, this.resultSize+10).forEach(r => {
                this.lazyResults.push(r);
            })
            this.resultSize += 10;
            if(this.resultSize >= this.resultsArray.length) {
                this.lazyLoadTrigger = false;
                this.reachedEnd = true;
            }else{
                this.lazyLoadTrigger = true;
            }
        }

        sortResults(event: any): void{
            this.lazyLoadTrigger = false;
            this.lazyResults = [];
            let tempArray = this.resultsArray.sort(function(a,b){
                let aVal: string = '';
                let bVal: string = '';
                switch ((document.getElementById('sortList') as HTMLSelectElement).value){
                    case "FirstName":
                        aVal = a.firstName;
                        bVal = b.firstName;
                        break;
                    case "LastName":
                        aVal = a.lastName;
                        bVal = b.lastName;
                        break;
                    case "District":
                        aVal = a.district;
                        bVal = b.district;
                        break;
                    case "ComplexArea":
                        aVal = a.complexArea;
                        bVal = b.complexArea;
                        break;
                    case "Complex":
                        aVal = a.complex;
                        bVal = b.complex;
                        break;
                    case "School":
                        aVal = a.school;
                        bVal = b.school;
                        break;
                    case "Position":
                        aVal = a.posn;
                        bVal = b.posn;
                }
                if(a.firstName === 'Vacant') return 1;
                if(aVal.toLowerCase() > bVal.toLowerCase()) return 1;
                if(aVal.toLowerCase() < bVal.toLowerCase()) return -1;
                return 0;
            });
            this.resultsArray = [];
            this.resultsArray = tempArray;
            this.resultSize = 0;
            this.reachedEnd = false;
            this.lazyLoadTrigger = true;
        }

        ReturnedSearchOptions(event: string): void {
            this.advancedSearchString = event;
        }

        ReturnedSearchResults(event: string): void {
            this.results = event;
            this.resultsArray = this.results.queryResults;
            this.resultSize = 10;
            this.lazyResults = this.resultsArray.slice(0,this.resultSize);
            if(this.resultsArray.length > this.resultSize){
                this.lazyLoadTrigger = true;
                this.reachedEnd = false;
            }else{ 
                this.lazyLoadTrigger = false;
                this.reachedEnd = true;
            }
            setTimeout(() => {(document.getElementById('top-separator') as HTMLElement).scrollIntoView({behavior:"smooth", block:"start"}); 
            (document.getElementById('sortList') as HTMLSelectElement).selectedIndex = 0;},300);
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

    .search-wrap {
        padding-top:10px;
        text-align:center;
    }

    .resultTotal{
        float:left;
        font-size:.8em;
        width:140px;
        padding-top:5px;
    }

    .resultSort{
        float:right;
        font-size:.8em;
        height:40px;
        margin-right:10px;
    }

    #load-more{
        font-size:1.2em;
    }

    #back-to-top {
        background: #c8e6c9;
        border: 4px solid #4caf50;
        -webkit-box-sizing: initial;
        box-sizing: initial;
        border-radius: 5px;
        color: #000!important;
        cursor: pointer;
        height: 35px;
        opacity: 0;
        padding: 5px;
        text-decoration: none!important;
        width: 65px;
        position: fixed;
        right: 10px;
        bottom: 10px;
        z-index: -10;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }

    #back-to-top.visible {
        opacity: 1;
        z-index: 10;
    }

    #back-to-top, #back-to-top.visible {
        -webkit-transition: opacity .5s ease;
        transition: opacity .5s ease;
    }

    #back-to-top a {
        color: #000;
        text-decoration: none;
    }

    br{
        clear:both;
    }
</style>