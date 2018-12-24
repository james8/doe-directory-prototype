<template>
    <div id="advanced-search-options">
        <fieldset class="advancedSearch">
            <legend>Advanced Search</legend>
            <div class="modalTip">Apply one or more filter(s) to help narrow down your search</div>
            <br/>
            <loader :label="'Advanced Search Initializing...'" :display="initializingAdvanced"></loader>
            <!-- <div v-if="initializingAdvanced" class="advancedLoader"><span class="fas fa-cog fa-2x fa-spin"></span></div> -->
            <div v-if="!initializingAdvanced">
                <div class="searchOption">
                    <label id="search-category-label" for="search-category">{{ searchCategoryLabel }}</label>
                    <radio-field :id="'search-category'" :ariaLabelledById="'search-category-label'" :noFieldset="true" :legend="searchCategoryLabel" :buttons="radioBtns" @inputChange="ReturnedRadioFieldChange($event);"></radio-field>
                </div>
                <!-- School -->
                <div v-if="selectedRadioBtn === 0">
                    <div class="searchOption">
                        <label for="district">District</label>
                        <select-box-field :id="'district'" :options="districts.filter((d) => (d.type === 'school'))" :selectorLabel="'label'" :selectorValue="'value'" @selectChange="ReturnedSelectFieldChange($event);" :value="this.advancedSearchOptions.District"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="complex-area">Complex Area</label>
                        <select-box-field :id="'complex-area'" :options="complexAreas.filter((ca) => (ca.type === 'school' && (ca.district === this.advancedSearchOptions.District || this.advancedSearchOptions.District === '')))" :selectorLabel="'label'" :selectorValue="'value'" @selectChange="ReturnedSelectFieldChange($event);" :value="this.advancedSearchOptions.ComplexArea"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="complex">Complex</label>
                        <select-box-field :id="'complex'" :options="complexes.filter((c) => (c.type === 'school') && (c.district === this.advancedSearchOptions.District || this.advancedSearchOptions.District === '') && (c.complexArea === this.advancedSearchOptions.ComplexArea || this.advancedSearchOptions.ComplexArea === ''))" :selectorLabel="'label'" :selectorValue="'value'" @selectChange="ReturnedSelectFieldChange($event);" :value="this.advancedSearchOptions.Complex"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="school">School</label>
                        <select-box-field :id="'school'" :options="schools.filter((s) => (s.type === 'school') && (s.district === this.advancedSearchOptions.District || this.advancedSearchOptions.District === '') && (s.complexArea === this.advancedSearchOptions.ComplexArea || this.advancedSearchOptions.ComplexArea === '') && (s.complex === this.advancedSearchOptions.Complex || this.advancedSearchOptions.Complex === ''))" :selectorLabel="'label'" :selectorValue="'value'" @selectChange="ReturnedSelectFieldChange($event);" :value="this.advancedSearchOptions.School"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="position">Position</label>
                        <select-box-field :id="'position'" :options="fpositions" :selectorLabel="'label'" :selectorValue="'value'" @selectChange="ReturnedSelectFieldChange($event);" :value="this.advancedSearchOptions.Position"></select-box-field>
                    </div>
                </div>
                <!-- State Office -->
                <div v-else-if="selectedRadioBtn === 1">
                    <div class="searchOption">
                        <label for="district">Office</label>
                        <select-box-field :id="'district'" :options="districts.filter((district) => (district.type === 'office'))" :selectorLabel="'label'" :selectorValue="'value'" @selectChange="ReturnedSelectFieldChange($event);" :value="this.advancedSearchOptions.District"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="complex-area">Branch</label>
                        <select-box-field :id="'complex-area'" :options="complexAreas.filter((ca) => (ca.type === 'office' && (ca.district === this.advancedSearchOptions.District || this.advancedSearchOptions.District === '')))" :selectorLabel="'label'" :selectorValue="'value'" @selectChange="ReturnedSelectFieldChange($event);" :value="this.advancedSearchOptions.ComplexArea"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="complex">Section</label>
                        <select-box-field :id="'complex'" :options="complexes.filter((c) => (c.type === 'office') && (c.district === this.advancedSearchOptions.District || this.advancedSearchOptions.District === '') && (c.complexArea === this.advancedSearchOptions.ComplexArea || this.advancedSearchOptions.ComplexArea === ''))" :selectorLabel="'label'" :selectorValue="'value'" @selectChange="ReturnedSelectFieldChange($event);" :value="this.advancedSearchOptions.Complex"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="school">Sub-Section</label>
                        <select-box-field :id="'school'" :options="schools.filter((s) => (s.type === 'office') && (s.district === this.advancedSearchOptions.District || this.advancedSearchOptions.District === '') && (s.complexArea === this.advancedSearchOptions.ComplexArea || this.advancedSearchOptions.ComplexArea === '') && (s.complex === this.advancedSearchOptions.Complex || this.advancedSearchOptions.Complex === ''))" :selectorLabel="'label'" :selectorValue="'value'" @selectChange="ReturnedSelectFieldChange($event);" :value="this.advancedSearchOptions.School"></select-box-field>
                    </div>
                    <div class="searchOption">
                        <label for="position">Position</label>
                        <select-box-field :id="'position'" :options="fpositions" :selectorLabel="'label'" :selectorValue="'value'" @selectChange="ReturnedSelectFieldChange($event);" :value="this.advancedSearchOptions.Position"></select-box-field>
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
    import Loader from "@/components/Loader.vue";
    import RadioField from "@/components/RadioField.vue";
    import SelectBoxField from "@/components/SelectBoxField.vue";
