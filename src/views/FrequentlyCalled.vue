<template>
    <div id="frequently-called">
        <span class="title">{{ title }}</span>

        <div id="frequently-called-filter">
            <input-field :id="'filter'" :label="'Search'" :isDisabled="loading" @inputChange="Filter($event);"></input-field>
        </div>
        
        <div class="separator"></div>
        <loader :label="'Loading...'" :display="loading"></loader>

        <user v-for="(result, index) in results" :key="index" :user="result" :type="'frequently-called'"></user>

        <span class="noResults" v-if="(tempResults.length > 0) && (results.length === 0)">No matching results</span>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from "vue-property-decorator";
    import InputField from "@/components/InputField.vue";
    import Loader from "@/components/Loader.vue";
    import User from "@/components/User.vue";
    import data from "@/../data/frequentlyCalledResults.js";

    interface IFrequentlyCalledResult {
        Title: string;
        Phone: string;
        Phone2?: string;
        Email?: string;
        Site?: string;
        Modified: string;
    }

    @Component({
        components: {
            InputField,
            Loader,
            User,
        }
    })
    export default class FrequentlyCalled extends Vue {
        title: string = "Frequently Called Numbers";
        results: Array<any | IFrequentlyCalledResult> = [];
        tempResults: Array<any | IFrequentlyCalledResult> = [];
        loading: boolean = true;
        filterParam: string = "";

        created(): void {
            this.Load();
        }

        Load(): void {
            this.QueryFrequentlyCalled().then((results: Array<any | IFrequentlyCalledResult>) => {
                this.loading = false;
                this.results = results;
                this.tempResults = results;
            });
        }

        QueryFrequentlyCalled(): Promise<Array<any | IFrequentlyCalledResult>> {
            return new Promise((resolve, reject) => {
                // Fake data - Run actual data here
                setTimeout(() => {
                    const results: Array<IFrequentlyCalledResult> = data;
                    resolve(results);
                }, 2500);
            });
        }

        Filter(event: any): void {
            this.results = this.tempResults;
            this.results = this.results.filter(item => 
                item.Title.toLowerCase().includes(event.toLowerCase())
            );
        }
    }
</script>

<style scoped>
    #frequently-called {
        margin: 0px auto;
        max-width: 800px;
    }

    .title {
        font-size: 32px;
        font-weight: bold;
        padding: 10px;
        display: flex;
    }

    #frequently-called-filter {
        margin: 20px;
        text-align: left;
        display: grid;
        grid-template-rows: repeat(2, auto);
    }

    #frequently-called-filter label {
        padding-bottom: 5px;
    }

    .separator {
        border-bottom: 4px double #01a0e6;
        margin-right: 10px;
        margin-left: 10px;
    }

    #frequently-called-results {
        margin: 0px auto;
        max-width: 800px;
        padding-top: 15px;
    }

    .noResults {
        padding: 10px;
        display: block;
    }
</style>
