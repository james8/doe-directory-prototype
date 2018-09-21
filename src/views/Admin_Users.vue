<template>
    <div id="admin-users">
        <!-- <button type="button" id="new-btn" class="btn btnNormal" @click="Add();">
            Add New Employee 
        </button> -->

        <table id="users" cellspacing="0" width="100%">
            <caption>User Information</caption>
            <thead>
                <tr>
                    <th scope="col" class="resultIcon"></th>
                    <th scope="col">Name</th>
                    <th scope="col">Office</th>
                    <th scope="col" class="resultPhone">Phone</th>
                    <th scope="col" class="resultExt">Ext</th>
                    <th scope="col" class="resultOther">Other</th>
                    <th scope="col" class="resultDate">Start Date</th>
                    <th scope="col" class="resultDate">End Date</th>
                </tr>
            </thead>
            <tbody>
                <tr class="record" v-for="(result, index) in results" :key="index">
                    <td class="resultIcon">
                        <button type="button" class="fas fa-pencil-alt" @click="Edit(result, index);">
                            <span class="hidden">Edit {{ result.FirstName }} {{ result.LastName }}</span>
                        </button>
                    </td>
                    <td>{{ result.FirstName }} {{ result.LastName }}</td>
                    <td>
                        {{ result.Office }}
                        <br><br>
                        {{ result.Section }}
                    </td>
                    <td>{{ result.Phone | FPhoneNumber }}</td>
                    <td>{{ result.Ext }}</td>
                    <td class="resultGrid">
                        <span v-if="result.Fax !== ''">F:</span>
                        <span v-if="result.Fax !== ''">{{ result.Fax | FPhoneNumber }}</span>
                        <span v-if="result.Cellular !== ''">C:</span>
                        <span v-if="result.Cellular !== ''">{{ result.Cellular | FPhoneNumber }}</span>
                    </td>
                    <td>{{ result.StartDate }}</td>
                    <td>{{ result.EndDate }}</td>
                </tr>
            </tbody>
        </table>

        <div id="users-mobile-view" v-for="(result, index) in results" :key="index">
            <button type="button" class="fas fa-pencil-alt btn btnNormal" @click="Edit(result, index);">
                Edit
                <span class="hidden">{{ result.FirstName }} {{ result.LastName }}</span>
            </button>
            <User :user="result" :type="'user'"></User>
        </div>

        <Loader :label="'Loading...'" :display="loading"></Loader>

        <UsersEdit v-if="editing" :result="selectedResult" :sections="sections" @returnedFormData="ReturnedFormData($event);"></UsersEdit>
        <button type="button" class="btn btnNormal" @click="GetUserProfile();">GET User Profile</button>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import Auth from "@/mixins/Auth.js";
    import FPhoneNumber from "@/filters/PhoneNumber.js";
    import Loader from "@/components/Loader.vue";
    import User from "@/components/User.vue";
    import UsersEdit from "@/components/UsersEdit.vue";
    import data from "@/../data/usersResults.js";
    import sections from "@/../data/sections.js";

    interface IUser {
        FirstName: string;
        LastName: string;
        Office: string;
        Section: string;
        Phone: string;
        Ext?: string;
        Fax?: string;
        Cellular?: string;
        StartDate?: string;
        EndDate?: string;
        Modified: string;
    }

    @Component({
        components: {
            Loader,
            User,
            UsersEdit
        },
        filters: {
            'FPhoneNumber': FPhoneNumber
        },
        mixins: [
            Auth
        ]
    })
    export default class Admin_Users extends Vue {
        results: Array<IUser> = [];
        sections: Array<any> = [];
        selectedResult: any = {};
        loading: boolean = true;
        editing: boolean = false;

        // DEBUG:
        formResults: any = {};

        created(): void {
            this.Load();
        }

        beforeDestroy(): void {
            sessionStorage.removeItem('sections-loaded');
        }

        Load(): void {
            Promise.all([this.QueryUsers(), this.QuerySections()])
                .then((results: Array<any>) => {
                    this.loading = false;
                    this.results = results[0];
                    this.sections = results[1];
            });
        }
        
        GetUserProfile(): void {
            Auth.methods.Auth_AcquireMSGraphToken()
                .then(token => {
                    // console.log(token);

                    Auth.methods.Auth_GetUserProfileExtended(token)
                        .then(profile => console.log(profile))
                        .catch(error => console.log(error))
                })
                .catch(error => console.log(error));
        }

        QueryUsers(): Promise<Array<IUser>> {
            return new Promise((resolve, reject) => {
                // Fake data - Run real query here
                setTimeout(() => {
                    const results: Array<IUser> = data;

                    try {
                        if (Object.keys(this.formResults).length > 0) {
                            results.push({
                                FirstName: this.formResults.FirstName || '',
                                LastName: this.formResults.LastName || '',
                                Office: this.formResults.Office || '',
                                Section: this.formResults.Section || '',
                                Phone: this.formResults.Phone || '',
                                Ext: this.formResults.Ext || '',
                                Fax: this.formResults.Fax || '',
                                Cellular: this.formResults.Cellular || '',
                                StartDate: this.formResults.StartDate || '',
                                EndDate: this.formResults.EndDate || '',
                                Modified: this.formResults.Modified || ''
                            });
                        }
                    }
                    catch(ex) {}

                    resolve(results);
                }, 2500);
            });
        }

        QuerySections(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                if (sessionStorage.getItem('sections-loaded') === null) {
                    // Fake data - Run real query here (may want to filter sections for specific office?)
                    setTimeout(() => {
                        sessionStorage.setItem('sections-loaded', 'true');
                        // filter depending on office
                        const results: Array<Object> = sections;
                        resolve(results);
                    }, 1000);
                }
                else resolve(this.sections);
            });
        }

        Add(): void {
            this.StartEdit();
        }

        Edit(result: IUser, index: number): void {
            this.selectedResult = result;
            this.selectedResult['index'] = index;
            this.StartEdit();
        }

        StartEdit(): void {
            this.editing = true;

            // disable navigation & edit buttons
            const elems: NodeListOf<Element> = document.querySelectorAll('.resultIcon button');
            elems.forEach(elem => (elem.setAttribute('inert', '')));
            (document.getElementById('NavigationTabs') as HTMLInputElement).setAttribute('inert', '');
        }

        ReturnedFormData(event: any): void {
            this.editing = false;
            this.loading = true;
            this.results = [];
            this.selectedResult = {};
            (document.getElementById('NavigationTabs') as HTMLInputElement).removeAttribute('inert');

            this.formResults = event;

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

    #new-btn {
        display: flex;
        margin: 10px 0px -10px 20px;
    }
    
    .resultOther {
        width: 130px;
    }

    .resultGrid {
        display: grid;
        grid-template-columns: 20px auto;
    }

    #users-mobile-view {
        text-align: left;
        display: none;
    }

    #users-mobile-view button {
        margin: 10px 0px 0px 20px;
    }

    #users-mobile-view .fas::before {
        padding-right: 5px;
    }

    @media screen and (max-width: 1032px) {
        #new-btn {
            margin-bottom: 10px;
        }

        table {
            display: none;
        }

        #users-mobile-view {
            display: block;
        }
    }
</style>
