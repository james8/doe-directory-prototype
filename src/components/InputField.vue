<!--
    @Prop id: string            -> ID given to input field
    @Prop type?: string         -> Type of input field (optional)
    @Prop label?: string        -> Value for label (optional)
    @Prop value?: string        -> Value passed to input field (optional)
    @Prop placeHolder?: string  -> Value for input field place holder (optional)
    @Prop isDisabled?: boolean  -> Flag if input field is disabled/enabled (optional)
    @Prop isRequired?: boolean  -> Flag if input field is required (optional)
    @Prop errorId?: string      -> ID used to populate aria-describedby (optional)
    @Prop errorMsg?: string	    -> Error message to be displayed (optional)

    @Output Changed(Event)      -> Function called whenever input field changes; Passes value of input field back to Parent Component
-->

<template>
    <div id="input-field">
        <label :for="id" v-if="label !== undefined">
            {{ label }}
            <span class="required" v-if="this.isRequired" aria-hidden="true">*</span>
        </label>
        <input :id="id" :placeholder="placeHolder" :disabled="isDisabled" v-model="vModel"
            :required="isRequired"
            :aria-describedby="errorId"
            @focus="FocusChange(true)" @blur="FocusChange(false)" @keyup="Changed($event)" />
        <span :id="errorId" class="inputError">{{ errorMsg }}</span>
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
        @Prop({ type: String }) errorId!: string;
        @Prop({ type: String }) errorMsg!: string;

        vModel: string = "";

        created(): void {
            // Set Input value if provided
            if (this.value !== undefined) this.vModel = this.value;
            
            setTimeout(() => {
                const elems: NodeListOf<Element> = document.querySelectorAll(`#${ this.id }`);
                if (this.type === 'phone') {
                    elems.forEach((elem: Element) => elem.setAttribute('pattern', '[0-9]{10,11}'));
                }
            }, 500);
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
    #input-field {
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

    .inputError {
        color: #ef5350;
        font-size: 14px;
        font-style: italic;
        font-weight: bold;
        padding-top: 5px;
    }
</style>
