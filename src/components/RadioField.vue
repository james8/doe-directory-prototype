<!--
    @Prop id?: string               -> ID given to fieldset (optional)
    @Prop noFieldset?:              -> Flag if radio buttons wrapped in a fieldset (optional)
    @Prop legend?:                  -> Label for legend (optional)
    @Prop flow?:                    -> Flag if radio buttons aligned horizontally (optional)
    @Prop isDisabled?:              -> Flag if radio buttons disabled/enabled (optional)
    @Prop isRequired?:              -> Flag if radio field required (optional)
    @Prop buttons: Array<Object>    ->
        {
            key: string,
            value: string,
            checked?: boolean (optional)
        }
-->

<template>
    <fieldset :id="id" v-bind:class="noFieldset ? 'hideFieldset' : ''">
        <legend v-bind:class="noFieldset ? 'hideLegend' : ''">{{ legend }}</legend>
        <div class="wrapper" v-bind:class="flow ? 'flowH' : 'flowV'">
            <div v-for="(button, index) in buttons" :key="index">
                <input type="radio" :id="`radio-${ button.key }`" :name="id" :value="button.key" :checked="button.checked" :disabled="isDisabled" :required="isRequired" @change="Changed($event)" />
                <label :for="`radio-${ button.key }`">{{ button.value }}</label>
            </div>
        </div>
    </fieldset>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";

    @Component
    export default class RadioField extends Vue {
        @Prop() id: any;
        @Prop() noFieldset: any;
        @Prop() legend: any;
        @Prop() flow: any;
        @Prop() isDisabled: any;
        @Prop() isRequired: any;
        @Prop() buttons: any;

        Changed(event: Event): void {
            this.$emit('inputChange', (event.target as HTMLInputElement).value);
        }
    }
</script>

<style scoped>
    fieldset {
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
