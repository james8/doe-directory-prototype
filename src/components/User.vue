<!--
    @Prop user: Array<Object>   -> Queried user data
    @Prop type: string          -> Type of User (show different data depending on type)
-->

<template>
    <div id="user">
        <div>
            <span class="title">{{ title }}</span>
            <UserInfo v-for="(item, index) in info" :key="index" :userInfo="item"></UserInfo>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch } from "vue-property-decorator";
    import UserInfo from "@/components/UserInfo.vue";
    import FPhoneNumber from "@/filters/PhoneNumber.js";

    @Component({
        components: {
            UserInfo,
            FPhoneNumber
        }
    })
    export default class User extends Vue {
        @Prop() user: any;
        @Prop() type: any;
        title: string = "";
        info: Array<Object> = [];

        @Watch('user', { immediate: true })
        UpdateUser() {
            const user = this.user;
            switch(this.type) {
                case 'school': {
                    this.title = user.Office;
                    this.info = [
                        { key: 'Grades', value: user.gradeRange },
                        { key: 'Island', value: user.island },
                        { key: 'Principal', value: `${ user.principalFirstName } ${ user.principalLastName }` },
                        { key: 'Address', value: `${ user.streetAddress }, ${ user.streetCity }, ${ user.streetZip }` },
                        { key: 'Phone', value: FPhoneNumber(user.telephone) },
                        { key: 'Fax', value: FPhoneNumber(user.fax) },
                        { key: 'Site', value: user.webSite, longVal: true }
                    ];
                    break;
                }

                case 'person': {
                    this.title = `${ user.NAME_FIRST_TX } ${ user.NAME_LAST_TX }`;
                    this.info = [
                        { key: 'Office', value: user.Office },
                        { key: 'Position', value: user.EXP_OBJ_DESC_TX },
                        { key: 'Phone', value: FPhoneNumber(user.telephone) },
                        { key: 'Fax', value: FPhoneNumber(user.fax) }
                    ];
                    break;
                }

                case 'frequently-called': {
                    this.title = user.Title;
                    this.info = [
                        { key: 'Phone', value: FPhoneNumber(user.Phone) },
                        { key: 'Phone 2', value: FPhoneNumber(user.Phone2) },
                        { key: 'Email', value: user.Email, longVal: true },
                        { key: 'Site', value: user.Site, longVal: true },
                        { key: 'Modified', value: user.Modified, longVal: true }
                    ];
                    break;
                }

                case 'user': {
                    this.title = `${ user.FirstName } ${ user.LastName }`;
                    this.info = [
                        { key: 'Office', value: user.Office },
                        { key: 'Section', value: user.Section },
                        { key: 'Phone', value: FPhoneNumber(user.Phone) },
                        { key: 'Ext', value: user.Ext },
                        { key: 'Fax', value: FPhoneNumber(user.Fax) },
                        { key: 'Cellular', value: FPhoneNumber(user.Cellular) },
                        { key: 'Start Date', value: user.StartDate },
                        { key: 'End Date', value: user.EndDate },
                        { key: 'Modified', value: user.Modified },
                    ];
                    break;
                }
            }
        }
    }
</script>

<style scoped>
    #user {
        border-bottom: 1px dotted #000;
    }

    #user > div {
        margin: 5px;
        padding: 15px;
    }

    #user > div:hover {
        background-color: #eab21d;
        border-radius: 5px;
    }

    .title {
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 10px;
        text-align: left;
        display: flex;
        justify-content: flex-start;
    }
</style>
