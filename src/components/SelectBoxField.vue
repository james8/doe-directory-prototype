<!--
    @Prop id: string                -> ID given to select-box field
    @Prop label?: string            -> Value for label (optional)
    @Prop options: Array<Object>    -> Options used to populate select-box field
    @Prop selectorLabel: string     -> Field name to use for option's label
                                        (e.g. options = [{'Label':'a'},{'Label':'b'}]; selectorLabel = 'Label')
    @Prop selectorValue: string     -> Field name to use for option's value
                                        (e.g. options = [{'Value':'a'},{'Value':'b'}]; selectorValue = 'Value')
    @Prop value?: string            -> Value passed to select-box field (optional)
    @Prop isDisabled?: boolean      -> Flag if select-box field is disabled/enabled (optional)
    @Prop isRequired?: boolean      -> Flag if select-box field is required (optional)

    @Output Changed(Event)
        -> Function called when select changed; Passes id & value of select field back to parent Component
-->

<template>
    <div id="SelectBoxField">
        <label :for="id" v-if="label !== undefined">
            {{ label }}:
            <span class="required" v-if="this.isRequired">*</span>
        </label>
        <select :id="id" :value="value" :disabled="isDisabled" :required="isRequired" @change="Changed($event);">
            <option value="" selected>- Select -</option>
            <option v-for="(option, index) in options" :key="index" :value="option[selectorValue]">
                {{ option[selectorLabel] }}
            </option>
        </select>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";

    @Component
    export default class SelectBoxField extends Vue {
        @Prop({ type: String, required: true }) id!: string;
        @Prop({ type: String }) label!: string;
        @Prop({ type: Array, required: true }) options!: Array<Object>;
        @Prop({ type: String, required: true }) selectorLabel!: string;
        @Prop({ type: String, required: true }) selectorValue!: string;
        @Prop({ type: String }) value!: string;
        @Prop({ type: Boolean }) isDisabled!: boolean;
        @Prop({ type: Boolean }) isRequired!: boolean;

        Changed(event: Event): void {
            const returnObj: Object = {
                id: this.id,
                value: (event.target as HTMLSelectElement).value
            };
            this.$emit('selectChange', returnObj);
        }
    }
</script>

<style>
    #SelectBoxField {
        padding: 10px;
        text-align: left;
        display: flex;
        flex-direction: column;
    }

    label {
        padding-bottom: 5px;
    }

    select, option {
        padding: 5px;
    }

    select:disabled {
        background-color: #ebeae4;
        color: rgb(84, 84, 84);
    }
</style>
