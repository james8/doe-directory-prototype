<!--
    @Prop id: string                    -> ID given to fieldset
    @Prop ariaLabelledById?: string     -> ID used for aria-labelledby 
    @Prop noFieldset?: boolean          -> Flag if radio buttons wrapped in a fieldset (optional)
    @Prop legend: string	            -> Label for legend
    @Prop flow?: boolean                -> Flag if radio buttons aligned horizontally (optional)
    @Prop isDisabled?: boolean          -> Flag if radio buttons disabled/enabled (optional)
    @Prop isRequired?: boolean          -> Flag if radio field required (optional)
    @Prop buttons: Array<IButtons>      -> Array of radio buttons
        {
            key: string,
            value: string,
            checked?: boolean (optional)
        }
-->

<template>
    <div :id="id" class="radioGroup" v-bind:class="noFieldset ? 'hideFieldset' : ''" role="radiogroup" :aria-labelledby="(ariaLabelledById === undefined) ? 'radio-legend' : ariaLabelledById">
        <legend id="radio-legend" v-bind:class="noFieldset ? 'hideLegend' : ''">{{ legend }}</legend>
        <div class="wrapper" v-bind:class="flow ? 'flowH' : 'flowV'">
            <div v-for="(button, index) in buttons" :key="index">
                <input type="radio" :id="`radio-${ button.key }`" :name="id" :value="button.key" :checked="button.checked" :disabled="isDisabled" :required="isRequired" @change="Changed($event)" role="radio" />
                <label :for="`radio-${ button.key }`">{{ button.value }}</label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";

    interface IButtons {
        key: string,
        value: string,
        checked?: boolean
    };

    @Component
    export default class RadioField extends Vue {
        @Prop({ type: String, required: true }) id!: string;
        @Prop({ type: String }) ariaLabelledById!: string;
        @Prop({ type: Boolean }) noFieldset!: boolean;
        @Prop({ type: String, required: true }) legend!: string;
        @Prop({ type: Boolean }) flow!: boolean;
        @Prop({ type: Boolean }) isDisabled!: boolean;
        @Prop({ type: Boolean }) isRequired!: boolean;
        @Prop({ type: Array as (() => Array<IButtons>)}) buttons!: Array<IButtons>;

        created(): void {
            // Validate IButtons (Prop type checking doesnt work for interfaces)
            const btns: Array<IButtons> = this.buttons;
            if (btns.length > 0) {
                btns.forEach((btn: IButtons) => {
                    if (btn.key === undefined) throw Error('Missing required prop for IButtons: "key"');
                    else if (typeof(btn.key) !== 'string') throw Error(`Invalid prop for IButtons: type check failed for prop "key".\nExpected String, got ${ typeof(btn.key) }.`);

                    if (btn.value === undefined) throw Error('Missing required prop for IButtons: "value"');
                    else if (typeof(btn.value) !== 'string') throw Error(`Invalid prop for IButtons: type check failed for prop "value".\nExpected String, got ${ typeof(btn.value) }.`);

                    if ((btn.checked !== undefined) && (typeof(btn.checked) !== 'boolean'))
                        throw Error(`Invalid prop for IButtons: type check failed for prop "checked".\nExpected Boolean, got ${ typeof(btn.checked) }.`); 
                });
            }
            else throw Error('Missing required prop: "buttons"');
        }

        Changed(event: Event): void {
            this.$emit('inputChange', (event.target as HTMLInputElement).value);
        }
    }
</script>

<style scoped>
    .radioGroup {
        border-radius: 5px;
        /* margin: 24px; */
        padding: 5px 12px;
    }

    .hideFieldset {
        border: none;
    }

    legend {
        font-weight: bold;
        padding: 5px 10px;
        text-align: left;
    }

    .hideLegend {
        display: none;
    }

    .flowH {
        display: flex;
    }

    .wrapper div {
        padding: 5px;
        text-align: left;
        width: 25%;
    }

    .wrapper.flowV div {
        width: 100%;
    }

    input, label {
        cursor: pointer;
        padding: 5px;
    }
</style>
