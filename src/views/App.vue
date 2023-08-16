<template>
    <body>
      <HeaderBar />
      <Navigation v-if="!isLoggedIn" />
    </body>
</template>

<script>
import { ref, watch, computed } from 'vue'
import Dashboard from './pages/Dashboard.vue';
import HeaderBar from './components/HeaderBar.vue';
import Navigation from './components/Navigation.vue';

export default {
  name: 'App',
  components: { HeaderBar, Navigation },
  setup() {
    const user = ref(null)

    function login(user) {
      user.value = user
    }

    watch(user, (newValue, oldValue) => {
      if (newValue) {
        router.push({ Dashboard });
      }
    });

    const isLoggedIn = computed(() => {
      return user.value !== null
    })

    return { user, login, isLoggedIn  }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>