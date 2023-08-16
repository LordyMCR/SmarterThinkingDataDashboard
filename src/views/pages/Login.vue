<template>
  <div class="container">
    <form class="login-form" @submit.prevent="login">
      <label for="email">Email address</label>
      <input id="email" v-model="email" name="email" type="email" required>
      <label for="password">Password</label>
      <input id="password" v-model="password" name="password" type="password" required>
      <b-button type="submit" variant="primary">Login</b-button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>


<script>
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/analytics'

export default {
    name: 'Login',

    data() {
      return {
          email: '',
          password: '',
          errorMessage: '',
      };
    },
    created() {
      // firebase.analytics().setUserProperties({
      //   platform: 'web'
      // });
    },
    methods: {
      async login() {
        try {
          const userCredential = await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
          const user = userCredential.user;
          const adminRef = firebase.firestore().collection("admins").where("userID", "==", user.uid);
          const adminSnapshot = await adminRef.get();
          if (adminSnapshot.size == 0) {
            await firebase.auth().signOut();
            this.errorMessage = "Don't have permissions to access dashboard, contact the administrators.";
          } else {
            this.$emit('login', user);
            this.$router.push('/dashboard');
            
            // firebase.analytics().logEvent('login', { 
            //   method: 'email',
            //   source: 'web'
            // });

          }
        } catch (error) {
          this.errorMessage = error.message;
        }
      }
    },
};
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: center;
    height: 93vh;
  }

  .login-form {
    padding: 20px;
    max-width: 400px;
    width: 100%;
  }

  .login-form label {
    display: block;
    margin-bottom: 10px;
  }

  .login-form input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-bottom: 20px;
  }

  button {
    display: block;
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 3px;
  }

  .error-message {
    color: red;
    margin-top: 10px;
}

</style>