<!--
    @Output SaveForm()      -> Saves information for new FC item; Closes form when done
    @Output CancelForm()    -> Confirms if Cancel is desired; Passes null back to Parent Component
-->

<template>
    <div id="frequently-called-add" class="form">
        <backdrop></backdrop>
        <toast v-if="showToast" :type="toastType" :msg="toastMsg" @closeToast="showToast = $event"></toast>

        <form action="" id="frequently-called-add-form">
            <header>{{ title }}</header>
            
            <span>All fields with a (*) are required fields</span>

            <input-field :id="'fc-title'" :isRequired="true"
                :label="'Title'" :value="form.title"
                :errorId="'errorTitle'" :errorMsg="errorTitle"
                @inputChange="UpdateFrequentlyCalled('title', $event);">
            </input-field>
            
            <input-field :id="'fc-contact'" :type="'phone'" :isRequired="true"
                :label="'Contact'" :value="form.contact | FPhoneNumber"
                :errorId="'errorContact'" :errorMsg="errorContact"
                @inputChange="UpdateFrequentlyCalled('contact', $event);">
            </input-field>
            
            <input-field :id="'fc-contact2'" :type="'phone'"
                :label="'Contact 2'" :value="form.contact2 | FPhoneNumber"
                :errorId="'errorContact2'" :errorMsg="errorContact2"
                @inputChange="UpdateFrequentlyCalled('contact2', $event);">
            </input-field>
            
            <input-field :id="'fc-email'"
                :label="'Email'" :value="form.email"
                @inputChange="UpdateFrequentlyCalled('email', $event);">
            </input-field>
            
            <input-field :id="'fc-site'"
                :label="'Site'" :value="form.site"
                @inputChange="UpdateFrequentlyCalled('site', $event);">
            </input-field>

            <div class="buttons">
                <button type="button" id="fc-add-save" class="btn btnSuccess" v-bind:class="{ btnDisabled: !canSave }"
                    :disabled="!canSave" @click="SaveForm();">
                    Create
                </button>
                <button type="button" id="fc-add-cancel" class="btn btnError" @click="CancelForm();">
                    Cancel
                </button>
            </div>

            <loader :aria-busy="saving" :label="'Saving...'" :display="saving"></loader>
        </form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";

    import FPhoneNumber from "@/filters/PhoneNumber.ts";

    import IFrequentlyCalled from '@/interfaces/IFrequentlyCalled';

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
            'FPhoneNumber': FPhoneNumber
        }
    })
    export default class FrequentlyCalledAdd extends Vue {
        title: string = "";

        original: any = {};
        form: any = {};
        errorTitle: string = "";
        errorContact: string = "";
        errorContact2: string = "";

        canSave: boolean = false;
        saving: boolean = false;

        showToast: boolean = false;
        toastType: string = "normal";
        toastMsg: string = "Hello";

        created(): void {
            const fc: IFrequentlyCalled = {
                title: '',
                contact: '',
                contact2: '',
                email: '',
                site: '',
                modified: ''
            };
            this.title = "New Contact";

            // Cache form data (no way to prompt user of data loss if they refresh or navigate to another page)
            const keys: Array<string> = Object.keys(fc);
            const vals: Array<string> = Object.values(fc);
            keys.forEach((key: string, i: number) => this.original[key] = vals[i]);

            // Use cached data if present
            const cachedFC: Object = JSON.parse(sessionStorage.getItem('frequently-called.form') || '{}');
            const cachedKeys: Array<string> = Object.keys(cachedFC);
            const cachedVals: Array<string> = Object.values(cachedFC);
            if (cachedKeys.length > 0) cachedKeys.forEach((key: string, i: number) => this.form[key] = cachedVals[i]);
            else keys.forEach((key: string, i: number) => this.form[key] = vals[i]);

            // Cache data
            sessionStorage.setItem('frequently-called.original', JSON.stringify(this.original));
            sessionStorage.setItem('frequently-called.form', JSON.stringify(this.form));
            sessionStorage.setItem('frequently-called.new', JSON.stringify('true'));
        }

        destroyed(): void {
            // Clean up (cache not needed)
            sessionStorage.removeItem('frequently-called.original');
            sessionStorage.removeItem('frequently-called.form');
            sessionStorage.removeItem('frequently-called.new');
        }

        UpdateFrequentlyCalled(key: string, event: any): void {
            this.form[key] = event;
            sessionStorage.setItem('frequently-called.form', JSON.stringify(this.form));
            this.CheckIfCanSave();
        }

        CheckIfCanSave(): void {
            const form: any = this.form;

            this.errorTitle = (form.title === '') ? "A Title is required." : "";
            this.errorContact = (form.contact === '') ? "A Contact number is required."
                : ((form.contact.length < 10)  ? "Invalid Contact number provided." : "");
            this.errorContact2 = ((form.contact2 !== '') && (form.contact2.length < 10)) ? "Invalid Contact number provided." : "";

            this.canSave = (!this.errorTitle && !this.errorContact && !this.errorContact2);
        }

        SaveForm(): void {
            // disable all form elements while savig form
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
                this.toastMsg = `Frequently Called '${ savedData.title }' successfully created`;
                this.showToast = true;

                // close form after toast closes
                setTimeout(() => {
                    const close: HTMLElement = document.getElementById('fc-add-cancel') as HTMLElement;
                    close.click();
                }, 2500);
            }, 2000);
        }

        CancelForm(): void {
            const o: string = JSON.stringify(this.original);
            const f: string = JSON.stringify(this.form);
            const dirty = (o !== f);

            let cancel: boolean = true;
            if (dirty) cancel = confirm("Are you sure you want to close the form? New contact will be lost.");
            if (cancel) this.$emit('returnedFCData', null);
        }
    }
</script>

<style scoped>

</style>
