<template>
    <div id="frequently-called">
        <span class="title">{{ title }}</span>

        <div id="frequently-called-filter">
            <label for="filter">Search:</label>
            <input id="filter" type="text" v-model="filterParam" @input="Filter()" :disabled="loading" />
        </div>
        
        <div class="separator"></div>
        <Loader :label="'Loading...'" :display="loading"></Loader>

        <div id="frequently-called-results" v-if="results.length > 0">
            <FrequentlyCalledResult v-for="(result, index) in results" :key="index" :result="result"></FrequentlyCalledResult>
        </div>

        <span class="noResults" v-if="(tempResults.length > 0) && (results.length === 0)">No matching results</span>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from 'vue-property-decorator';
    import FrequentlyCalledResult from '../components/FrequentlyCalledResult.vue';
    import Loader from '../components/Loader.vue';

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
            FrequentlyCalledResult,
            Loader
        }
    })
    export default class FrequentlyCalled extends Vue {
        title: string = "Frequently Called Numbers";
        results: Array<any | IFrequentlyCalledResult> = [];
        tempResults: Array<any | IFrequentlyCalledResult> = [];
        loading: boolean = true;
        filterParam: string = "";

        constructor() {
            super();
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
                    const results: Array<IFrequentlyCalledResult> = [
                        {
                            Title: 'ELL',
                            Phone: '(000) 000-0000',
                            Modified: '07/18/2017 0:00:00AM'
                        },
                        {
                            Title: 'FMS, Help Desk',
                            Phone: '(111) 111-1111',
                            Modified: '07/18/2017 0:00:00AM'
                        },
                        {
                            Title: 'Food Services',
                            Phone: '(222) 222-2222',
                            Phone2: '(333) 333-3333',
                            Modified: '07/18/2017 0:00:00AM'
                        },
                        {
                            Title: 'Fraud and Ethics Hotline',
                            Phone: '(444) 444-4444',
                            Site: 'reportlineweb.com/hidoe',
                            Modified: '07/18/2017 0:00:00AM'
                        },
                        {
                            Title: 'Recruitment - Classified/Support Services Personnel Recruitment',
                            Phone: '(555) 555-5555',
                            Email: 'cssp_recruitment@hawaiidoe.org',
                            Modified: '07/18/2017 0:00:00AM'
                        },
                        {
                            Title: 'TSEAS, Help Desk',
                            Phone: '(666) 666-6666',
                            Email: 'help_tseas@notes.k12.hi.us',
                            Site: 'hawaiipublicschools.org',
                            Modified: '07/18/2017 0:00:00AM'
                        }
                    ];
                    resolve(results);
                }, 2500);
            });
        }

        Filter(): void {
            this.results = this.tempResults;
            this.results = this.results.filter(item => 
                item.Title.toLowerCase().includes(this.filterParam.toLowerCase())
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
