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
                <tr class="record" v-for="(result, index) in results" :key="index">
                    <td class="resultIcon">
                        <button type="button" class="fas fa-pencil-alt" @click="Edit(result, index);" :disabled="editing">
                            <span class="hidden">Edit {{ result.Title }}</span>
                        </button>
                    </td>
                    <td>{{ result.Title }}</td>
                    <td>{{ result.Phone | FPhoneNumber }}</td>
                    <td>{{ result.Phone2 | FPhoneNumber }}</td>
                    <td class="wordBreak">{{ result.Email }}</td>
                    <td class="wordBreak">{{ result.Site }}</td>
                    <td>{{ result.Modified }}</td>
                </tr>
            </tbody>
        </table>

        <div id="frequently-called-mobile-view" v-for="(result, index) in results" :key="index">
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
    import FPhoneNumber from "@/filters/PhoneNumber.ts";
    import Loader from "@/components/Loader.vue";
    import User from "@/components/User.vue";
    import FrequentlyCalledEdit from "@/components/FrequentlyCalledEdit.vue";
    import data from "@/../data/frequentlyCalledResults.ts";

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
        },
        filters: {
            'FPhoneNumber': FPhoneNumber
        }
    })
    export default class Admin_FrequentlyCalled extends Vue {
        results: Array<any | IFrequentlyCalled> = [];
        selectedResult: any = {};
        loading: boolean = true;
        editing: boolean = false;

        created(): void {
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
                    const results: Array<IFrequentlyCalled> = data;
                    resolve(results);
                }, 2500);
            });
        }

        Edit(result: any, index: number): void {
            this.selectedResult = result;
            this.selectedResult['index'] = index;
            this.editing = true;

            // disable navigation & edit buttons
            const elems: NodeListOf<Element> = document.querySelectorAll('.resultIcon button');
            elems.forEach(elem => (elem.setAttribute('inert', '')));
            (document.getElementById('NavigationTabs') as HTMLInputElement).setAttribute('inert', '');            
        }

        ReturnedFCData(event: any): void {
            this.editing = false;
            this.loading = true;
            this.results = [];
            this.selectedResult = {};
            (document.getElementById('NavigationTabs') as HTMLInputElement).removeAttribute('inert');            

            this.Load();
        }
    }
</script>

<style scoped>
    caption {
        height: 1px;
        width: 1px;
        overflow: hidden;
    }

    #frequently-called-mobile-view {
        text-align: left;
        display: none;
    }

    #frequently-called-mobile-view button {
        margin: 10px 0px 0px 10px;
    }

    #frequently-called-mobile-view .fas::before {
        padding-right: 5px;
    }

    @media screen and (max-width: 1032px) {
        #frequently-called-data {
            display: none;
        }

        #frequently-called-mobile-view {
            display: block;
        }
    }
</style>