<!--
    @Prop user: IUser       -> User's information to populate Edit form

    @Output SaveForm()      -> Saves updated information for User; Passes information to parent Component
    @Output CancelForm()    -> Confirms if Cancel is desired; Passes null back to parent Component
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

            <InputField :id="'u-alias'"
                :label="'Alias (first name only)'" :value="form.alias"
                @inputChange="UpdateUser('alias', $event);"
            ></InputField>
            <div class="phoneGroup">
                <InputField :id="'u-phone'" :type="'phone'"
                    :label="'Phone'" :value="form.phone | FPhoneNumber"
                    @inputChange="UpdateUser('phone', $event);"
                ></InputField>
                <InputField :id="'u-ext'" :type="'phone-extension'"
                    :label="'Ext'" :value="form.extension"
                    @inputChange="UpdateUser('extension', $event);"
                ></InputField>
            </div>
            <InputField :id="'u-fax'" :type="'phone'"
                :label="'Fax'" :value="form.fax | FPhoneNumber"
                @inputChange="UpdateUser('fax', $event);"
            ></InputField>
            <InputField :id="'u-cellular'" :type="'phone'"
                :label="'Cellular'" :value="form.cellular | FPhoneNumber"
                @inputChange="UpdateUser('cellular', $event);"
            ></InputField>

            <div class="buttons">
                <button type="button" id="user-edit-save" class="btn btnSuccess" @click="SaveForm();" :disabled="!canSave" v-bind:class="btnClass">Save</button>
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
        @Prop({ type: Object as (() => IUser) }) user!: IUser;
        
        dirty: boolean = false;
        canSave: boolean = false;
        btnClass: string = "btnDisabled";
        saving: boolean = false;
        title: string = "";
        original: any = {};
        form: any = {};
        showToast: boolean = false;
        toastType: string = "normal";
        toastMsg: string = "Hello";

        created(): void {
            // Set focus on 'header' for Screen Readers
            setTimeout(() => {
                (document.getElementById('user-form') as HTMLElement).focus();
            }, 50);
            
            const r: any = this.user;
            this.title = ((r.alias === '') ? `${ r.firstName } ${ r.lastName }` : `${ r.alias } (${ r.firstName }) ${ r.lastName }`);

            // Cache form data (no way to prompt user of data loss if they refresh or navigate to another page)
            // Use passed data if no cache (i.e. new edit)
            const keys: Array<string> = Object.keys(r);
            const vals: Array<string> = Object.values(r);
            keys.forEach((key: string, i: number) => this.original[key] = vals[i]);

            // Use cahced data if present
            const form: Object = JSON.parse(sessionStorage.getItem('user.form') || '{}');
            if (Object.keys(form).length === 0) keys.forEach((key: string, i: number) => this.form[key] = vals[i]);
            else Object.keys(form).forEach((key: string, i: number) => this.form[key] = Object.values(form)[i]);

            // Cache data
            sessionStorage.setItem('user.original', JSON.stringify(this.original));
            sessionStorage.setItem('user.form', JSON.stringify(this.form));
            this.CheckIfCanSave();
        }

        destroyed(): void {
            // Clean up (cache not needed)
            sessionStorage.removeItem('user.original');
            sessionStorage.removeItem('user.form');
        }

        UpdateUser(key: string, event: any): void {
            // this.user[key] = event;

            this.form[key] = event;
            sessionStorage.setItem('user.form', JSON.stringify(this.form));
            this.CheckIfCanSave();
        }

        CheckIfCanSave(): void {
            const o: Object = JSON.stringify(this.original);
            const f: Object = JSON.stringify(this.form);
            this.btnClass = ((o !== f) ? "" : "btnDisabled");
            this.canSave = (o !== f);
            this.dirty = (o !== f);
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

            // !!should save data here instead of passing back to parent
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
                elems.forEach(elem => (elem.removeAttribute('inert')));
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
