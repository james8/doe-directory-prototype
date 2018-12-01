<!--

-->

<template>
    <div class="form">
        <backdrop></backdrop>
        <toast v-if="showToast" :type="toastType" :msg="toastMsg" @closeToast="showToast = $event"></toast>

        <form action="" id="frequently-called-add-form">
            <header>{{ title }}</header>
            
            <span>All fields with a (*) are required fields</span>

            <input-field :id="'fc-title'" :isRequired="true"
                :label="'Title'" :value="form.title"
                @inputChange="UpdateFrequentlyCalled('title', $event);">
                {{ errorTitle }}
            </input-field>
            
            <input-field :id="'fc-contact'" :isRequired="true"
                :label="'Contact'" :value="form.contact | FPhoneNumber"
                @inputChange="UpdateFrequentlyCalled('contact', $event);">
                {{ errorContact }}
            </input-field>
            
            <input-field :id="'fc-contact2'"
                :label="'Contact 2'" :value="form.contact2 | FPhoneNumber"
                @inputChange="UpdateFrequentlyCalled('contact2', $event);">
                {{ errorContact2 }}
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
                <button type="button" id="fc-add-save" class="btn btnSuccess" @click="SaveForm();">
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

        dirty: boolean = false;
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
        }

        CheckIfCanSave(): void {
            this.canSave = false;
            const f: any = this.form;

            if (f.title === '') this.errorTitle = "A Title is required.";
            if (f.contact === '') this.errorContact = "A Contact number is required.";
            if ((f.contact.length !== 10) || (f.contact.length !== 11)) this.errorContact = "Invalid number provided.";
            if ((f.contact2.length !== 10) || (f.contact2.length !== 11)) this.errorContact2 = "Invalid number provided.";
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
            let cancel: boolean = true;
            if (this.dirty) cancel = confirm("Are you sure you want to close the form? New contact will be lost.");
            if (cancel) this.$emit('returnedFCData', null);
        }
    }
</script>

<style scoped>

</style>
