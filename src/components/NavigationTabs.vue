<template>
    <div id="NavigationTabs" @keyup="CloseMobileMenu($event);">
        <ul class="menu normalMenu" role="menu">
            <li class="menuItem" role="menuitem" v-for="route in routes" :key="route.id" v-if="(route.portal === portal) && (route.name !== '404') && (route.name !== 'redirect')">
                <router-link :to="route.path">{{ route.name }}</router-link>
            </li>
            <li class="portal menuItem" role="menuitem" v-if="!Auth_IsAuthenticated()">
                <button type="button" @click="Auth_Login()">Sign In</button>
            </li>
            <div class="portal" v-if="Auth_IsAuthenticated()">
                <li class="menuItem" role="menuitem" v-for="portalTab in portalTabs" :key="portalTab.id" v-if="portalTab.id == portal">
                    <button type="button" @click="ChangePortal(portalTab.route);">{{ portalTab.title }}</button>
                </li>
                <li class="menuItem" role="menuitem">
                    <button type="button" @click="Auth_Logout()">Sign Out</button>
                </li>
            </div>
        </ul>

        <div class="menu mobileMenu">
            <button type="button" class="menuToggle fas fa-bars" @click="OpenMobileMenu();"></button>
            <ul role="menu" v-bind:class="cssMenuClass" aria-hidden="true" inert>
                <li class="menuItem" role="menuitem" v-for="route in routes" :key="route.id" v-if="(route.portal === portal) && (route.name !== '404') && (route.name !== 'redirect')">
                    <router-link :to="route.path" @click.native="CloseMobileMenu();">{{ route.name }}</router-link>
                </li>
                <li class="portal menuItem" role="menuitem" v-if="!Auth_IsAuthenticated()">
                    <button type="button" @click="Auth_Login()">Sign In</button>
                </li>
                <div class="portal" v-if="Auth_IsAuthenticated()">
                    <li class="menuItem" role="menuitem" v-for="portalTab in portalTabs" :key="portalTab.id" v-if="portalTab.portal === portal">
                        <button type="button" @click="ChangePortal(portalTab.route); CloseMobileMenu();">{{ portalTab.title }}</button>
                    </li>
                    <li class="menuItem" role="menuitem">
                        <button type="button" @click="Auth_Logout()">Sign Out</button>
                    </li>
                </div>
            </ul>
        </div>
        <div class="backdrop" v-bind:class="cssMenuClass" @click="CloseMobileMenu();"></div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import Auth from "@/mixins/Auth.ts";

    class PortalTab {
        id: number = -1;
        title: string = "";
        route: string = "";
        portal: boolean = false;    // portal shown

        constructor(id: number, title: string, route: string, portal: boolean) {
            this.id = id;
            this.title = title;
            this.route = route;
            this.portal = portal;
        }
    }

    @Component({
        mixins: [
            Auth
        ]
    })
    export default class NavigationTabs extends Vue {
        routes: Array<any> = [];
        portal: boolean = false;    // portal - 0: Public, 1: Admin
        portalTabs: Array<PortalTab> = [];
        cssMenuClass: string = "";

        // Lifecycle Hooks
        created(): void {
            // Get defined routes
            this.routes = (this.$router as any).options.routes;

            this.portalTabs.push(new PortalTab(0, 'Admin Portal', '/admin/frequently-called', false));
            this.portalTabs.push(new PortalTab(1, 'Public Portal', '/search', true));

            // Determine if route is for Public/Admin
            this.routes.forEach((route, i) => {
                const rootPath = route.path.split('/')[1];
                this.routes[i]['portal'] = (rootPath === 'admin');
            });

            // Determin portal type (for reloading page) 
            this.portal = (window.location.pathname.includes('admin'));

            // Redirect if not a defined route (redirecting in router causes some strange behavior)
            const path = window.location.pathname;
            if (this.routes.findIndex(route => (route.path === path)) === -1)
                setTimeout(() => {
                    this.$router.push("404-page-not-found");
                }, 50);
        }

        ChangePortal(route: string): void {
            this.$router.push(route);
            this.portal = !this.portal;
        }

        OpenMobileMenu(): void {
            // Open menu
            this.cssMenuClass = 'menuOpen';

            // Trap focus in menu
            // using elem.inert = true/false gives error 'does not exist'
            const attr: string = 'inert';
            (document.querySelector('.mobileMenu button') as HTMLInputElement).setAttribute(attr, '');
            (document.querySelector('#NavigationTabs ~ div') as HTMLInputElement).setAttribute(attr, '');
            (document.querySelector('.mobileMenu ul') as HTMLInputElement).removeAttribute(attr);

            // Set focus to current tab or first available tab (if 404)
            setTimeout(() => {
                const toFocus: HTMLInputElement = document.querySelector('.mobileMenu .router-link-active') as HTMLInputElement;
                (toFocus !== null) ? toFocus.focus() : (document.querySelector('.mobileMenu li a') as HTMLInputElement).focus();
            }, 50);
        }

        CloseMobileMenu(event: KeyboardEvent): void {
            if ((event === undefined) || (event.key === 'Escape')) {
                // Un-trap focus
                const attr: string = 'inert';
                const button: HTMLInputElement = document.querySelector('.mobileMenu button') as HTMLInputElement;
                button.removeAttribute(attr);
                button.focus();
                (document.querySelector('#NavigationTabs ~ div') as HTMLInputElement).removeAttribute(attr);
                (document.querySelector('.mobileMenu ul') as HTMLInputElement).setAttribute(attr, '');

                // Close menu
                this.cssMenuClass = "";

                // Set focus to Menu button
                setTimeout(() => {
                    (document.querySelector('.mobileMenu button') as HTMLInputElement).focus();
                }, 50);
            }
        }
    }
