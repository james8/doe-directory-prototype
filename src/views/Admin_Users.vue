<template>
    <div id="admin-users">
        <button type="button" id="new-btn" class="btn btnNormal" @click="Add();">
            Add New Employee 
        </button>

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

        <UsersEdit v-if="editing" :result="selectedResult" @returnedFormData="ReturnedFormData($event);"></UsersEdit>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import FPhoneNumber from "@/filters/PhoneNumber.js";
    import Loader from "@/components/Loader.vue";
    import User from "@/components/User.vue";
    import UsersEdit from "@/components/UsersEdit.vue";
    import data from "@/../data/usersResults.js";

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
        }
    })
    export default class Admin_Users extends Vue {
        results: Array<IUser> = [];
        selectedResult: any = {};
        loading: boolean = true;
        editing: boolean = false;

        created(): void {
            this.Load();
        }

        Load(): void {
            this.QueryUsers().then((results: Array<IUser>) => {
                this.loading = false;
                this.results = results;
            });
        }

        QueryUsers(): Promise<Array<IUser>> {
            return new Promise((resolve, reject) => {
                // Fake data - Run real query here
                setTimeout(() => {
                    const results: Array<IUser> = data;
                    resolve(results);
                }, 2500);
            })
        }

        Add(): void {
            this.editing = true;
        }

        Edit(result: IUser, index: number): void {
            this.selectedResult = result;
            this.selectedResult['index'] = index;
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
