import { createApp } from 'vue'
import App from './views/App.vue'
import firebase from 'firebase/compat/app'
import router from "./router"
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

let app;
firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App)
        .use(router)
        .use(BootstrapVue3)
        .mount('#app')
    }
});
