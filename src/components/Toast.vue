<!--
    @Prop type: string          -> Type of Toast ['normal', 'success', 'error']
    @Prop msg: string           -> Message displayed
    @Prop showFor?: number      -> Time (ms) Toast is shown for

    @Output closeToast()        -> Hides Toast after 'showFor' time; Passes 'false' to remove Toast.vue from DOM
-->

<template>
    <div id="toast" role="alert" class="slideIn" v-bind:class="`${ type }Toast`">{{ msg }}</div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
import { setTimeout } from 'timers';

    @Component
    export default class Toast extends Vue {
        @Prop({ type: String, required: true }) type!: 'normal' | 'success' | 'error';
        @Prop({ type: String, required: true }) msg!: string;
        @Prop({ type: Number }) showFor!: number;

        time: number = (this.showFor !== undefined) ? this.showFor : 2000;

        created(): void {
            setTimeout(() => {
                (document.getElementById('toast') as HTMLElement).classList.add('slideOut');
                setTimeout(() => { this.$emit('closeToast', false); }, 500);
            }, this.time);
        }
    }
</script>

<style>
    #toast {
        border-radius: 5px;
        box-shadow: 2px 2px 5px #000;
        color: #fff;
        font-family: Helvetica, Arial, 'sans-serif';
        padding: 20px;
        text-align: left;
        position: fixed;
        top: 15px;
        right: 15px;
        left: 15px;
    }

    .normalToast {
        background-color: #757575;
    }

    .successToast {
        background-color: #2E7D32;
    }

    .errorToast {
        background-color: #bd362f;
    }

    .slideIn {
        animation: fadeIn 0.5s;
    }
    
    .slideOut {
        animation: fadeOut 0.5s;
    }

    @keyframes fadeIn {
        from { opacity: 0; top: 0px; }
        to { opacity: 1; top: 15px; }
    }

    @keyframes fadeOut {
        from { opacity: 1; top: 15px; }
        to { opacity: 0; top: 0px; }
    }
</style>
