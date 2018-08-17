<template>
    <div>
        <form id="search-box-form" @submit.prevent="Search();">
            <div class="searchCategory">
                <label for="search-categories">Search by...</label>
                <select name="" id="search-categories" v-model="category" required>
                    <option></option>
                    <option value="person">Person</option>
                    <option value="office">Office</option>
                    <option value="district">District</option>
                    <option value="section">Section</option>
                    <option value="?">???</option>
                </select>
                <p class="error" v-if="errors.categoryError">Please select a category</p>
            </div>
            <div class="searchParam">
                <input type="text" placeholder="John Doe" v-model="searchParam" required />
                <button type="button" @click="Search()">Search</button>
            </div>
            <p class="error" v-if="errors.searchParamError">Please enter a search parameter</p>
        </form>
        <Loader :label="'Searching...'" :display="searching"></Loader>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import Loader from '../components/Loader.vue';

    interface IError {
        categoryError: boolean;
        searchParamError: boolean;
    }

    interface IResult {
        FirstName: string;
        LastName: string;
        Phone: string;
        Fax?: string;
        Cellular?: string;
    }

    interface IReturnObj {
        category: string;
        searchParam: string;
        queryResults: Object | Array<IResult>;
    }

    @Component({
        components: { Loader }
    })
    export default class SearchBox extends Vue {
        category: string = "";
        searchParam: string = "";
        errors: IError = {
            categoryError: false,
            searchParamError: false
        };
        searching: boolean = false;

        Search(): void {
            // Set focus on submit button
            (document.querySelector('.searchParam button') as HTMLInputElement).focus();
            
            // Error checking
            this.errors.categoryError = (this.category === "");
            this.errors.searchParamError = (this.searchParam === "");

            // Query if form valid
            if (!Object.values(this.errors).includes(true)) {
                this.searching = true;

                this.QueryResults().then((results: Array<Object | IResult>) => {
                    this.searching = false;
                    const returnObj: IReturnObj = {
                        category: this.category,
                        searchParam: this.searchParam,
                        queryResults: results
                    };

                    this.$emit('returnedSearchResults', returnObj);
                });
            }
        }

        QueryResults(): Promise<Array<Object | IResult>> {
            return new Promise((resolve, reject) => {
                // Fake data - Run actual query here
                setTimeout(() => {
                    const results: Array<IResult> = [
                        {
                            FirstName: 'Kevin',
                            LastName: 'da Minion',
                            Phone: '(000) 000-0000'
                        },
                        {
                            FirstName: 'Bob',
                            LastName: 'da Minion',
                            Phone: '(111) 111-1111',
                            Fax: '(222) 222-2222'
                        },
                        {
                            FirstName: 'Dave',
                            LastName: 'da Minion',
                            Phone: '(333) 333-3333',
                            Cellular: '(444) 444-4444'
                        }
                    ];
                    resolve(results);
                }, 5000);
            });
        }
    }
</script>

<style scoped>
    #search-box-form {
        margin: 20px;
        max-width: 450px;
    }

    .searchCategory {
        padding-bottom: 10px;
        display: grid;
        grid-template-rows: repeat(2, auto);
    }

    .searchCategory label {
        padding-bottom: 5px;
        text-align: left;
    }

    .searchParam {
        display: grid;
        grid-template-columns: auto 75px;
    }

    .searchParam button {
        margin-left: 10px;
    }

    .error {
        color: #bf0f0f;
        font-size: 14px;
        font-style: italic;
        font-weight: bold;
        margin: 5px;
        display: flex;
    }
</style>