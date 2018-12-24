import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/search",
            name: "Search",
            component: (() => import("@/views/Search.vue"))
        },
        {
            path: "/search2",
            name: "Search2",
            component: (() => import("@/views/Search2.vue"))
        },
        {
            path: "/frequently-called",
            name: "Frequently Called",
            component: (() => import("@/views/FrequentlyCalled.vue"))
        },
        {
            path: "/help",
            name: "Help",
            component: (() => import("@/views/Help.vue"))
        },
        {
            path: "/admin/frequently-called",
            name: "Frequently Called",
            component: (() => import("@/views/Admin_FrequentlyCalled.vue"))
        },
        {
            path: "/admin/users",
            name: "Users",
            component: (() => import("@/views/Admin_Users.vue"))
        },
        {
            path: "/404-page-not-found",
            name: "404",
            component: (() => import("@/views/404.vue"))
        },
        // {
        //     path: "*",
        //     name: "redirect",
        //     redirect: "/404-page-not-found"
        // }
    ]
});
