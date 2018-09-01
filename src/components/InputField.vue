<!--
    @Prop id: string            -> ID given to input field
    @Prop type?: string         -> Type of input field (optional)
    @Prop label?: string        -> Value for label (optional)
    @Prop value?: string        -> Value passed to input field (optional)
    @Prop placeHolder?: string  -> Value for input field place holder (optional)
    @Prop isDisabled?: boolean  -> Flag if input field is disabled/enabled (optional)
    @Prop isRequired?: boolean  -> Flag if input field is required (optional)

    @input  -> Function called whenever input field changes; Passes value of input field back to parent Component
-->

<template>
    <div id="InputField">
        <label :for="id" v-if="label !== undefined">
            {{ label }}:
            <span class="required" v-if="this.isRequired">*</span>
        </label>
        <input :id="id" :placeholder="placeHolder" :disabled="isDisabled" :required="isRequired" v-model="vModel" @input="Changed()" @keyup="Changed()" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import FPhoneNumber from "@/filters/PhoneNumber.js";

    @Component({
        components: {
            FPhoneNumber
        }
    })
    export default class InputField extends Vue {
        @Prop() id: any;
        @Prop() type: any;
        @Prop() label: any;
        @Prop() value: any;
        @Prop() placeHolder: any;
        @Prop() isDisabled: any;
        @Prop() isRequired: any;
        vModel: string = "";

        constructor() {
            super();
            if (this.value !== undefined) this.vModel = this.value;
        }

        Changed(): void {
            switch(this.type) {
                case 'phone': {
                    this.vModel = FPhoneNumber(this.vModel);

                    // Add cursor placement code
                }

                default: {
                    this.$emit('inputChange', this.vModel);
                    break;
                }
            }
        }
    }
</script>

<style scoped>
    #InputField {
        padding: 10px;
        text-align: left;
        display: flex;
        flex-direction: column;
    }

    label {
        padding-bottom: 5px;
    }

    input {
        padding: 5px;
    }
</style>
