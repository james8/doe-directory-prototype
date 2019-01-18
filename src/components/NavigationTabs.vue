<template>
    <div id="navigation-tabs" @keyup="CloseMobileMenu($event);">
        <ul class="menu normalMenu" role="menu">
            <li class="menuItem" role="menuitem" v-for="activeRoute in activeRoutes" :key="activeRoute.id">
                <router-link :to="activeRoute.path">{{ activeRoute.name }}</router-link>
            </li>
            <li class="portal menuItem" role="menuitem" v-if="!Auth_IsAuthenticated()">
                <button type="button" @click="Auth_Login()">Sign In</button>
            </li>
            <div class="portal" v-if="Auth_IsAuthenticated()">
                <li class="menuItem" role="menuitem">
                    <button type="button" @click="ChangePortal(activePortalTab.route);">{{ activePortalTab.title }}</button>
                </li>
                <li class="menuItem" role="menuitem">
                    <button type="button" @click="Auth_Logout()">Sign Out</button>
                </li>
            </div>
        </ul>

        <div class="menu mobileMenu">
            <button type="button" class="menuToggle fas fa-bars" aria-label="open menu" @click="OpenMobileMenu();"></button>
            <ul role="menu" v-bind:class="cssMenuClass">
                <li role="menuitem" class="menuItem" v-for="activeRoute in activeRoutes" :key="activeRoute.id" inert>
                    <router-link :to="activeRoute.path" @click.native="CloseMobileMenu();">{{ activeRoute.name }}</router-link>
                </li>
                <li role="menuitem" class="portal menuItem" v-if="!Auth_IsAuthenticated()" inert>
                    <button type="button" @click="Auth_Login()">Sign In</button>
                </li>
                <div class="portal" v-if="Auth_IsAuthenticated()">
                    <li role="menuitem" class="menuItem" inert>
                        <button type="button" @click="ChangePortal(activePortalTab.route); CloseMobileMenu();">{{ activePortalTab.title }}</button>
                    </li>
                    <li role="menuitem" class="menuItem" inert>
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
        id: number;
        title: string;
        route: string;
        portal: boolean;

        constructor(id: number = -1, title: string = "", route: string = "", portal: boolean = false) {
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
        activeRoutes: Array<any> = [];
        portal: boolean = false;    // portal - 0: Public, 1: Admin
        portalTabs: Array<PortalTab> = [];
        activePortalTab: PortalTab = new PortalTab();
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

            // Determine portal type (for reloading page) 
            this.portal = (window.location.pathname.includes('admin'));
            this.DetermineLinks();
        }

        ChangePortal(route: string): void {
            this.$router.push(route);
            this.portal = !this.portal;
            this.DetermineLinks();
        }

        DetermineLinks(): void {
            // portal route (Public/Admin)
            this.activePortalTab = this.portalTabs[Number(this.portal)];

            // routes
            this.routes.forEach((route: any) => {
                if (route.path !== "*") this.activeRoutes.push(route);
                this.activeRoutes = this.activeRoutes.filter(activeRoute => {
                    const isAdminPath: number = activeRoute.path.indexOf("admin");
                    if (!this.portal) return (isAdminPath === -1);
                    else return (isAdminPath > -1);
                });
            });
        }

        OpenMobileMenu(): void {
            // Open menu
            this.cssMenuClass = 'menuOpen';

            // Trap focus in menu
            const attr: string = 'inert';
            // Menu button
            (document.querySelector('.mobileMenu button') as HTMLInputElement).setAttribute(attr, '');
            // Menu tabs
            const navElems: NodeListOf<Element> = document.querySelectorAll('.mobileMenu ul li');
            navElems.forEach(navElem => navElem.removeAttribute(attr));
            // Body content
            (document.querySelector('#navigation-tabs ~ div') as HTMLInputElement).setAttribute(attr, '');

            // Set focus to current tab or first available tab (if 404)
            setTimeout(() => {
                const toFocus: HTMLInputElement = document.querySelector('.mobileMenu .router-link-active') as HTMLInputElement;
                (toFocus !== null) ? toFocus.focus() : (document.querySelector('.mobileMenu li a') as HTMLInputElement).focus();
            }, 50);
        }

        CloseMobileMenu(event?: KeyboardEvent): void {
            if ((event === undefined) || (event.key === 'Escape')) {
                // Un-trap focus
                const attr: string = 'inert';
                // Menu button
                const button: HTMLInputElement = document.querySelector('.mobileMenu button') as HTMLInputElement;
                button.removeAttribute(attr);
                button.focus();
                // Menu tabs
                const navElems: NodeListOf<Element> = document.querySelectorAll('.mobileMenu ul li');
                navElems.forEach(navElem => navElem.setAttribute(attr, ''));
                // body content
                (document.querySelector('#navigation-tabs ~ div') as HTMLInputElement).removeAttribute(attr);

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