import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Adal from "vue-adal";

Vue.config.productionTip = false;

Vue.use(Adal, {
    config: {
        tenant: "e2879f29-7f5e-457a-9267-3b9c40a59868",
        clientId: "537395c1-3092-43df-923e-7e2f611b9d55",
        redirectUri: "http://localhost:8080",
        cacheLocation: "localStorage"
    },
    requireAuthOnInitialize: false,
    router: router
});

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