</script>

<style scoped>
    .menu {
        background: linear-gradient(#166f94, #10536f);
        height: 48px;
    }

    ul {
        list-style: none;
        margin: 0px;
        padding: 0px 40px;
        display: flex;
    }

    .menuItem a, .menuItem button {
        color: #fff;
        padding: 15px 40px;
        text-decoration: none;
        display: block;
    }

    .menuItem button {
        background-color: transparent;
        border: none;
        font-size: 16px;
        height: 100%;
    }

    .portal {
        margin-left: auto;
        display: flex;
    }

    .menuToggle {
        background-color: transparent;
        border: none;
        color: #fff;
        font-size: 22px;
        width: 48px;
    }

    .mobileMenu {
        display: none;
    }

    .mobileMenu ul {
        background: linear-gradient(#166f94, #10536f);
        padding: 0px;
        width: 225px;
        position: fixed;
        top: 0px;
        bottom: 0px;
        z-index: 5;
        display: flex;
        flex-direction: column;
        transform: translateX(-225px);
        transition: transform 0.2s;
    }

    .mobileMenu .menuOpen {
        transform: translateX(0px);
        transition: transform 0.2s;
    }

    .mobileMenu li {
        margin-left: 0px;
        display: flex;
    }

    .mobileMenu ul a, .mobileMenu ul button {
        width: 100%;
        display: flex;
    }    

    .menuItem .router-link-exact-active,
    .menuItem a:hover, .menuItem a:focus,
    .menuItem button:hover, .menuItem button:focus,
    .mobileMenu button:hover, .mobileMenu button:focus {
        background-color: rgba(0, 0, 0, 0.3);
        cursor: pointer;
    }

    .backdrop {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        display: none;
    }

    .backdrop.menuOpen {
        display: block;
    }

    @media (max-width: 1075px) {
        .normalMenu {
            display: none;
        }

        .mobileMenu {
            display: flex;
        }

        .mobileMenu .portal {
            margin-left: 0px;
            flex-direction: column;
        }
    }
</style>