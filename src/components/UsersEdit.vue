<template>
    <div class="form">
        <Backdrop></Backdrop>
        <form id="user-form">
            <header>{{ title }}</header>
            <p class="requireAlert">All fields marked with an * are required</p>

            <InputField :id="'u-first-name'" :label="'First Name'" :value="result.FirstName" @inputChange="UpdateResult('FirstName', $event);"></InputField>
            <InputField :id="'u-last-name'" :label="'Last Name'" :value="result.LastName" :isDisabled="true"></InputField>
            <InputField :id="'u-office'" :label="'Office'" :value="result.Office" :isDisabled="true"></InputField>
            <InputField :id="'u-section'" :label="'Section'" :value="result.Section" @inputChange="UpdateResult('Section', $event);"></InputField>
            <InputField :id="'u-phone'" :type="'phone'" :label="'Phone'" :value="result.Phone | FPhoneNumber" @inputChange="UpdateResult('Phone', $event);"></InputField>
            <InputField :id="'u-ext'" :label="'Ext'" :value="result.Ext" @inputChange="UpdateResult('Ext', $event);"></InputField>
            <InputField :id="'u-fax'" :type="'phone'" :label="'Fax'" :value="result.Fax | FPhoneNumber" @inputChange="UpdateResult('Fax', $event);"></InputField>
            <InputField :id="'u-cellular'" :type="'phone'" :label="'Cellular'" :value="result.Cellular | FPhoneNumber" @inputChange="UpdateResult('Cellular', $event);"></InputField>
            <InputField :id="'u-start-date'" :label="'Start Date'" :value="result.StartDate" @inputChange="UpdateResult('StartDate', $event);"></InputField>
            <InputField :id="'u-end-date'" :label="'End Date'" :value="result.EndDate" @inputChange="UpdateResult('EndDate', $event);"></InputField>
            <InputField :id="'u-modified'" :label="'Modified'" :value="result.Modified" :isDisabled="true"></InputField>

            <div class="buttons">
                <button type="button" class="btn btnSuccess" @click="SaveForm();">Save</button>
                <button type="button" class="btn btnError" @click="CancelForm();">Cancel</button>
            </div>

            <Loader :label="'Saving...'" :display="saving"></Loader>
        </form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import FPhoneNumber from "@/filters/PhoneNumber.js";
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
            'FPhoneNumber': FPhoneNumber
        }
    })
    export default class UsersEdit extends Vue {
        @Prop() result: any;
        saving: boolean = false;
        title: string = "";

        original: any = {};

        created() {
            this.title = ((this.result.FirstName !== undefined)
                ? `${ this.result.FirstName } ${ this.result.LastName }`
                : "New Employee");

            this.original['FirstName'] = this.result.FirstName;
            this.original['LastName'] = this.result.LastName;
            this.original['Office'] = this.result.Office;
            this.original['Section'] = this.result.Section;
            this.original['Phone'] = this.result.Phone;
            this.original['Ext'] = this.result.Ext;
            this.original['Fax'] = this.result.Fax;
            this.original['Cellular'] = this.result.Cellular;
            this.original['StartDate'] = this.result.StartDate;
            this.original['EndDate'] = this.result.EndDate;
            this.original['Modified'] = this.result.Modified;
        }

        UpdateResult(key: string, event: any): void {
            this.result[key] = event;
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

            setTimeout(() => {
                this.saving = false;
                this.$emit('returnedFormData', 'mydata');
            }, 2000);
        }

        CancelForm(): void {
            const a: any = this.original;
            const b: any = this.result;
            const dirty: boolean = (
                (a.FirstName !== b.FirstName)
                || (a.FirstName !== b.FirstName)
                || (a.LastName !== b.LastName)
                || (a.Office !== b.Office)
                || (a.Section !== b.Section)
                || (a.Phone !== b.Phone)
                || (a.Ext !== b.Ext)
                || (a.Fax !== b.Fax)
                || (a.Cellular !== b.Cellular)
                || (a.StartDate !== b.StartDate)
                || (a.EndDate !== b.EndDate)
                || (a.Modified !== b.Modified)
            );

            if (dirty) {
                if (confirm("Are you sure you want to close form?")) {
                    const keys: Array<string> = Object.keys(this.original);
                    keys.forEach(key => (this.result[key] = this.original[key]));

                    this.$emit('returnedFormData', null);
                }
            }
            else this.$emit('returnedFormData', null);
        }
    }
</script>
