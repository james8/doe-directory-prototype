<template>
    <div class="wrapper">
        <Backdrop></Backdrop>
        <form id="frequently-called-edit-form">
            <header>{{ result.Title }}</header>

            <div class="formItem">
                <label for="fc-title">Title:</label>
                <input id="fc-title" :value="result.Title" />
            </div>

            <div class="formItem">
                <label for="fc-phone">Phone:</label>
                <input id="fc-phone" :value="result.Phone" />
            </div>
            
            <div class="formItem">
                <label for="fc-phone2">Phone 2:</label>
                <input id="fc-phone2" :value="result.Phone2" />
            </div>
            
            <div class="formItem">
                <label for="fc-email">Email:</label>
                <input id="fc-email" :value="result.Email" />
            </div>
            
            <div class="formItem">
                <label for="fc-site">Site:</label>
                <input id="fc-site" :value="result.Site" />
            </div>
            
            <div class="formItem">
                <label for="fc-modified">Modified:</label>
                <input id="fc-modified" :value="result.Modified" />
            </div>

            <div class="buttons">
                <button type="button" id="fc-form-save" class="btnSuccess" @click="SaveForm();">Save</button>
                <button type="button" id="fc-form-cancel" class="btnError" @click="CancelForm();">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import Backdrop from '@/components/Backdrop.vue';

    @Component({
        components: { Backdrop }
    })
    export default class FrequentlyCalledEdit extends Vue {
        @Prop() result: any;

        SaveForm(): void {
            this.$emit('returnedFCData', 'mydata');
        }

        CancelForm(): void {
            this.$emit('returnedFCData', null);
        }
    }
</script>

<style scoped>
    #frequently-called-edit-form {
        background-color: white;
        border-radius: 5px;
        border: 1px solid #000;
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

    .formItem {
        padding: 10px;
        text-align: left;
        display: flex;
        flex-direction: column;
    }

    .formItem label {
        padding-bottom: 5px;
    }

    .formItem input {
        padding: 5px;
    }

    .buttons {
        padding-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    #fc-form-save, #fc-form-cancel {
        border: 1px solid #000;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        margin: 5px 10px;
        padding: 10px;
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
