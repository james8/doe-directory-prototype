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
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import Loader from "@/components/Loader.vue";
    import InputField from "@/components/InputField.vue";

    // mock data
    import sses from "@/../data/sses.ts";
    import data from "@/../data/users.ts";

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

        searchParam: string = "";
        errors: IError = {
            searchParamError: false
        };
        searching: boolean = false;

        Search(): void {
            // Set focus on submit button
            (document.querySelector('.searchParam button') as HTMLInputElement).focus();
            
            // Error checking
            this.errors.searchParamError = ((this.searchParam.length <= 3) && (this.advancedOptions === ''));

            // Query if form valid
            if (!Object.values(this.errors).includes(true)) {
                this.searching = true;

                const searchParams: Array<string> = `${ this.searchParam } ${ this.advancedOptions }`.toLowerCase().split(/[\s,]+/);
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
                    });
            }
        }

        QuerySchools(searchParams: Array<string>): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    let results: Array<any> = sses;

                    // Filter data based on search string (done for demo purposes only, should be done in SQL call)
                    searchParams.forEach(param => {
                        results = results.filter(result => 
                            result.SchoolName.toLowerCase().includes(param)
                            || result.PrincipalFirstName.toLowerCase().includes(param)
                            || result.PrincipalLastName.toLowerCase().includes(param)
                            || result.Address.toLowerCase().includes(param)
                            || result.Phone.toLowerCase().includes(param)
                            || result.Fax.toLowerCase().includes(param)
                            || result.Site.toLowerCase().includes(param)
                        );
                    });
                    resolve(results);
                }, 1000);
            })
        }

        QueryPeople(searchParams: Array<string>): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                // Timeout to pretend loading
                setTimeout(() => {
                    let results: Array<any> = data;

                    // Filter data based on search string (done for demo purposes only, should be done in SQL call)
                    searchParams.forEach(param => {
                        results = results.filter(result => 
                            result.District.toLowerCase().includes(param)
                            || result.ComplexArea.toLowerCase().includes(param)
                            || result.Complex.toLowerCase().includes(param)
                            || result.Section.toLowerCase().includes(param)
                            || result.Posn.toLowerCase().includes(param)
                            || result.Name.toLowerCase().includes(param)
                        );
                    });
                    resolve(results);
                }, 3000);
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