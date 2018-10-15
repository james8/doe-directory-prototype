<template>
    <div class="form">
        <Backdrop></Backdrop>
        <form id="frequently-called-edit-form">
            <header>{{ result.Title }}</header>
            <p class="requireAlert">All fields marked with an * are required</p>

            <InputField :id="'fc-title'" :label="'Title'" :value="result.Title" :isRequired="true" @inputChange="UpdateResult('Title', $event);"></InputField>
            <InputField :id="'fc-phone'" :type="'phone'" :label="'Phone'" :value="result.Phone | FPhoneNumber" @inputChange="UpdateResult('Phone', $event);"></InputField>
            <InputField :id="'fc-phone2'" :type="'phone'" :label="'Phone 2'" :value="result.Phone2 | FPhoneNumber" @inputChange="UpdateResult('Phone2', $event);"></InputField>
            <InputField :id="'fc-email'" :label="'Email'" :value="result.Email" @inputChange="UpdateResult('Email', $event);"></InputField>
            <InputField :id="'fc-site'" :label="'Site'" :value="result.Site" @inputChange="UpdateResult('Site', $event);"></InputField>
            <InputField :id="'fc-modified'" :label="'Modified'" :value="result.Modified" :isDisabled="true"></InputField>

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
    import FPhoneNumber from "@/filters/PhoneNumber.ts";
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
    export default class FrequentlyCalledEdit extends Vue {
        @Prop() result: any;
        saving: boolean = false;

        original: any = {};

        created(): void {
            this.original['Title'] = this.result.Title;
            this.original['Phone'] = this.result.Phone;
            this.original['Phone2'] = this.result.Phone2;
            this.original['Email'] = this.result.Email;
            this.original['Site'] = this.result.Site;
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
                this.$emit('returnedFCData', 'mydata');
            }, 2000);
        }

        CancelForm(): void {
            const a: any = this.original;
            const b: any = this.result;
            const dirty: boolean = (
                (a.Title !== b.Title)
                || (a.Phone !== b.Phone)
                || (a.Phone2 !== b.Phone2)
                || (a.Email !== b.Email)
                || (a.Site !== b.Site)
            );

            if (dirty) {
                if (confirm("Are you sure you want to close form?")) {
                    const keys: Array<string> = Object.keys(this.original);
                    keys.forEach(key => (this.result[key] = this.original[key]));

                    this.$emit('returnedFCData', null);
                }
            }
            else this.$emit('returnedFCData', null);
        }
    }
</script>
