<template>
    <div id="admin-frequently-called">
        <br/>
        <h1>Frequently Called</h1>
        <button type="button" id="fc-add" class="btn btnSuccess" @click="adding = true">
            <span class="fas fa-plus"></span>
            <span>new</span>
        </button>

        <table id="frequently-called-data" cellspacing="0" width="100%">
            <caption>Frequently Called Information</caption>
            <thead>
                <tr>
                    <th scope="col" class="resultIcon"></th>
                    <th scope="col">Title</th>
                    <th scope="col" class="resultPhone">Contacts</th>
                    <th scope="col">Email</th>
                    <th scope="col">Site</th>
                    <th scope="col" class="resultModified">Modified</th>
                </tr>
            </thead>
            <tbody>
                <tr class="record" v-for="(fc, index) in frequentlyCalled" :key="index">
                    <td class="resultIcon">
                        <button type="button" class="fas fa-pencil-alt" @click="OpenForm(fc, true);" :disabled="editing">
                            <span class="hidden">Edit {{ fc.title }}</span>
                        </button>
                    </td>
                    <td>
                        <span class="fakeLink" @click="OpenForm(fc, false);">{{ fc.title }}</span>
                    </td>
                    <td>
                        <div class="contacts">
                            <span>{{ fc.contact | FPhoneNumber }}</span>
                            <span v-if="fc.contact2 !== ''">{{ fc.contact2 | FPhoneNumber }}</span>
                        </div>
                    </td>
                    <td class="wordBreak">{{ fc.email }}</td>
                    <td class="wordBreak">{{ fc.site }}</td>
                    <td>{{ fc.modified }}</td>
                </tr>
            </tbody>
        </table>

        <div id="frequently-called-mobile-view" v-for="(fc, index) in frequentlyCalled" :key="index">
            <user :user="fc" :type="'edit-frequently-called'">
                <div class="injectedTitle">
                    <button type="button" class="fas fa-pencil-alt" @click="OpenForm(fc, true);">
                        <span class="hidden">Edit {{ fc.title }}</span>
                    </button>
                    <span :id="`region${ index }`" class="title fakeLink" @click="OpenForm(fc, false);">{{ fc.title }}</span>
                </div>
            </user>
        </div>

        <loader :label="'Loading...'" :display="loading"></loader>

        <frequently-called-edit v-if="editing || viewing" :frequentlyCalled="selectedResult" @returnedFCData="ReturnedFCData($event);" :editable="editing"></frequently-called-edit>

        <frequently-called-add v-if="adding" @returnedFCData="ReturnedFCData($event);"></frequently-called-add>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import Auth from "@/mixins/Auth.ts";
    import data from "@/../data/frequentlyCalledResults.ts";

    import FPhoneNumber from "@/filters/PhoneNumber.ts";

    import IFrequentlyCalled from "@/interfaces/IFrequentlyCalled.ts";

    import FrequentlyCalledAdd from "@/components/FrequentlyCalledAdd.vue";
    import FrequentlyCalledEdit from "@/components/FrequentlyCalledEdit.vue";
    import Loader from "@/components/Loader.vue";
    import User from "@/components/User.vue";

    @Component({
        components: {
            FrequentlyCalledAdd,
            FrequentlyCalledEdit,
            Loader,
            User
        },
        filters: {
            'FPhoneNumber': FPhoneNumber
        },
        mixins: [
            Auth
        ]
    })
    export default class Admin_FrequentlyCalled extends Vue {
        frequentlyCalled: Array<any | IFrequentlyCalled> = [];
        selectedResult: any | IFrequentlyCalled = {};
        loading: boolean = true;
        apiFail: boolean = false;
        adding: boolean = false;
        editing: boolean = false;
        viewing: boolean = false;

        created(): void {
            if (Auth.methods.Auth_IsAuthenticated()) {
                this.Load();

                // Load Edit form if cached data is present
                const isNew: boolean = JSON.parse(sessionStorage.getItem('frequently-called.new') || 'false');
                const original: Object = JSON.parse(sessionStorage.getItem('frequently-called.original') || '{}');
                if (isNew) this.OpenForm('{}', false);
                else if (Object.keys(original).length > 0) this.OpenForm(original, true);
            }
            else Auth.methods.Auth_Login();
        }

        Load(): void {
            this.QueryFrequentlyCalled().then((results: Array<any | IFrequentlyCalled>) => {
                this.loading = false;
                this.frequentlyCalled = results;
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

        OpenForm(result: Object, editable: boolean): void {
            this.selectedResult = result;
            if (this.selectedResult !== '{}') editable ? (this.editing = true) : (this.viewing = true);
            else this.adding = true;

            // disable navigation & edit buttons
            const navElems: NodeListOf<Element> = document.querySelectorAll('navigation-tabs');
            const elems: NodeListOf<Element> = document.querySelectorAll('#admin-frequently-called button');
            elems.forEach(elem => (elem.setAttribute('inert', '')));
            // (document.getElementById('NavigationTabs') as HTMLInputElement).setAttribute('inert', '');            
        }

        ReturnedFCData(event: any): void {
            this.adding = false;
            this.editing = false;
            this.viewing = false;
            this.loading = true;
            this.frequentlyCalled = [];
            this.selectedResult = {};

            // enable navigation & edit buttons
            const navElems: NodeListOf<Element> = document.querySelectorAll('navigation-tabs');
            const elems: NodeListOf<Element> = document.querySelectorAll('#admin-frequently-called button');
            elems.forEach((elem: Element) => elem.removeAttribute('inert'));

            this.Load();
        }
    }
</script>

<style scoped>
    h1 {
        padding-left: 25px;
        text-align: left;
    }

    #fc-add {
        font-size: 14px;
        margin-bottom: 10px;
        margin-left: 20px;
        display: flex;
    }

    #fc-add span:last-of-type {
        padding-right: 5px;
        padding-left: 5px;
    }

    caption {
        height: 1px;
        width: 1px;
        overflow: hidden;
    }

    table {
        margin-top: 0px;
    }
    
    .injectedTitle {
        display: flex;
    }

    .injectedTitle .fas {
        background-color: transparent;
        border: none;
        cursor: pointer;
        font-size: 21px;
        margin: 0px;
        padding: 10px 0px 10px 10px;
    }

    .fakeLink {
        color: #000;
    }

    .fakeLink:hover {
        color: #0000da;
    }

    .contacts {
        display: flex;
        flex-direction: column;
    }

    .contacts span:last-of-type {
        padding-top: 5px;
    }

    #frequently-called-mobile-view {
        text-align: left;
        display: none;
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