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
    import FPhoneNumber from "@/filters/PhoneNumber.ts";
import { start } from 'repl';

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
                    this.title = user.SchoolName;
                    this.info = [
                        { key: 'Grades', value: user.GradeRange },
                        { key: 'Island', value: user.Island },
                        { key: 'Principal', value: `${ user.PrincipalFirstName } ${ user.PrincipalLastName }` },
                        { key: 'Address', value: user.Address },
                        { key: 'Phone', value: FPhoneNumber(user.Phone) },
                        { key: 'Fax', value: FPhoneNumber(user.Fax) },
                        { key: 'Site', value: user.Site, longVal: true }
                    ];
                    break;
                }

                case 'office': {
                    this.title = `${ user.alias || user.firstName } ${ user.lastName }`;

                    const isSchool = (user.type === 'S');
                    this.info = [];
                    this.info.push({ key: (isSchool ? 'District' : 'Office'), value: user.district });
                    this.info.push({ key: (isSchool ? 'Complex Area' : 'Branch'), value: user.complexArea });
                    this.info.push({ key: (isSchool ? 'Complex' : 'Section'), value: user.complex });
                    if (user.complex !== user.school)
                        this.info.push({ key: (isSchool ? 'School' : 'Sub-Section'), value: user.school });
                    this.info.push({ key: 'Position', value: user.posn });
                    if (user.phone !== '')
                        this.info.push({ key: 'Phone', value: ((user.extension === '') ? FPhoneNumber(user.phone) : `${ FPhoneNumber(user.phone) } ext. ${ user.extension }`) });
                    if (user.fax !== '')
                        this.info.push({ key: 'Fax', value: FPhoneNumber(user.fax) });
                    if (user.cellular !== '')
                        this.info.push({ key: 'Cellular', value: FPhoneNumber(user.cellular) });

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
                        { key: 'District', value: user.District },
                        { key: 'Complex Area', value: user.ComplexArea },
                        { key: 'Complex', value: user.Complex },
                        { key: 'Section', value: `${ user.Section } - ${ user.SectionId }` },
                        { key: 'Position', value: user.Position},

                        // { key: 'Office', value: user.Office },
                        // { key: 'Section', value: user.Section },
                        // { key: 'Phone', value: FPhoneNumber(user.Phone) },
                        // { key: 'Ext', value: user.Ext },
                        // { key: 'Fax', value: FPhoneNumber(user.Fax) },
                        // { key: 'Cellular', value: FPhoneNumber(user.Cellular) },
                        // { key: 'Start Date', value: user.StartDate },
                        // { key: 'End Date', value: user.EndDate },
                        // { key: 'Modified', value: user.Modified },
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
