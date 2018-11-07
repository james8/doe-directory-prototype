<!--
    @Prop user: Array<Object>   -> Queried user data
    @Prop type: string          -> Type of User (show different data depending on type)
-->

<template>
    <div id="user">
        <div>
            <span class="title">{{ title }}</span>
            <UserInfo v-for="(item, index) in info" :key="index" :label="item.key" :value="item.value" :link="item.link" :longVal="item.longVal"></UserInfo>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop, Watch } from "vue-property-decorator";
    import UserInfo from "@/components/UserInfo.vue";
    import FPhoneNumber from "@/filters/PhoneNumber.ts";
    import FDateTime2 from "@/filters/DateTime2.ts";

    @Component({
        components: {
            UserInfo,
            FPhoneNumber,
            FDateTime2
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
                        { key: 'Phone', value: FPhoneNumber(user.Phone), link: { type: 'phone' } },
                        { key: 'Fax', value: FPhoneNumber(user.Fax), link: { type: 'phone' } },
                        { key: 'Site', value: user.Site, link: { type: 'site' }, longVal: true }
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
                    if (user.phone !== '') {
                        const phoneLabel: string = ((user.extension === '') ? FPhoneNumber(user.phone) : `${ FPhoneNumber(user.phone) } ext. ${ user.extension }`);
                        const phoneValue: string = ((user.extension === '') ? FPhoneNumber(user.phone) : `${ FPhoneNumber(user.phone) }, ${ user.extension }`);
                        this.info.push({ key: 'Phone', value: phoneValue, link: { type: 'phone', label: phoneLabel } });
                    }
                    if (user.fax !== '') 
                        this.info.push({ key: 'Fax', value: FPhoneNumber(user.fax), link: { type: 'phone' } });
                    if (user.cellular !== '')
                        this.info.push({ key: 'Cellular', value: FPhoneNumber(user.cellular), link: { type: 'phone' } });

                    break;
                }

                case 'frequently-called': {
                    this.title = user.Title;
                    this.info = [
                        { key: 'Phone', value: FPhoneNumber(user.Phone), link: { type: 'phone' } },
                        { key: 'Phone 2', value: FPhoneNumber(user.Phone2), link: { type: 'phone' } },
                        { key: 'Email', value: user.Email, link: { type: 'email' }, longVal: true },
                        { key: 'Site', value: user.Site, link: { type: 'site' }, longVal: true },
                        { key: 'Modified', value: user.Modified, longVal: true }
                    ];
                    break;
                }

                case 'edit-user': {
                    this.title = `${ user.alias || user.firstName } ${ user.lastName }`;

                    const isSchool = (user.type === 'S');
                    this.info = [];
                    this.info.push({ key: (isSchool ? 'District' : 'Office'), value: user.district });
                    this.info.push({ key: (isSchool ? 'Complex Area' : 'Branch'), value: user.complexArea });
                    this.info.push({ key: (isSchool ? 'Complex' : 'Section'), value: user.complex });
                    if (user.complex !== user.school)
                        this.info.push({ key: (isSchool ? 'School' : 'Sub-Section'), value: user.school });
                    this.info.push({ key: 'Position', value: user.posn });
                    if (user.phone !== '') {
                        const phone: string = ((user.extension === '') ? FPhoneNumber(user.phone) : `${ FPhoneNumber(user.phone) } ext. ${ user.extension }`);
                        this.info.push({ key: 'Phone', value: phone });
                    }
                    if (user.fax !== '')
                        this.info.push({ key: 'Fax', value: FPhoneNumber(user.fax) });
                    if (user.cellular !== '')
                        this.info.push({ key: 'Cellular', value: FPhoneNumber(user.cellular) });
                    this.info.push({ key: 'Modified By', value: user.lastModifiedBy || '' });
                    this.info.push({ key: 'Modified', value: FDateTime2(user.lastModified) });

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