import SearchBox from '@/components/SearchBox.vue';

    // Mock Data
    //import districts from "@/../data/districts.ts"
    //import complexAreas from "@/../data/complexAreas.ts";
    //import complexes from "@/../data/complexes.ts";
    //import schools from "@/../data/schools.ts";
    //import positions from "@/../data/positions.ts";

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
            Loader,
            RadioField,
            SelectBoxField
        }
    })
    export default class AdvancedSearchOptions extends Vue {
        initializingAdvanced: boolean = true;
        advancedSearchOptions: AdvancedSearchOption = new AdvancedSearchOption();
        advancedSearchString: string = "";
        searchCategoryLabel: string = "Filter by";
        radioBtns: Array<Object> = [];
        selectedRadioBtn: Number = -1;
        districts: Array<Object> = [];
        complexAreas: Array<Object> = [];
        complexes: Array<Object> = [];
        schools: Array<Object> = [];
        positions: Array<Object> = [];
        fpositions: Array<Object> = [];
        
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
                    setTimeout(() => { (document.getElementById('advanced-search-options') as HTMLElement).focus(); }, 50);
                });
        }
        
        QueryDistricts(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                // Fake Data
                //setTimeout(() => { resolve(districts) }, 1000);
                //const searchParams: string = 'x';
                let formData: FormData = new FormData();
                    //formData.append('SearchParam', searchParams);

                    fetch('https://localhost:44352/api/districts', {
                        method: 'POST',
                        body: formData 
                    })
                        .then(response => resolve(response.json()))
                        .catch(error => reject(error)); 
            });
        }

        QueryComplexAreas(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                // Fake Data
                //setTimeout(() => { resolve(complexAreas) }, 1500);
                let formData: FormData = new FormData();
                    //formData.append('SearchParam', searchParams);

                    fetch('https://localhost:44352/api/complexareas', {
                        method: 'POST',
                        body: formData 
                    })
                        .then(response => resolve(response.json()))
                        .catch(error => reject(error));
            });
        }

        QueryComplexes(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                // Fake Data
                //setTimeout(() => { resolve(complexes) }, 2000);
                let formData: FormData = new FormData();
                    //formData.append('SearchParam', searchParams);

                    fetch('https://localhost:44352/api/complexes', {
                        method: 'POST',
                        body: formData 
                    })
                        .then(response => resolve(response.json()))
                        .catch(error => reject(error));
            });
        }

        QuerySchools(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                // Fake Data
                //setTimeout(() => { resolve(schools) }, 500);
                let formData: FormData = new FormData();
                    //formData.append('SearchParam', searchParams);

                    fetch('https://localhost:44352/api/schools', {
                        method: 'POST',
                        body: formData 
                    })
                        .then(response => resolve(response.json()))
                        .catch(error => reject(error));
            });
        }

        QueryPositions(): Promise<Array<Object>> {
            return new Promise((resolve, reject) => {
                // Fake Data
                //setTimeout(() => { resolve(positions) }, 1000);
                let formData: FormData = new FormData();
                    //formData.append('SearchParam', searchParams);

                    fetch('https://localhost:44352/api/positions', {
                        method: 'POST',
                        body: formData 
                    })
                        .then(response => resolve(response.json()))
                        .catch(error => reject(error));
            });
        }
        
        ReturnedRadioFieldChange(event: any): void {
            this.selectedRadioBtn = this.radioBtns.findIndex((btn: any) => (btn.key === event));
            this.advancedSearchOptions = new AdvancedSearchOption();
            this.FilterArray('position', this.selectedRadioBtn);

            setTimeout(() => { this.CreateOptionsObj(); }, 50);
        }

        ReturnedSelectFieldChange(event: any): void {
            if (event.id === 'district') {
                this.advancedSearchOptions.District = event.value;
                if (event.value === ''){
                    setTimeout(() => {(document.getElementById('complex-area') as HTMLSelectElement).value = this.advancedSearchOptions.ComplexArea;},1); 
                    setTimeout(() => {(document.getElementById('complex') as HTMLSelectElement).value = this.advancedSearchOptions.Complex;},1); 
                    setTimeout(() => {(document.getElementById('school') as HTMLSelectElement).value = this.advancedSearchOptions.School;},1); 
                    setTimeout(() => {(document.getElementById('position') as HTMLSelectElement).value = this.advancedSearchOptions.Position;},1); 
                }else{
                    this.advancedSearchOptions.ComplexArea = '';
                    this.advancedSearchOptions.Complex = '';
                    this.advancedSearchOptions.School = '';
                    this.advancedSearchOptions.Position = '';
                }
            }
            else if (event.id === 'complex-area') {
                this.advancedSearchOptions.ComplexArea = event.value;
                if (event.value === ''){
                    setTimeout(() => {(document.getElementById('complex') as HTMLSelectElement).value = this.advancedSearchOptions.Complex;},1); 
                    setTimeout(() => {(document.getElementById('school') as HTMLSelectElement).value = this.advancedSearchOptions.School;},1); 
                    setTimeout(() => {(document.getElementById('position') as HTMLSelectElement).value = this.advancedSearchOptions.Position;},1); 
                }else{
                    this.advancedSearchOptions.Complex = '';
                    this.advancedSearchOptions.School = '';
                    this.advancedSearchOptions.Position = '';
                }
            }
            else if (event.id === 'complex') {
                this.advancedSearchOptions.Complex = event.value;
                if (event.value === ''){
                    setTimeout(() => {(document.getElementById('school') as HTMLSelectElement).value = this.advancedSearchOptions.School;},1); 
                    setTimeout(() => {(document.getElementById('position') as HTMLSelectElement).value = this.advancedSearchOptions.Position;},1); 
                }else{
                    this.advancedSearchOptions.School = '';
                    this.advancedSearchOptions.Position = '';
                }
            }
            else if (event.id === 'school') {
                this.advancedSearchOptions.School = event.value;
                if (event.value === ''){
                    setTimeout(() => {(document.getElementById('position') as HTMLSelectElement).value = this.advancedSearchOptions.Position;},1); 
                }else{
                    this.advancedSearchOptions.Position = '';
                }
            }
            else if (event.id === 'position') this.advancedSearchOptions.Position = event.value;

            if (event.id !== 'position') this.FilterArray('position', this.selectedRadioBtn);
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


            setTimeout(() => { (document.querySelector('#search-category input') as HTMLElement).focus(); }, 50);
            
            this.$emit('advancedSearchString', '');
        }

        FilterArray(whicharray:string, whichtype:Number): void{
            let temparray:Array<any>;
            const schoff:string = whichtype === 0 ? 'school' : 'office';

            if(whicharray === 'position'){
                temparray = this.positions.filter((p:any) => (p.type === schoff && (p.district === this.advancedSearchOptions.District || this.advancedSearchOptions.District === '') && (p.complexArea === this.advancedSearchOptions.ComplexArea || this.advancedSearchOptions.ComplexArea === '') && (p.complex === this.advancedSearchOptions.Complex || this.advancedSearchOptions.Complex === '') && (p.school === this.advancedSearchOptions.School || this.advancedSearchOptions.School === '')));
                this.fpositions = [];

                const pos = temparray.map(position => position.value);

	            this.fpositions = pos.filter((p, pIndex) => pos.indexOf(p) >= pIndex).map((fp) => ({
                    value: fp,
                    label: fp }));
                //let prev:string = '';
                //temparray.forEach(pos => {  

                    //if(pos.value !== prev){
                    //    this.fpositions.push(pos);
                    //    prev = pos.value;
                    //}
         
                    //let flg:number = 0;
                    //this.fpositions.forEach((fpos:any) => {
                    //    if(fpos.value === pos.value){
                    //       flg = 1; 
                    //    }
                    //})
                    //if (flg === 0) this.fpositions.push(pos)
                 //})                
            }
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
