<template>
    <div class="wrapper">
        <Backdrop></Backdrop>
        <form id="frequently-called-edit-form">
            <header>{{ result.Title }}</header>
            <p class="requireAlert">All fields marked with an * are required</p>

            <InputField :id="'fc-title'" :label="'Title'" :value="result.Title" :isRequired="true"></InputField>
            <InputField :id="'fc-phone'" :type="'phone'" :label="'Phone'" :value="result.Phone"></InputField>
            <InputField :id="'fc-phone2'" :label="'Phone 2'" :value="result.Phone2"></InputField>
            <InputField :id="'fc-email'" :label="'Email'" :value="result.Email"></InputField>
            <InputField :id="'fc-site'" :label="'Site'" :value="result.Site"></InputField>
            <InputField :id="'fc-modified'" :label="'Modified'" :value="result.Modified" :isDisabled="true"></InputField>

            <div class="buttons">
                <button type="button" id="fc-form-save" class="btn btnSuccess" @click="SaveForm();">Save</button>
                <button type="button" id="fc-form-cancel" class="btn btnError" @click="CancelForm();">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import InputField from "@/components/InputField.vue";
    import Backdrop from '@/components/Backdrop.vue';

    @Component({
        components: {
            InputField,
            Backdrop
        }
    })
    export default class FrequentlyCalledEdit extends Vue {
        @Prop() result: any;

        original: any = {};

        created() {
            this.original['title'] = this.result.Title;
            this.original['phone'] = this.result.Phone
            this.original['phone2'] = this.result.Phone2;
            this.original['email'] = this.result.Email;
            this.original['site'] = this.result.Site;
            this.original['modified'] = this.result.Modified;
        }

        SaveForm(): void {
            this.$emit('returnedFCData', 'mydata');
        }

        CancelForm(): void {
            console.log(this.result);
            console.log(this.original);
            
            if (confirm("Are you sure you want to close form?")) {
                this.$emit('returnedFCData', null);
            }
        }
    }
</script>

<style scoped>
    #frequently-called-edit-form {
        background-color: white;
        border-radius: 5px;
        border: 1px solid #000;
        box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.5);
        padding: 20px;
        position: fixed;
        top: 10%;
        right: 25%;
        left: 25%;
    }

    header {
        border-bottom: 4px double #000;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
        padding: 10px;
    }

    .requireAlert {
        font-style: italic;
    }

    .buttons {
        padding-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    #fc-form-save, #fc-form-cancel {
        width: 50%;
    }

    @media screen and (max-width: 600px) {
        #frequently-called-edit-form {
            right: 5%;
            left: 5%;
        }

        .buttons {
            flex-direction: column;
        }

        #fc-form-save, #fc-form-cancel {
            width: initial;
        }
    }
</style>
