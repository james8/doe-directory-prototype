<!--
    @Prop user: IUser           -> User's information to populate Edit form
    @Prop editable: boolean     -> Flag if form is editable or not

    @Output SaveForm()          -> Saves updated information for User; Passes information to Parent Component
    @Output CancelForm()        -> Confirms if Cancel is desired; Passes null back to Parent Component
-->

<template>
    <div id="users-edit" class="form">
        <backdrop></backdrop>
        <toast v-if="showToast" :type="toastType" :msg="toastMsg" @closeToast="showToast = $event"></toast>
        
        <form id="user-form" role="dialog" tabindex="-1">
            <header>{{ title }}</header>

            <div class="summary">
                <span>Name:</span>
                <span>{{ user.firstName }} {{ user.lastName }}</span>
                <span>District:</span>
                <span>{{ user.district }}</span>
                <span>Complex Area:</span>
                <span>{{ user.complexArea }}</span>
                <span>Complex:</span>
                <span>{{ user.complex }}</span>
                <span>Section:</span>
                <span>{{ user.school }} ({{ user.schoolId }})</span>
                <span>Title:</span>
                <span>{{ user.posn }}</span>
            </div>
            <div class="summaryModified">
                Modified By: {{ user.lastModifiedBy }} - {{ user.lastModified | FDateTime2 }}
            </div>

            <input-field :id="'u-alias'"
                :label="'Alias (first name only)'" :value="form.alias" :isDisabled="!canEdit"
                @inputChange="UpdateUser('alias', $event);">
            </input-field>

            <div class="phoneGroup">
                <input-field :id="'u-phone'" :type="'phone'"
                    :label="'Phone'" :value="form.phone | FPhoneNumber" :isDisabled="!canEdit"
                    @inputChange="UpdateUser('phone', $event);">
                </input-field>

                <input-field :id="'u-ext'" :type="'phone-extension'"
                    :label="'Ext'" :value="form.extension" :isDisabled="!canEdit"
                    @inputChange="UpdateUser('extension', $event);">
                </input-field>
            </div>

            <input-field :id="'u-fax'" :type="'phone'"
                :label="'Fax'" :value="form.fax | FPhoneNumber" :isDisabled="!canEdit"
                @inputChange="UpdateUser('fax', $event);">
            </input-field>

            <input-field :id="'u-cellular'" :type="'phone'"
                :label="'Cellular'" :value="form.cellular | FPhoneNumber" :isDisabled="!canEdit"
                @inputChange="UpdateUser('cellular', $event);">
            </input-field>

            <div class="buttons">
                <button type="button" id="user-edit-save" class="btn btnSuccess" @click="SaveForm();" v-if="canEdit" :disabled="!canSave" v-bind:class="btnClass">Save</button>
                <button type="button" id="user-edit-cancel" class="btn btnError" @click="CancelForm();">{{ this.dirty ? 'Cancel' : 'Close' }}</button>
            </div>

            <loader :aria-busy="saving" :label="'Saving...'" :display="saving"></loader>
        </form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";

    import FDateTime2 from "@/filters/DateTime2.ts";
    import FPhoneNumber from "@/filters/PhoneNumber.ts";

    import IUser from "@/interfaces/IUser.ts";

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
    export default class UsersEdit extends Vue {
        @Prop({ type: Object as (() => IUser), required: true }) user!: IUser;
        @Prop({ type: Boolean, required: true }) editable!: boolean;
        
        title: string = "";
        btnClass: string = "btnDisabled";

        original: any = {};
        form: any = {};

        canEdit: boolean = this.editable;
        dirty: boolean = false;
        canSave: boolean = false;
        saving: boolean = false;

        showToast: boolean = false;
        toastType: string = "normal";
        toastMsg: string = "Hello";

        created(): void {
            // Set focus on 'header' for Screen Readers
            setTimeout(() => { (document.getElementById('user-form') as HTMLElement).focus(); }, 50);

            const u: IUser = this.user;
            this.title = ((u.alias === '') ? `${ u.firstName } ${ u.lastName }` : `${ u.alias } (${ u.firstName }) ${ u.lastName }`);

            // Cache form data (no way to prompt user of data loss if they refresh or navigate to another page)
            // Use passed data if no cache (i.e. new edit)
            const keys: Array<string> = Object.keys(u);
            const vals: Array<string> = Object.values(u);
            keys.forEach((key: string, i: number) => this.original[key] = vals[i]);

            // Use cahced data if present
            const cachedU: Object = JSON.parse(sessionStorage.getItem('user.form') || '{}');
            const cachedKeys: Array<string> = Object.keys(cachedU);
            const cahcedVals: Array<string> = Object.values(cachedU);
            if (cachedKeys.length > 0) cachedKeys.forEach((key: string, i: number) => this.form[key] = cahcedVals[i]);
            else keys.forEach((key: string, i: number) => this.form[key] = vals[i]);

            const cachedEditable: boolean = JSON.parse(sessionStorage.getItem('user.editable') || 'null');
            if (cachedEditable !== null) this.canEdit = cachedEditable;

            // Cache data
            sessionStorage.setItem('user.original', JSON.stringify(this.original));
            sessionStorage.setItem('user.form', JSON.stringify(this.form));
            sessionStorage.setItem('user.editable', JSON.stringify(this.canEdit));
            this.CheckIfCanSave();
        }

        destroyed(): void {
            // Clean up (cache not needed)
            sessionStorage.removeItem('user.original');
            sessionStorage.removeItem('user.form');
            sessionStorage.removeItem('user.editable');
        }

        UpdateUser(key: string, event: any): void {
            this.form[key] = event;
            sessionStorage.setItem('user.form', JSON.stringify(this.form));
            this.CheckIfCanSave();
        }

        CheckIfCanSave(): void {
            const o: Object = JSON.stringify(this.original);
            const f: Object = JSON.stringify(this.form);
            this.btnClass = ((o !== f) ? "" : "btnDisabled");
            this.dirty = (o !== f);
            this.canSave = (o !== f);
        }

        SaveForm(): void {
            // disable all form elements while saving form
            const elems: NodeListOf<Element> = document.querySelectorAll('form input, form button');
            elems.forEach(elem => (elem.setAttribute('inert', '')));
            
            // save data
            this.showToast = false;
            this.saving = true; 
            setTimeout(() => {
                const loaderElem: HTMLElement = document.getElementById('loader') as HTMLElement;
                loaderElem.scrollIntoView();
            }, 15); 

            // !!should save data here instead of pretending to save after 2s
            setTimeout(() => {
                console.log('saved data:', this.form);

                const savedData = this.form;
                this.saving = false;
                this.toastType = 'success';
                this.toastMsg = `User '${ savedData.alias || savedData.firstName } ${ savedData.lastName }' successfully updated`; 
                this.showToast = true;

                // reset form with updated data
                this.original = savedData;
                this.CheckIfCanSave();
                elems.forEach((elem: Element) => elem.removeAttribute('inert'));
                setTimeout(() => { (document.getElementById('user-edit-cancel') as HTMLElement).focus(); }, 50);
            }, 2000);
        }

        CancelForm(): void {
            let cancel: boolean = true;
            if (this.dirty) cancel = confirm("Are you sure you want to close the form? Any unsaved data will be lost.");
            if (cancel) this.$emit('returnedFormData', null);
        }
    }
</script>

<style>
    .summary {
        background-color: #ffecb3;
        border-left: 6px solid #ffc107;
        border-radius: 5px 5px 0px 0px;
        display: grid;
        grid-template-columns: 130px auto;
    }

    .summary span:nth-child(odd) {
        font-weight: bold;
        padding: 5px;
        text-align: right;
    }

    .summary span:nth-child(even) {
        padding: 5px;
        text-align: left;
    }

    .summaryModified {
        background-color: #ffecb3;
        border-left: 6px solid #ffc107;
        border-radius: 0px 0px 5px 5px;
        font-style: italic;
        padding: 15px;
        display: flex;
    }

    .phoneGroup {
        display: grid;
        grid-template-columns: 70% 30%;
    }
</style>
