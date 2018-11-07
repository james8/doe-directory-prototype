<!--
    @Prop label: string,	                    -> Label to be displayed for User
    @Prop value: string,                        -> Value to be displayed for User
    @Prop link?: Object                         -> Options for links (e.g. hyperlinks or phone numbers)
        {
            type: 'phone' | 'site' | 'email,    -> Type of link
            label?: string                      -> Label to be used for link (specifically for hyperlinks); @Prop(value) will be used for link value
        }
    @Prop longVal?: boolean	                    -> Flag to signify if 'longVal' class is to be applied to Value (for word-wrapping)
-->

<template>
    <div id="user-info" v-if="value !== undefined">
        <span>{{ label }}</span>
        <!-- Special Record -->
        <span v-if="link !== undefined">
            <a v-if="link.type === 'phone'" v-bind:href="href">
                {{ ((link.label !== undefined) ? link.label : value) }}
            </a>
            <a v-if="link.type === 'site'" v-bind:class="longVal ? 'longVal' : ''" v-bind:href="href" target="_blank">
                {{ ((link.label !== undefined) ? link.label : value) }}
            </a>
            <a v-if="link.type === 'email'" v-bind:class="longVal ? 'longVal' : ''" v-bind:href="href">
                {{ ((link.label !== undefined) ? link.label : value) }}
            </a>
        </span>
        <!-- Normal Record -->
        <span v-else v-bind:class="longVal ? 'longVal' : ''">{{ value }}</span>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";

    interface ILink {
        type: 'phone' | 'site' | 'email',
        label?: string
    };

    @Component
    export default class UserInfo extends Vue {
        @Prop({ type: String, required: true }) label!: string;
        @Prop({ type: String, required: true }) value!: string;
        @Prop({ type: Object as (() => ILink) }) link!: ILink;
        @Prop({ type: Boolean }) longVal!: boolean;

        href!: string;

        created(): void {
            // Validate ILink (Prop type checking doesnt work for interfaces)
            const link: ILink = this.link;
            if (link !== undefined) {
                if (link.type === undefined) throw Error('Missing required prop for ILink: "type"');
                else if ((link.type !== 'phone') && (link.type !== 'site') && (link.type !== 'email'))
                    throw Error(`Invalid prop for ILink: value check failed for prop "type".\nExpected ['phone', 'site', or 'email'], got '${ link.type }'.`);
                    
                if ((link.label !== undefined) && (typeof(link.label) !== 'string'))
                    throw Error(`Invalid prop for ILink: type check failed for prop "label".\nExpected String, got ${ typeof(link.label) }.`);
            }

            // Configure href value if needed
            const l: Object = this.link;
            if (l !== undefined) {
                if ((l as ILink).type === 'phone') this.href = `tel:${ this.value }`;
                else if ((l as ILink).type === 'site') this.href = this.value;
                else if ((l as ILink).type === 'email') this.href = `mailto:${ this.value }`;
            }
        }
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
