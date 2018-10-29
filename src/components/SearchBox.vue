<template>
    <div>
        <form id="search-box-form" @submit.prevent="Search();">
            <div class="searchParam">
                <input-field :id="'search'" :label="'Search'" :placeHolder="'I want to search for...'" @inputChange="SaveValue($event)"></input-field>
                <button type="button" class="btn btnNormal" @click="Search()">Search</button>
            </div>
            <p class="error" v-if="errors.searchParamError">Please enter a search parameter with 4 or more characters.</p>
            <div class="modalTip">
                <p>Enter a full / partial combination of a Name, Phone #, Position, Office, or any other searchable field. (e.g. entering 'John Doe' or 'do Joh' will return users which contain 'John Doe')</p>
                <p>Having trouble? Navigate to the <a href="/help" target="blank">help page</a> for a list of all fields that are being searched on and examples.</p>
            </div>
        </form>
        <Loader :label="'Searching...'" :display="searching"></Loader>
        <div v-if="apiFail">
            Request failed. Please try again later.
            <br/><br/>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import Loader from "@/components/Loader.vue";
    import InputField from "@/components/InputField.vue";

    interface IError {
        searchParamError: boolean;
    }

    interface IReturnObj {
        searchParam: string;
        queryResults: Object;
    }

    @Component({
        components: {
            Loader,
            InputField
        }
    })
    export default class SearchBox extends Vue {
        @Prop() advancedOptions: any;

        DEBUG: boolean = false;

        searchParam: string = "";
        errors: IError = {
            searchParamError: false
        };
        searching: boolean = false;
        apiFail: boolean = false;

        Search(): void {
            // Set focus on submit button
            (document.querySelector('.searchParam button') as HTMLInputElement).focus();
            
            // Error checking
            this.errors.searchParamError = ((this.searchParam.length <= 3) && (this.advancedOptions === ''));

            // Query if form valid
            if (!Object.values(this.errors).includes(true)) {
                this.searching = true;
                this.apiFail = false;

                const searchParams: string = `${ this.searchParam } ${ this.advancedOptions }`.toLowerCase();
                Promise.all([this.QuerySchools(searchParams), this.QueryPeople(searchParams)])
                    .then((results: Array<any>) => {
                        this.searching = false;

                        let queryResults: Array<Object> = [];
                        results[0].forEach((result: Object) => queryResults.push(result));
                        results[1].forEach((result: Object) => queryResults.push(result));

                        const returnObj: IReturnObj = {
                            searchParam: this.searchParam,
                            queryResults: queryResults
                        };
                        this.$emit('returnedSearchResults', returnObj);
                    })
                    .catch((error: string) => {
                        console.log(`ERROR: ${ error }`);

                        this.searching = false;
                        this.apiFail = true;
                    });
            }
        }

        QuerySchools(searchParams: string): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                if (this.DEBUG) {
                    console.log('DEBUG: Using mock data (sses)');
                    let sses = require('@/../data/sses.ts').default;
                    
                    setTimeout(() => {
                        searchParams.split(/[\s,]+/).forEach(param => {
                            sses = sses.filter((school: any) => 
                                school.SchoolName.toLowerCase().includes(param)
                                || school.PrincipalFirstName.toLowerCase().includes(param)
                                || school.PrincipalLastName.toLowerCase().includes(param)
                                || school.Address.toLowerCase().includes(param)
                                || school.Phone.toLowerCase().includes(param)
                                || school.Fax.toLowerCase().includes(param)
                                || school.Site.toLowerCase().includes(param)
                            );
                        });
                        resolve(sses);
                    }, 1000);
                }
                else {
                    resolve([]);
                }
            });
        }

        QueryPeople(searchParams: string): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                if (this.DEBUG) {
                    console.log('DEBUG: Using mock data (users)');
                    let users = require('@/../data/users.ts').default;

                    setTimeout(() => {
                        searchParams.split(/[\s,]+/).forEach(param => {
                            users = users.filter((user: any) => 
                                user.District.toLowerCase().includes(param)
                                || user.ComplexArea.toLowerCase().includes(param)
                                || user.Complex.toLowerCase().includes(param)
                                || user.School.toLowerCase().includes(param)
                                || user.Posn.toLowerCase().includes(param)
                                || user.Name.toLowerCase().includes(param)
                                || user.Alias.toLowerCase().includes(param)
                            );
                        });
                        resolve(users);
                    }, 3000);
                }
                else {
                    let formData: FormData = new FormData();
                    formData.append('SearchParam', searchParams);

                    fetch('https://localhost:44352/api/users', {
                        method: 'POST',
                        body: formData 
                    })
                        .then(response => resolve(response.json()))
                        .catch(error => reject(error)); 
                }
            });
        }

        SaveValue(event: any): void {
            this.searchParam = event;
        }
    }
</script>

<style scoped>
    #search-box-form {
        margin: 20px;
    }

    .searchParam {
        display: grid;
        grid-template-columns: 75% 25%;
    }

    .searchParam button {
        height: 39px;
        margin-left: 10px;
        align-self: end;
    }

    .error {
        color: #bf0f0f;
        font-size: 14px;
        font-style: italic;
        font-weight: bold;
        margin: 5px;
        display: flex;
    }

    .searchTip {
        background-color: rgba(197, 245, 193, 0.5);
        border-radius: 5px;
        font-size: 14px;
        font-style: italic;
        margin-top: 10px;
        padding: 10px;
        text-align: left;
    }

    @media screen and (max-width: 450px) {
        .searchParam {
            grid-template-columns: 100%;
        }
    }
</style>