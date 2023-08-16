<template>
    <header>
        <div class="logo"><img src="../../assets/Smarter Thinking Logo on Light.png"></div>
        <div class="headingText">{{ pageTitle }}</div>
        <div class="userLogout" v-if="user && adminSnapshot > 0">
            <p>{{ user.email }}</p>
            <b-button variant="primary" @click="signOut">Logout</b-button>  
        </div>
    </header>
</template>

<script>
    import firebase from 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/compat/firestore';

export default {
    data() {
        return {
            pageTitle: "",
            user: null,
            adminSnapshot: null
        };
    },
    watch: {
        $route(to, from) {
            this.pageTitle = to.name;
        },
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user
                const adminRef = firebase.firestore().collection("admins").where("userID", "==", user.uid);
                adminRef.get().then(snapshot => {
                    this.adminSnapshot = snapshot.size;
                }).catch(error => {
                    console.error("Error getting admin snapshot: ", error);
                });
            } else {
                this.user = null;
                this.adminSnapshot = null;
            }
        })
    },
    methods: {
    async signOut() {
      try {
        await firebase.auth().signOut().then(() => {
            this.user = null;
            this.adminSnapshot = null;
            this.$router.push('/');
        });
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },
  },
};
</script>

<style scoped>
    header {
        background: white;
        height: 7vh;
        display: flex;
        border-bottom: 1px solid #e0e0e0;
    }
    img {
        width: 70%;
        height: 100%;
    }
    .logo {
        flex: 0 0 17vh;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #e0e0e0;
        
    }
    .headingText {
        flex: 10;
        display: flex;
        align-items: center;
        justify-content: left;
        padding-left: 0.5em;
        font-size: 3vh;
        font-weight: bold;
    }
    p {
        font-size: 1.2vh;
        font-weight: bold;
    }
    .userLogout {
        flex: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        border-left: 1px solid #e0e0e0;
    }
    .userLogout p {
        margin-top: 15px;
        margin-right: 15px;
    }
</style>