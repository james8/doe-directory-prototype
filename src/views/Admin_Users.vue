<template>
    <div id="admin-users" v-if="Auth_IsAuthenticated() || DEBUG" tabindex="-1">
        <br/>
        <h1>Users</h1>
        <table id="users" cellspacing="0" width="100%">
            <caption>User Information</caption>
            <thead>
                <tr>
                    <th scope="col" class="resultIcon"></th>
                    <th scope="col">Name</th>
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
                        <button type="button" class="fas fa-pencil-alt" @click="OpenForm(user, true);">
                            <span class="hidden">Edit {{ GenerateUsersName(user) }}</span>
                        </button>
                    </td>
                    <td>
                        <span class="fakeLink" @click="OpenForm(user, false)">{{ GenerateUsersName(user) }}</span>
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
            <user :user="user" :type="'edit-user'">
                <div class="injectedTitle">
                    <button type="button" class="fas fa-pencil-alt" @click="OpenForm(user, true);">
                        <span class="hidden">Edit {{ GenerateUsersName(user) }}</span>
                    </button>
                    <span :id="`region${ index }`" class="title fakeLink" @click="OpenForm(user, false);">{{ GenerateUsersName(user) }}</span>
                </div>
            </user>
        </div>

        <loader :label="'Loading...'" :display="loading"></loader>

        <div v-if="apiFail">
            Request failed. Please try again later.
            <br/><br/>
        </div>

        <users-edit v-if="editing || viewing" :user="selectedResult" @returnedFormData="ReturnedFormData($event);" :editable="editing"></users-edit>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import Auth from "@/mixins/Auth.ts";

    import FDateTime2 from "@/filters/DateTime2.ts";
    import FPhoneNumber from "@/filters/PhoneNumber.ts";

    import IUser from "@/interfaces/IUser.ts";

    import Loader from "@/components/Loader.vue";
    import User from "@/components/User.vue";
    import UsersEdit from "@/components/UsersEdit.vue";

    @Component({
        components: {
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

        users: Array<any | IUser> = [];
        selectedResult: any | IUser = {};
        loading: boolean = true;
        apiFail: boolean = false;
        editing: boolean = false;
        viewing: boolean = false;

        // DEBUG:
        // formResults: any = {};

        created(): void {
            if (Auth.methods.Auth_IsAuthenticated() || this.DEBUG) {
                this.Load();

                // Load Edit form if cached data is present
                const original: Object = JSON.parse(sessionStorage.getItem('user.original') || '{}');
                if (Object.keys(original).length > 0) this.OpenForm(original, true);
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

                            // set focus on Component
                            const display = getComputedStyle(document.getElementById('users') as HTMLElement).display;
                            setTimeout(() => {
                                if (display === 'table') (document.getElementById('admin-users') as HTMLElement).focus();
                                else (document.querySelector('#users-mobile-view button') as HTMLElement).focus();
                            }, 50);
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

        GenerateUsersName(user: any): string {
            return `${ user.alias || user.firstName } ${ user.lastName }`;
        }

        OpenForm(result: Object, editable: boolean): void {
            this.selectedResult = result;
            editable ? (this.editing = true) : (this.viewing = true);

            // disable navigation & edit buttons
            const navElems: NodeListOf<Element> = document.querySelectorAll('navigation-tabs');
            const elems: NodeListOf<Element> = document.querySelectorAll('#admin-users button');
            // navElems.forEach(navElem => (navElem.setAttribute('inert', '')));
            elems.forEach(elem => (elem.setAttribute('inert', '')));
        }

        ReturnedFormData(event: any): void {
            this.editing = false;
            this.viewing = false;
            this.loading = true;
            this.users = [];
            this.selectedResult = {};

            // enable navigation & edit buttons
            const navElems: NodeListOf<Element> = document.querySelectorAll('navigation-tabs');
            const elems: NodeListOf<Element> = document.querySelectorAll('#admin-users button');
            elems.forEach((elem: Element) => elem.removeAttribute('inert'));

            // this.formResults = event;

            this.Load();
        }
    }
</script>

<style scoped>
    h1 {
        padding-left: 25px;
        text-align: left;
    }
    
    caption {
        height: 1px;
        width: 1px;
        overflow: hidden;
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

    #users-mobile-view {
        text-align: left;
        display: none;
    }

    @media screen and (max-width: 1032px) {
        table {
            display: none;
        }

        #users-mobile-view {
            display: block;
        }
    }
</style>
