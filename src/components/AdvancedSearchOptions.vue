<template>
    <div id="advanced-search-options">
        <fieldset class="advancedSearch">
            <legend>Advanced Search</legend>
            <div class="modalTip">Apply one or more filter(s) to help narrow down your search</div>
            <br/>
            <div v-if="initializingAdvanced" class="advancedLoader"><span class="fas fa-cog fa-2x fa-spin"></span></div>
            <div v-else>
                <div class="searchOption">
                    <label for="search-category">Filter by</label>
                    <radio-field :id="'search-category'" :noFieldset="true" :buttons="radioBtns" @inputChange="ReturnedRadioFieldChange($event);"></radio-field>
                </div>
                <!-- School -->
                <div v-if="selectedRadioBtn === 0">
                    <div class="searchOption">
                        <label for="district">District</label>
                        <select-box-field :id="'district'" :options="districts.filter((d) => (d.Type === 'school'))" :selectorLabel="'Label'" :selectorValue="'Label'" @selectChange="ReturnedSelectFieldChange($event);"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="complex-area">Complex Area</label>
                        <select-box-field :id="'complex-area'" :options="complexAreas.filter((ca) => (ca.Type === 'school'))" :selectorLabel="'Label'" :selectorValue="'Label'" @selectChange="ReturnedSelectFieldChange($event);"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="complex">Complex</label>
                        <select-box-field :id="'complex'" :options="complexes.filter((c) => (c.Type === 'school'))" :selectorLabel="'Label'" :selectorValue="'Label'" @selectChange="ReturnedSelectFieldChange($event);"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="school">School</label>
                        <select-box-field :id="'school'" :options="schools.filter((s) => (s.Type === 'school'))" :selectorLabel="'Label'" :selectorValue="'Label'" @selectChange="ReturnedSelectFieldChange($event);"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="position">Position</label>
                        <select-box-field :id="'position'" :options="positions.filter((p) => (p.Type === 'school'))" :selectorLabel="'Label'" :selectorValue="'Label'" @selectChange="ReturnedSelectFieldChange($event);"></select-box-field>
                    </div>
                </div>
                <!-- State Office -->
                <div v-else-if="selectedRadioBtn === 1">
                    <div class="searchOption">
                        <label for="district">Office</label>
                        <select-box-field :id="'district'" :options="districts.filter((district) => (district.Type === 'office'))" :selectorLabel="'Label'" :selectorValue="'Label'" @selectChange="ReturnedSelectFieldChange($event);"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="complex-area">Branch</label>
                        <select-box-field :id="'complex-area'" :options="complexAreas.filter((ca) => (ca.Type === 'office'))" :selectorLabel="'Label'" :selectorValue="'Label'" @selectChange="ReturnedSelectFieldChange($event);"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="complex">Section</label>
                        <select-box-field :id="'complex'" :options="complexes.filter((c) => (c.Type === 'office'))" :selectorLabel="'Label'" :selectorValue="'Label'" @selectChange="ReturnedSelectFieldChange($event);"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="school">Sub-Section</label>
                        <select-box-field :id="'school'" :options="schools.filter((s) => (s.Type === 'office'))" :selectorLabel="'Label'" :selectorValue="'Label'" @selectChange="ReturnedSelectFieldChange($event);"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="position">Position</label>
                        <select-box-field :id="'position'" :options="positions.filter((p) => (p.Type === 'office'))" :selectorLabel="'Label'" :selectorValue="'Label'" @selectChange="ReturnedSelectFieldChange($event);"></select-box-field>
                    </div>
                </div>
            </div>
            <div class="buttonSection">
               <button type="button" class="btn btnNormal" @click="ClearFilters();">Clear Filters</button>
            </div>
        </fieldset>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import RadioField from "@/components/RadioField.vue";
    import SelectBoxField from "@/components/SelectBoxField.vue";

    // Mock Data
    import districts from "@/../data/districts.ts"
    import complexAreas from "@/../data/complexAreas.ts";
    import complexes from "@/../data/complexes.ts";
    import schools from "@/../data/schools.ts";
    import positions from "@/../data/positions.ts";

    class AdvancedSearchOption {
        private _district: string;
        private _complexArea: string;
        private _complex: string;
        private _school: string;
        private _position: string;

        constructor () {
            this._district = '';
            this._complexArea = '';
            this._complex = '';
            this._school = '';
            this._position = '';
        }

        get District(): string { return this._district; };
        set District(value: string) { this._district = value; };
        get ComplexArea(): string { return this._complexArea; };
        set ComplexArea(value: string) { this._complexArea = value; };
        get Complex(): string { return this._complex; };
        set Complex(value: string) { this._complex = value; };
        get School(): string { return this._school; };
        set School(value: string) { this._school = value; };
        get Position(): string { return this._position; };
        set Position(value: string) { this._position = value; };
    }

    @Component({
        components: {
            RadioField,
            SelectBoxField
        }
    })
    export default class AdvancedSearchOptions extends Vue {
        initializingAdvanced: boolean = true;
        advancedSearchOptions: AdvancedSearchOption = new AdvancedSearchOption();
        advancedSearchString: string = "";
        radioBtns: Array<Object> = [];
        selectedRadioBtn: Number = -1;
        districts: Array<Object> = [];
        complexAreas: Array<Object> = [];
        complexes: Array<Object> = [];
        schools: Array<Object> = [];
        positions: Array<Object> = [];
        
        created(): void {
            this.radioBtns.push({
                key: 'school',
                value: 'School'
            });
            this.radioBtns.push({
                key: 'office',
                value: 'State Office'
            });

            this.InitializeAdvancedSearch();
        }
        
        InitializeAdvancedSearch(): void {
            Promise.all([this.QueryDistricts(), this.QueryComplexAreas(), this.QueryComplexes(), this.QuerySchools(), this.QueryPositions()])
                .then((results: Array<any>) => {
                    this.districts = results[0];
                    this.complexAreas = results[1];
                    this.complexes = results[2];
                    this.schools = results[3];
                    this.positions = results[4];
                    this.initializingAdvanced = false;
                });
        }
        
        QueryDistricts(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                // Fake Data
                setTimeout(() => { resolve(districts) }, 1000);
            });
        }

        QueryComplexAreas(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                // Fake Data
                setTimeout(() => { resolve(complexAreas) }, 1500);
            });
        }

        QueryComplexes(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                // Fake Data
                setTimeout(() => { resolve(complexes) }, 2000);
            });
        }

        QuerySchools(): Promise<Array<Object>> {
            return new Promise((resolve, rejcet) => {
                // Fake Data
                setTimeout(() => { resolve(schools) }, 500);
            });
        }

        QueryPositions(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                // Fake Data
                setTimeout(() => { resolve(positions) }, 1000);
            });
        }
        
        ReturnedRadioFieldChange(event: any): void {
            this.selectedRadioBtn = this.radioBtns.findIndex((btn: any) => (btn.key === event));
            this.advancedSearchOptions = new AdvancedSearchOption();

            setTimeout(() => { this.CreateOptionsObj(); }, 50);
        }

        ReturnedSelectFieldChange(event: any): void {
            if (event.id === 'district') this.advancedSearchOptions.District = event.value;
            else if (event.id === 'complex-area') this.advancedSearchOptions.ComplexArea = event.value;
            else if (event.id === 'complex') this.advancedSearchOptions.Complex = event.value;
            else if (event.id === 'school') this.advancedSearchOptions.School = event.value;
            else if (event.id === 'position') this.advancedSearchOptions.Position = event.value;

            setTimeout(() => { this.CreateOptionsObj(); }, 50);
        }

        CreateOptionsObj(): any {
            const aso = this.advancedSearchOptions;
            this.advancedSearchString = `${ aso.District } ${ aso.ComplexArea } ${ aso.Complex } ${ aso.School } ${ aso.Position }`;
            this.$emit('advancedSearchString', ((this.advancedSearchString.trim() === '') ? '' : this.advancedSearchString));
        }

        ClearFilters(): void {
            this.selectedRadioBtn = -1;
            const radioBtns: any = document.querySelectorAll('#search-category input');
            radioBtns.forEach((btn: HTMLInputElement) => (btn.checked = false));
            this.advancedSearchOptions = new AdvancedSearchOption();

            this.$emit('advancedSearchString', '');
        }
    }
</script>

<style scoped>
    .advancedSearch {
        border-radius: 5px;
        margin: 24px;
    }

    .advancedSearch legend {
        font-weight: bold;
        padding: 5px 12px;
        text-align: left;
    }

    .advancedSearch .searchOption {
        border-bottom: 1px solid #000;
        display: grid;
        grid-template-columns: 140px auto;
    }

    .advancedSearch .searchOption:last-of-type {
        border-bottom: none;
    }

    .advancedSearch label {
        background-color: rgba(243, 243, 243, 0.5);
        padding: 5px 15px;
        text-align: left;
    }

    .advancedLoader {
        margin-left: 10px;
        text-align: left;
    }

    .buttonSection {
        display: flex;
        justify-content: flex-end;
    }

    .buttonSection button {
        padding: 10px 20px;
    }
</style>
