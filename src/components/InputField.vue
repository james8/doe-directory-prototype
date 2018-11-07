<!--
    @Prop id: string            -> ID given to input field
    @Prop type?: string         -> Type of input field (optional)
    @Prop label?: string        -> Value for label (optional)
    @Prop value?: string        -> Value passed to input field (optional)
    @Prop placeHolder?: string  -> Value for input field place holder (optional)
    @Prop isDisabled?: boolean  -> Flag if input field is disabled/enabled (optional)
    @Prop isRequired?: boolean  -> Flag if input field is required (optional)

    @Output Changed(Event)
        -> Function called whenever input field changes; Passes value of input field back to parent Component
-->

<template>
    <div id="InputField">
        <label :for="id" v-if="label !== undefined">
            {{ label }}:
            <span class="required" v-if="this.isRequired">*</span>
        </label>
        <input :id="id" :placeholder="placeHolder" :disabled="isDisabled" :required="isRequired" v-model="vModel" @focus="FocusChange(true)" @blur="FocusChange(false)" @keyup="Changed($event)" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import FPhoneNumber from "@/filters/PhoneNumber.ts";
    import FNumber from "@/filters/Number.ts";

    @Component({
        components: {
            FPhoneNumber,
            FNumber
        },
        filters: {
            'FPhoneNumber': FPhoneNumber,
            'FNumber': FNumber
        }
    })
    export default class InputField extends Vue {
        @Prop({ type: String, required: true }) id!: string;
        @Prop({ type: String }) type!: string;
        @Prop({ type: String }) label!: string;
        @Prop({ type: String }) value!: string;
        @Prop({ type: String }) placeHolder!: string;
        @Prop({ type: Boolean }) isDisabled!: boolean;
        @Prop({ type: Boolean }) isRequired!: boolean;

        vModel: string = "";

        created(): void {
            // Set Input value if provided
            if (this.value !== undefined) this.vModel = this.value;
        }

        // Used for extra formatting when focused
        FocusChange(state: boolean): void {
            switch(this.type) {
                case 'phone': {
                    // add/remove phone# formatting
                    this.vModel = FPhoneNumber(this.vModel, state);
                    break;
                }

                case 'phone-extension': {
                    this.vModel = FNumber(this.vModel, 5);
                    break;
                }

                default: {
                    break;
                }
            }
        }

        Changed(event: Event): void {
            switch(this.type) {
                case 'phone': {
                    this.$emit('inputChange', FPhoneNumber(this.vModel, true));
                    break;
                }

                case 'phone-extension': {
                    this.$emit('inputChange', FNumber(this.vModel, 5));
                    break;
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
