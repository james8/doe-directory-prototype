<template>
    <div class="form">
        <Backdrop></Backdrop>
        <form id="user-form">
            <header>{{ title }}</header>
            <div class="summary">
                <span>Name:</span>
                <span>{{ result.firstName }} {{ result.lastName }}</span>
                <span>District:</span>
                <span>{{ result.district }}</span>
                <span>Complex Area:</span>
                <span>{{ result.complexArea }}</span>
                <span>Complex:</span>
                <span>{{ result.complex }}</span>
                <span>Section:</span>
                <span>{{ result.school }} ({{ result.schoolId }})</span>
                <span>Title:</span>
                <span>{{ result.posn }}</span>
            </div>
            <div class="summaryModified">
                Modified By: {{ result.lastModifiedBy }} - {{ result.lastModified | FDateTime2 }}
            </div>

            <InputField :id="'u-alias'"
                :label="'Alias (first name only)'" :value="form.alias"
                @inputChange="UpdateResult('alias', $event);"
            ></InputField>
            <div class="phoneGroup">
                <InputField :id="'u-phone'" :type="'phone'"
                    :label="'Phone'" :value="form.phone | FPhoneNumber"
                    @inputChange="UpdateResult('phone', $event);"
                ></InputField>
                <InputField :id="'u-ext'" :type="'phone-extension'"
                    :label="'Ext'" :value="form.extension"
                    @inputChange="UpdateResult('extension', $event);"
                ></InputField>
            </div>
            <InputField :id="'u-fax'" :type="'phone'"
                :label="'Fax'" :value="form.fax | FPhoneNumber"
                @inputChange="UpdateResult('fax', $event);"
            ></InputField>
            <InputField :id="'u-cellular'" :type="'phone'"
                :label="'Cellular'" :value="form.cellular | FPhoneNumber"
                @inputChange="UpdateResult('cellular', $event);"
            ></InputField>

            <div class="buttons">
                <button type="button" class="btn btnSuccess" @click="SaveForm();" :disabled="!canSave" v-bind:class="btnClass">Save</button>
                <button type="button" class="btn btnError" @click="CancelForm();">Cancel</button>
            </div>

            <Loader :label="'Saving...'" :display="saving"></Loader>
        </form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import FPhoneNumber from "@/filters/PhoneNumber.ts";
    import FDateTime2 from "@/filters/DateTime2.ts";
    import InputField from "@/components/InputField.vue";
    import Backdrop from "@/components/Backdrop.vue";
    import Loader from "@/components/Loader.vue";

    @Component({
        components: {
            InputField,
            Backdrop,
            Loader
        },
        filters: {
            'FPhoneNumber': FPhoneNumber,
            'FDateTime2': FDateTime2
        }
    })
    export default class UsersEdit extends Vue {
        @Prop() result: any;
        canSave: boolean = false;
        btnClass: string = "btnDisabled";
        saving: boolean = false;
        title: string = "";
        original: any = {};
        form: any = {};

        created(): void {
            const r: any = this.result;
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

        UpdateResult(key: string, event: any): void {
            // this.result[key] = event;

            this.form[key] = event;
            sessionStorage.setItem('user.form', JSON.stringify(this.form));
            this.CheckIfCanSave();
        }

        CheckIfCanSave(): void {
            const o: Object = JSON.stringify(this.original);
            const f: Object = JSON.stringify(this.form);
            this.btnClass = ((o !== f) ? "" : "btnDisabled");
            this.canSave = (o !== f);
        }

        SaveForm(): void {
            // disable all form elements while saving form
            const elems: NodeListOf<Element> = document.querySelectorAll('form input, form button');
            elems.forEach(elem => (elem.setAttribute('inert', '')));
            
            // save data
            this.saving = true; 
            setTimeout(() => {
                const loaderElem: HTMLElement = document.getElementById('loader') as HTMLElement;
                loaderElem.scrollIntoView();
            }, 15); 

            // !!should save data here instead of passing back to parent
            // this.$emit('returnedFormData', 'mydata');
            setTimeout(() => {
                this.saving = false;
                this.$emit('returnedFormData', this.result);
            }, 2000);
        }

        CancelForm(): void {
            const original: string = JSON.stringify(this.original);
            const form: string = JSON.stringify(this.form);
            const dirty: boolean = (original !== form);

            if (dirty) {
                if (confirm("Are you sure you want to close form? Any unsaved data will be lost.")) {
                    const keys: Array<string> = Object.keys(this.original);
                    keys.forEach(key => (this.result[key] = this.original[key]));

                    this.$emit('returnedFormData', null);
                }
            }
            else this.$emit('returnedFormData', null);
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
