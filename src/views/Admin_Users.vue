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
                    <th scope="col" class="resultPhone">Fax</th>
                    <th scope="col" class="resultPhone">Cellular</th>
                </tr>
            </thead>
            <tbody>
                <tr class="record" v-for="(user, index) in users" :key="index">
                    <td class="resultIcon">
                        <button type="button" class="fas fa-pencil-alt" @click="Edit(user, index);">
                            <span class="hidden">Edit {{ user.FirstName }} {{ user.LastName }}</span>
                        </button>
                    </td>
                    <td>{{ user.FirstName }} {{ user.LastName }}</td>
                    <td>
                        {{ user.Section }}
                        <br><br>
                        {{ user.Position }}
                    </td>
                    <td>{{ user.Phone | FPhoneNumber }}</td>
                    <td>{{ user.Ext }}</td>
                    <td>{{ user.Fax | FPhoneNumber }}</td>
                    <td>{{ user.Cellular | FPhoneNumber }}</td>
                    <!-- <td class="resultGrid">
                        <span v-if="result.Fax !== ''">F:</span>
                        <span v-if="result.Fax !== ''">{{ result.Fax | FPhoneNumber }}</span>
                        <span v-if="result.Cellular !== ''">C:</span>
                        <span v-if="result.Cellular !== ''">{{ result.Cellular | FPhoneNumber }}</span>
                    </td>
                    <td>{{ result.StartDate }}</td>
                    <td>{{ result.EndDate }}</td> -->
                </tr>
            </tbody>
        </table>

        <div id="users-mobile-view" v-for="(user, index) in users" :key="index">
            <button type="button" class="fas fa-pencil-alt btn btnNormal" @click="Edit(user, index);">
                Edit
                <span class="hidden">{{ user.FirstName }} {{ user.LastName }}</span>
            </button>
            <User :user="user" :type="'user'"></User>
        </div>

        <Loader :label="'Loading...'" :display="loading"></Loader>

        <UsersEdit v-if="editing" :result="selectedResult" :sections="sections" @returnedFormData="ReturnedFormData($event);"></UsersEdit>
        <button type="button" class="btn btnNormal" @click="GetUserProfile();">GET User Profile</button>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import Auth from "@/mixins/Auth.ts";
    import FPhoneNumber from "@/filters/PhoneNumber.ts";
    import Loader from "@/components/Loader.vue";
    import User from "@/components/User.vue";
    import UsersEdit from "@/components/UsersEdit.vue";
    import data from "@/../data/usersResults.ts";
    import sections from "@/../data/sections.ts";

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
        users: Array<any> = [];
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
                    this.users = results[0];
                    this.sections = results[1];
            });
        }
        
        GetUserProfile(): void {
            Auth.methods.Auth_AcquireMSGraphToken()
                .then((token: string) => {
                    // console.log(token);

                    Auth.methods.Auth_GetUserProfileExtended(token)
                        .then((profile: any) => console.log(profile))
                        .catch((error: any) => console.log(error))
                })
                .catch((error: Error) => console.log(error));
        }

        QueryUsers(): Promise<Array<IUser>> {
            return new Promise((resolve, reject) => {
                // Fake data - Run real query here
                setTimeout(() => {
                    // const results: Array<any> = data;

                    // format data
                    let users: Array<any> = [];
                    data.forEach(d => {
                        let name: Array<any> = [];
                        if (d.Name !== undefined) name = d.Name.split(',');
                        let firstName: string = name[1];
                        let lastName: string = name[0]; 
                        if (firstName !== undefined) firstName = firstName.trim();
                        if (lastName !== undefined) lastName = lastName.trim();

                        users.push({
                            Id: d.EmplId,
                            FirstName: firstName || 'Vacant',
                            LastName: lastName,
                            District: d.District,
                            ComplexArea: d.ComplexArea,
                            Complex: d.Complex,
                            Section: d.Section,
                            SectionId: d.SectionId,
                            Position: d.Posn
                        });
                    })

                    resolve(users);
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
            this.users = [];
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
