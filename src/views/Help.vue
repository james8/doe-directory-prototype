<template>
    <div id="help">
        <div class="title">Help</div>
        <div id="help-searching">
            <div class="subTitle">How to Search:</div>

            <p>To search for a user(s), do one of the following:</p>
            <div class="indent">
                <ol>
                    <li>Enter keywords in the search box to filter users.</li>
                    <li>Select values from the 'Advanced Search' section and (optionally) enter keywords into the search box.</li>
                </ol>
            </div>
        </div>

        <div id="help-fields">
            <div class="subTitle">Searched Fields:</div>

            <p>Each keyword(s) entered in the search box will be checked if they are included in any of the fields listed below.  If a match is found, that user will be a returned result.</p>
            <div class="modalTip">
                <p>NOTE:</p>
                <p>Fields with an asterisk (*) can be found in the 'Advanced Search' section for easier filtering.  Just select a value and it will be automatically applied to the filter keywords entered in the search box.</p>
            </div>
            <div class="modalTip">
                <p>NOTE:</p>
                <p>Phone & Fax numbers need to be entered as a single string of numbers (i.e. 8081234567) to match a result.  Entering '(808) 123-4567' will not return any matches.</p>
            </div>

            <table id="help-fields-table" cellspacing="0" width="100%">
                <caption>Fields that will be searched</caption>
                <thead>
                    <tr>
                        <th scope="col">Field</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(field, index) in fields" :key="index">
                        <td>{{ field }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="help-examples">
            <div class="subTitle">Search Examples</div>

            <table id="help-examples-table" cellspacing="0" width="100%">
                <caption>Examples</caption>
                <thead>
                    <tr>
                        <th scope="col">Search</th>
                        <th scope="col">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(example, index) in examples" :key="index">
                        <td>{{ example.Search }}</td>
                        <td>{{ example.Result }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Spacing for bottom, so examples are not flush to the bottom -->
        <div class="addSpacing"></div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";

    class Example {
        private _search: string;
        private _result: string;

        constructor(search: string, result: string) {
            this._search = search;
            this._result = result;
        }

        get Search(): string { return this._search; };
        get Result(): string { return this._result; };
    }

    @Component
    export default class Help extends Vue {
        fields: Array<Object> = [];
        examples: Array<Object> = [];

        created(): void {
            // Add Searchable Fields
            this.fields.push('First Name');
            this.fields.push('Last Name');
            this.fields.push('Address');
            this.fields.push('Phone #');
            this.fields.push('Fax #');
            this.fields.push('Website');
            this.fields.push('* District');
            this.fields.push('* Complex Area');
            this.fields.push('* Complex');
            this.fields.push('* School');
            this.fields.push('* Office');
            this.fields.push('* Branch');
            this.fields.push('* Section');
            this.fields.push('* Sub-Section');
            this.fields.push('* Position');

            // Add Examples
            this.examples.push(new Example("john doe", "All users with the name 'John Doe'"));
            this.examples.push(new Example("john doe princip", "All users with the name 'John Doe' who are a 'Principal' or 'Vice-Principal'"));
            this.examples.push(new Example("8081234567", "All users with a phone/fax number '(808) 123-4567'.  (values must be entered as a single string of numbers to match)"));
            this.examples.push(new Example("roosevelt", "All users with 'Roosevelt' in one of the searchable fields"));
        }
    }
</script>

<style scoped>
    #help {
        margin: 0px auto;
        max-width: 800px;
    }

    #help-searching p, #help-fields p, #help-examples p {
        padding: 0px 15px;
        text-align: left;
    }

    #help .modalTip p:first-of-type {
        font-weight: bold;
        text-decoration: underline;
    }

    ol {
        text-align: left;
    }

    ol li {
        margin-bottom: 16px;
    }

    ol p {
        padding: 0px !important;
    }

    .addSpacing {
        padding: 50px;
    }
</style>
