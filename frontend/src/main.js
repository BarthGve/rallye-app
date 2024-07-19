import Aura from "@primevue/themes/aura";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Menu from "primevue/menu";
import Password from "primevue/password";

import "@fortawesome/fontawesome-free/css/all.css";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import "vue-toastification/dist/index.css";
import "./index.css";

// Crée une seule instance de l'application
const app = createApp(App);

// Utilise PrimeVue avec la configuration du thème
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

// Utilise le routeur
app.use(router);

app.use(ToastService);

app.component("Button", Button);
app.component("Password", Password);
app.component("InputText", InputText);
app.component("Menu", Menu);

// Monte l'application sur l'élément avec l'ID "app"
app.mount("#app");
