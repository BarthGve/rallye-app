import Aura from "@primevue/themes/aura";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import Ripple from "primevue/ripple";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Menu from "primevue/menu";
import Password from "primevue/password";
import Select from "primevue/select";

import ConfirmationService from "primevue/confirmationservice";

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

app.directive("ripple", Ripple);

app.use(ToastService);
app.use(ConfirmationService);

app.component("Button", Button);
app.component("Password", Password);
app.component("InputText", InputText);
app.component("Menu", Menu);
app.component("Select", Select);

// Monte l'application sur l'élément avec l'ID "app"
app.mount("#app");
