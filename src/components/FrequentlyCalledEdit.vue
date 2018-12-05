<!--
    @Prop frequentlyCalled: IFrequentlyCalled       -> Frequently Called information to populate Edit form
    @Prop editable: boolean                         -> Flag if form is editable or not

    @Output SaveForm()                              -> Saves updated information for FC item
    @Output CancelForm()                            -> Confirms if Cancel is desired; Passes null back to Parent Component
-->

<template>
    <div id="frequently-called-edit" class="form">
        <backdrop></backdrop>
        <toast v-if="showToast" :type="toastType" :msg="toastMsg" @closeToast="showToast = $event"></toast>

        <form id="frequently-called-edit-form">
            <header>{{ title }}</header>

            <span>All fields with a (*) are required fields</span>
            <br />
            <br />

            <div class="summaryModified">
                Modified By: {{ frequentlyCalled.lastModifiedBy }} - {{ frequentlyCalled.lastModified | FDateTime2 }}
            </div>

            <input-field :id="'fc-title'" :isRequired="true" :isDisabled="!canEdit"
                :label="'Title'" :value="form.title"
                :errorId="'errorTitle'" :errorMsg="errorTitle"
                @inputChange="UpdateFrequentlyCalled('title', $event);"> 
            </input-field>

            <input-field :id="'fc-contact'" :type="'phone'" :isRequired="true" :isDisabled="!canEdit"
                :label="'Contact'" :value="form.contact | FPhoneNumber"
                :errorId="'errorContact'" :errorMsg="errorContact"
                @inputChange="UpdateFrequentlyCalled('contact', $event);"> 
            </input-field>

            <input-field :id="'fc-contact2'" :type="'phone'" :isDisabled="!canEdit"
                :label="'Contact 2'" :value="form.contact2 | FPhoneNumber"
                :errorId="'errorContact2'" :errorMsg="errorContact2"
                @inputChange="UpdateFrequentlyCalled('contact2', $event);"> 
            </input-field>

            <input-field :id="'fc-email'"
                :label="'Email'" :value="form.email" :isDisabled="!canEdit"
                @inputChange="UpdateFrequentlyCalled('email', $event);"> 
            </input-field>

            <input-field :id="'fc-site'"
                :label="'Site'" :value="form.site" :isDisabled="!canEdit"
                @inputChange="UpdateFrequentlyCalled('site', $event);"> 
            </input-field>

            <div class="buttons">
                <button type="button" id="fc-edit-save" class="btn btnSuccess" v-bind:class="{ btnDisabled: !canSave }"
                    v-if="canEdit" :disabled="!canSave" @click="SaveForm();">
                    Save
                </button>
                <button type="button" id="fc-edit-cancel" class="btn btnError" @click="CancelForm();">
                    Cancel
                </button>
            </div>

            <loader :aria-busy="saving" :label="'Saving...'" :display="saving"></loader>
        </form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    
    import FDateTime2 from "@/filters/DateTime2.ts";
    import FPhoneNumber from "@/filters/PhoneNumber.ts";

    import IFrequentlyCalled from "@/interfaces/IFrequentlyCalled.ts";

    import Backdrop from "@/components/Backdrop.vue";
    import InputField from "@/components/InputField.vue";
    import Loader from "@/components/Loader.vue";
    import Toast from "@/components/Toast.vue";

    @Component({
        components: {
            Backdrop,
            InputField,
            Loader,
            Toast
        },
        filters: {
            'FDateTime2': FDateTime2,
            'FPhoneNumber': FPhoneNumber
        }
    })
    export default class FrequentlyCalledEdit extends Vue {
        @Prop({ type: Object as (() => IFrequentlyCalled), required: true }) frequentlyCalled!: IFrequentlyCalled;
        @Prop({ type: Boolean, required: true }) editable!: boolean;

        title: string = "";

        original: any = {};
        form: any = {};
        errorTitle: string = "";
        errorContact: string = "";
        errorContact2: string = "";
        
        canEdit: boolean = this.editable;
        canSave: boolean = false;
        saving: boolean = false;

        showToast: boolean = false;
        toastType: string = "normal";
        toastMsg: string = "Hello";

        created(): void {
            // Set focus on 'header' for Screen Readers
            setTimeout(() => { (document.getElementById('frequently-called-edit-form') as HTMLElement).focus(); }, 50);

            const fc: IFrequentlyCalled = this.frequentlyCalled;
            this.title = fc.title;

            // Cache form data (no way to prompt user of data loss if they refresh or navigate to another page)
            // Use passed data if no chache (i.e. new edit)
            const keys: Array<string> = Object.keys(fc);
            const vals: Array<string> = Object.values(fc);
            keys.forEach((key: string, i: number) => this.original[key] = vals[i]);

            // Use cached data if present
            const cachedFC: Object = JSON.parse(sessionStorage.getItem('frequently-called.form') || '{}');
            const cachedKeys: Array<string> = Object.keys(cachedFC);
            const cachedVals: Array<string> = Object.values(cachedFC);
            if (cachedKeys.length > 0) cachedKeys.forEach((key: string, i: number) => this.form[key] = cachedVals[i]);
            else keys.forEach((key: string, i: number) => this.form[key] = vals[i]);

            const cachedEditable: boolean = JSON.parse(sessionStorage.getItem('frequently-called.editable') || 'null');
            if (cachedEditable !== null) this.canEdit = cachedEditable;

            // Cache data
            sessionStorage.setItem('frequently-called.original', JSON.stringify(this.original));
            sessionStorage.setItem('frequently-called.form', JSON.stringify(this.form));
            sessionStorage.setItem('frequently-called.editable', JSON.stringify(this.canEdit));
            this.CheckIfCanSave();
        }

        destroyed(): void {
            // Clean up (cache not needed)
            sessionStorage.removeItem('frequently-called.original');
            sessionStorage.removeItem('frequently-called.form');
            sessionStorage.removeItem('frequently-called.editable');
        }

        UpdateFrequentlyCalled(key: string, event: any): void {
            this.form[key] = event;
            sessionStorage.setItem('frequently-called.form', JSON.stringify(this.form));
            this.CheckIfCanSave();
        }

        CheckIfCanSave(): void {
            const o: string = JSON.stringify(this.original);
            const f: string = JSON.stringify(this.form);
            const form: any = this.form;

            this.errorTitle = (form.title === '') ? "A Title is required." : "";
            this.errorContact = (form.contact === '') ? "A Contact number is required."
                : ((form.contact.length < 10) ? "Invalid number provided." : "");
            this.errorContact2 = ((form.contact2 !== '') && (form.contact2.length < 10)) ? "Invalid number provided." : "";

            this.canSave = (o !== f) && (!this.errorTitle && !this.errorContact && !this.errorContact2);
        }

        SaveForm(): void {
            // disable all form elements while saving form
            const elems: NodeListOf<Element> = document.querySelectorAll('form input, form button');
            elems.forEach((elem: Element) => elem.setAttribute('inert', ''));

            // save data
            this.saving = true;
            setTimeout(() => {
                const loaderElem: HTMLElement = document.getElementById('loader') as HTMLElement;
                loaderElem.scrollIntoView();
            }, 15);

            // !! should save data here instead of pretending to save after 2s
            setTimeout(() => {
                console.log('saved data: ', this.form);

                const savedData = this.form;
                this.saving = false;
                this.toastType = 'success';
                this.toastMsg = `Frequently Called '${ savedData.title }' successfully updated`;
                this.showToast = true;
                
                // reset form with updated data after toast closes
                setTimeout(() => {
                    this.original = savedData;
                    this.CheckIfCanSave();
                    elems.forEach((elem: Element) => elem.removeAttribute('inert'));
                    setTimeout(() => { (document.getElementById('fc-edit-cancel') as HTMLElement).focus() }, 50);
                }, 2500);
            }, 2000);
        }

        CancelForm(): void {
            const o: string = JSON.stringify(this.original);
            const f: string = JSON.stringify(this.form);
            const dirty: boolean = (o !== f);

            let cancel: boolean = true;
            if (dirty) cancel = confirm("Are you sure you want to close the form? Any unsaved data will be lost.");
            if (cancel) this.$emit('returnedFCData', null);
        }
    }
</script>

<style scoped>
    .summaryModified {
        background-color: #ffecb3;
        border-left: 6px solid #ffc107;
        border-radius: 5px;
        font-style: italic;
        padding: 15px;
        display: flex;
    }
</style>
