<template>
    <div id="admin-users" v-if="Auth_IsAuthenticated() || DEBUG">
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
                    <th scope="col">Last Modified</th>
                </tr>
            </thead>
            <tbody>
                <tr class="record" v-for="(user, index) in users" :key="index">
                    <td class="resultIcon">
                        <button type="button" class="fas fa-pencil-alt" @click="Edit(user);">
                            <span class="hidden">Edit {{ user.alias || user.firstName }} {{ user.lastName }}</span>
                        </button>
                    </td>
                    <td>{{ user.alias || user.firstName }} {{ user.lastName }}</td>
                    <td>
                        {{ user.school }}
                        <br><br>
                        {{ user.position }}
                    </td>
                    <td>{{ user.phone | FPhoneNumber }}</td>
                    <td>{{ user.extension }}</td>
                    <td>{{ user.fax | FPhoneNumber }}</td>
                    <td>{{ user.cellular | FPhoneNumber }}</td>
                    <td>{{ user.lastModifiedBy }}<br/>{{ user.lastModified | FDateTime2 }}</td>
                </tr>
            </tbody>
        </table>

        <div id="users-mobile-view" v-for="(user, index) in users" :key="index">
            <button type="button" class="fas fa-pencil-alt btn btnNormal" @click="Edit(user);">
                Edit
                <span class="hidden">{{ user.firstName }} {{ user.lastName }}</span>
            </button>
            <User :user="user" :type="'edit-user'"></User>
        </div>

        <loader :label="'Loading...'" :display="loading"></loader>
        <div v-if="apiFail">
            Request failed. Please try again later.
            <br/><br/>
        </div>

        <toast v-if="showToast" :type="'success'" @closeToast="showToast = $event;"></toast>
        <button type="button" @click="showToast = true;">Show Toast</button>

        <users-edit v-if="editing" :user="selectedResult" @returnedFormData="ReturnedFormData($event);"></users-edit>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import Auth from "@/mixins/Auth.ts";

    import FDateTime2 from "@/filters/DateTime2.ts";
    import FPhoneNumber from "@/filters/PhoneNumber.ts";

    import IUser from "@/interfaces/IUser.ts";

    import Toast from "@/components/Toast.vue";
    import Loader from "@/components/Loader.vue";
    import User from "@/components/User.vue";
    import UsersEdit from "@/components/UsersEdit.vue";

    @Component({
        components: {
            Toast,
            Loader,
            User,
            UsersEdit
        },
        filters: {
            'FDateTime2': FDateTime2,
            'FPhoneNumber': FPhoneNumber
        },
        mixins: [
            Auth
        ]
    })
    export default class Admin_Users extends Vue {
        DEBUG: boolean = false;

        users: Array<any> = [];
        selectedResult: any = {};
        loading: boolean = true;
        apiFail: boolean = false;
        editing: boolean = false;
        showToast: boolean = false;

        // DEBUG:
        formResults: any = {};

        created(): void {
            if (Auth.methods.Auth_IsAuthenticated() || this.DEBUG) {
                this.Load();

                // Load Edit form if cached data is present
                const original: Object = JSON.parse(sessionStorage.getItem('user.original') || '{}');
                if (Object.keys(original).length > 0) this.Edit(original);
            }
            else Auth.methods.Auth_Login();
        }

        Load(): void {
            this.GetUserProfile()
                .then((userProfile: Object) => {
                    Promise.all([this.QueryPeople(userProfile)])
                        .then((results: Array<any>) => {
                            this.loading = false;
                            this.users = results[0];
                        })
                        .catch((error: Error) => this.APIFail(error))
                })
                .catch((error: Error) => this.APIFail(error))
        }
        
        GetUserProfile(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                Auth.methods.Auth_AcquireMSGraphToken()
                    .then((token: string) => {
                        Auth.methods.Auth_GetUserProfileExtended(token)
                            .then((profile: any) => resolve(profile))
                            .catch((error: Error) => reject(error))
                    })
                    .catch((error: Error) => reject(error));
            });
        }

        QueryPeople(userProfile: any): Promise<Array<IUser>> {
            // console.log(userProfile);

            return new Promise((resolve, reject) => {
                if (this.DEBUG) {
                    console.log('DEBUG: Using mock data (users)');
                    let users: Array<any> = require('@/../data/users.ts').default;

                    setTimeout(() => {
                        users = users.filter((user: any) => user.schoolId.includes('021Q'));
                        users.forEach((user: any) => {
                            const names: Array<string> = user.name.split(',');
                            const firstName: string = names[1].trim();
                            const lastName: string = names[0].trim();
                            user["firstName"] = firstName;
                            user["lastName"] = lastName;
                        })
                        resolve(users);
                    }, 2500);
                }
                else {
                    let formData: FormData = new FormData();
                    formData.append('SearchParam', userProfile.officeLocation);

                    fetch('https://localhost:44352/api/users', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => resolve(response.json()))
                        .catch(error => reject(error));
                }
            });
        }

        APIFail(error: Error): void {
            console.log(`ERROR: ${ error }`);

            this.loading = false;
            this.apiFail = true;
        }

        Edit(result: Object): void {
            this.selectedResult = result;
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
