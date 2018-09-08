import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        // {
        //   path: "/",
        //   name: "home",
        //   component: Home
        // },
        // {
        //   path: "/about",
        //   name: "about",
        //   // route level code-splitting
        //   // this generates a separate chunk (about.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
        // },
        {
            path: "/search",
            name: "Search",
            component: (() => import("@/views/Search.vue"))
        },
        {
            path: "/frequently-called",
            name: "Frequently Called",
            component: (() => import("@/views/FrequentlyCalled.vue"))
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
