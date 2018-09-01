<template>
    <div id="admin-frequently-called">
        <table id="frequently-called-data" cellspacing="0" width="100%">
            <caption>Frequently Called Information</caption>
            <thead>
                <tr>
                    <th scope="col" class="resultIcon"></th>
                    <th scope="col">Title</th>
                    <th scope="col" class="resultPhone">Phone 1</th>
                    <th scope="col" class="resultPhone">Phone 2</th>
                    <th scope="col">Email</th>
                    <th scope="col">Site</th>
                    <th scope="col" class="resultModified">Modified</th>
                </tr>
            </thead>
            <tbody>
                <tr class="records" v-for="(result, index) in results" :key="index">
                    <td class="resultIcon">
                        <button type="button" class="fas fa-pencil-alt" @click="Edit(result, index);" :disabled="editing">
                            <span class="hidden">Edit {{ result.Title }}</span>
                        </button>
                    </td>
                    <td>{{ result.Title }}</td>
                    <td>{{ result.Phone }}</td>
                    <td>{{ result.Phone2 }}</td>
                    <td class="resultOther">{{ result.Email }}</td>
                    <td class="resultOther">{{ result.Site }}</td>
                    <td>{{ result.Modified }}</td>
                </tr>
            </tbody>
        </table>

        <div id="frequently-called-mobile-data" v-for="(result, index) in results" :key="index">
            <button type="button" class="fas fa-pencil-alt btn btnNormal" @click="Edit(result, index);" :disabled="editing">
                Edit
                <span class="hidden">{{ result.Title }}</span>
            </button>
            <User :user="result" :type="'frequently-called'"></User>
        </div>
        <Loader :label="'Loading...'" :display="loading"></Loader>

        <FrequentlyCalledEdit v-if="editing" :result="selectedResult" @returnedFCData="ReturnedFCData($event);"></FrequentlyCalledEdit>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import Loader from "@/components/Loader.vue";
    import User from "@/components/User.vue";
    import FrequentlyCalledEdit from "@/components/FrequentlyCalledEdit.vue";

    interface IFrequentlyCalled {
        Title: string;
        Phone: string;
        Phone2?: string;
        Email?: string;
        Site?: string;
        Modified: string;
    }

    @Component({
        components: {
            Loader,
            User,
            FrequentlyCalledEdit
        }
    })
    export default class Admin_FrequentlyCalled extends Vue {
        results: Array<any | IFrequentlyCalled> = [];
        selectedResult: any = {};
        loading: boolean = true;
        editing: boolean = false;

        constructor() {
            super();
            this.Load();
        }

        Load(): void {
            this.QueryFrequentlyCalled().then((results: Array<any | IFrequentlyCalled>) => {
                this.loading = false;
                this.results = results;
            });
        }

        QueryFrequentlyCalled(): Promise<Array<any | IFrequentlyCalled>> {
            return new Promise((resolve, reject) => {
                // Fake data - Run actual data here
                setTimeout(() => {
                    const results: Array<IFrequentlyCalled> = [
                        {
                            Title: 'ELL',
                            Phone: '(000) 000-0000',
                            Modified: '07/18/2017 00:00:00AM'
                        },
                        {
                            Title: 'FMS, Help Desk',
                            Phone: '(111) 111-1111',
                            Modified: '07/18/2017 00:00:00AM'
                        },
                        {
                            Title: 'Food Services',
                            Phone: '(222) 222-2222',
                            Phone2: '(333) 333-3333',
                            Modified: '07/18/2017 00:00:00AM'
                        },
                        {
                            Title: 'Fraud and Ethics Hotline',
                            Phone: '(444) 444-4444',
                            Site: 'reportlineweb.com/hidoe',
                            Modified: '07/18/2017 00:00:00AM'
                        },
                        {
                            Title: 'Recruitment - Classified/Support Services Personnel Recruitment',
                            Phone: '(555) 555-5555',
                            Email: 'cssp_recruitment@hawaiidoe.org',
                            Modified: '07/18/2017 00:00:00AM'
                        },
                        {
                            Title: 'TSEAS, Help Desk',
                            Phone: '(666) 666-6666',
                            Email: 'help_tseas@notes.k12.hi.us',
                            Site: 'hawaiipublicschools.org',
                            Modified: '07/18/2017 00:00:00AM'
                        }
                    ];
                    resolve(results);
                }, 2500);
            });
        }

        Edit(result: any, index: number): void {
            this.selectedResult = result;
            this.selectedResult['index'] = index;
            this.editing = true;

            (document.getElementById('NavigationTabs') as HTMLInputElement).setAttribute('inert', '');            
        }

        ReturnedFCData(event: any) {
            this.editing = false;
            setTimeout(() => {
                (document.querySelectorAll('#frequently-called-data button')[this.selectedResult.index] as HTMLInputElement).focus();
                (document.querySelectorAll('#frequently-called-mobile-data button')[this.selectedResult.index] as HTMLInputElement).focus();
                this.selectedResult = {};

                (document.getElementById('NavigationTabs') as HTMLInputElement).removeAttribute('inert');
            }, 50);
        }
    }
</script>

<style scoped>
    caption {
        height: 1px;
        width: 1px;
        overflow: hidden;
    }

    table {
        border: 1px solid #000;
        margin: 20px;
        table-layout: fixed;
        width: calc(100% - 40px);
    }

    th {
        background: linear-gradient(#166f94, #10536f);
        border-right: 1px solid #ddd;
        border-bottom: 1px solid #000;
        color: #fff;
        font-weight: normal;
    }

    th, td {
        padding: 10px;
        text-align: left;
    }

    th:last-of-type, td:last-of-type {
        border-right: none;
    }

    tbody tr:nth-child(even) {
        background-color: #ddd;
    }

    .resultIcon {
        width: 23px;
    }

    .resultIcon button {
        background-color: transparent;
        border: none;
        font-size: 21px;
        padding: 0px;
    }

    .resultIcon .fas {
        cursor: pointer;
    }

    .resultPhone {
        width: 110px;
    }

    .resultOther {
        word-break: break-all;
    }

    .resultModified {
        width: 90px;
    }

    #frequently-called-mobile-data {
        text-align: left;
        display: none;
    }

    #frequently-called-mobile-data button {
        margin: 10px 0px 0px 10px;
    }

    #frequently-called-mobile-data .fas::before {
        padding-right: 5px;
    }

    .hidden {
        height: 1px;
        width: 1px;
        overflow: hidden;
        display: block;
    }

    @media screen and (max-width: 1032px) {
        #frequently-called-data {
            display: none;
        }

        #frequently-called-mobile-data {
            display: block;
        }
    }
</style>