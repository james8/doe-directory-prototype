<!--
    @Prop userInfo: Array<Object>       -> Data to be displayed for User
        {
            key: string,
            value: string,
            longVal?: boolean   (optional)
        }
-->

<template>
    <div id="user-info" v-if="userInfo.value !== undefined">
        <span>{{ userInfo.key }}</span>
        <span v-bind:class="userInfo.longVal ? 'longVal' : ''">{{ userInfo.value }}</span>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";

    @Component
    export default class UserInfo extends Vue {
        @Prop() userInfo: any;
    }
</script>

<style scoped>
    #user-info {
        border-bottom: 1px solid #000;
        text-align: left;
        display: grid;
        grid-template-columns: 105px auto;
    }

    #user-info:last-of-type {
        border-bottom: none;
    }

    #user-info:hover {
        background-color: #e8c770;
        border-radius: 3px;
    }

    #user-info span {
        cursor: default;
        padding: 5px 15px;
        display: flex;
        justify-content: flex-start;
    }

    #user-info span:first-child {
        background-color: rgba(243, 243, 243, 0.5);
    }

    /* wrap long text if one string */
    .longVal {
        text-align: left;
        word-break: break-all;
    }
</style>
