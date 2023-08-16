import { createRouter, createWebHistory } from "vue-router";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import Login from "../views/pages/Login.vue"
import Dashboard from "../views/pages/Dashboard.vue"
import AppUserManagement from "../views/pages/AppUserManagement.vue"
import UserDetails from "../views/pages/UserDetails.vue"
import SubmissionDetails from "../views/pages/SubmissionDetails.vue"
import UserMetricsAllUsers from "../views/pages/UserMetricsAllUsers.vue"
import UserMetricsBySubmissions from "../views/pages/UserMetricsBySubmissions.vue"
import ParameterUserSearch from "../views/pages/ParameterUserSearch.vue"
import SelectedUserParameterReport from "../views/pages/SelectedUserParameterReport.vue"
import ParameterFeelingSearch from "../views/pages/ParameterFeelingSearch.vue"
import SelectedFeelingParameterReport from "../views/pages/SelectedFeelingParameterReport.vue"
import FullDataExport from "../views/pages/FullDataExport.vue"
import About from "../views/pages/About.vue"
import NotFound from "../views/pages/NotFound.vue"


const routes = [
    { 
        path: "/",
        name: "Login",
        meta: {
            title: "Login",
        },
        component: Login
    },
    { 
        path: "/dashboard",
        name: "Dashboard",
        meta: {
            title: "Dashboard",
            requiresAuth: true
        },
        component: Dashboard
    },
    { 
        path: "/app-user-management",
        name: "App User Management",
        meta: {
            title: "App User Management",
            requiresAuth: true
        },
        component: AppUserManagement
    },
    { 
        path: "/app-user-management/:id",
        name: "User Details",
        meta: {
            title: "User Details",
            requiresAuth: true
        },
        component: UserDetails,
    },
    { 
        path: "/app-user-management/:id/:docID",
        name: "Submission Details",
        meta: {
            title: "Submission Details",
            requiresAuth: true
        },
        component: SubmissionDetails,
    },
    { 
        path: "/user-metrics-all-users",
        name: "User Metrics - All Users",
        meta: {
            title: "User Metrics - All Users",
            requiresAuth: true
        },
        component: UserMetricsAllUsers
    },
    { 
        path: "/user-metrics-by-submissions",
        name: "User Metrics - By Submissions",
        meta: {
            title: "User Metrics - By Submissions",
            requiresAuth: true
        },
        component: UserMetricsBySubmissions
    },
    { 
        path: "/parameter-user-search",
        name: "Parameter Report - User Search",
        meta: {
            title: "Parameter Report - User Search",
            requiresAuth: true
        },
        component: ParameterUserSearch,
        beforeEnter: (to, from, next) => {
            if (to.query.q) {
                next({ name: 'Selected User Parameter Report', query: to.query });
            } else {
                next();
            }
        }
    }, 
    {
        path: '/parameter-user-search',
        name: 'Selected User Parameter Report',
        meta: {
            title: 'Selected User Parameter Report',
            requiresAuth: true
        },
        component: SelectedUserParameterReport,
        props: route => ({ selectionCategory: route.query.s, query: route.query.q })
    },
    { 
        path: "/parameter-feeling-search",
        name: "Parameter Report - Feeling Search",
        meta: {
            title: "Parameter Report - Feeling Search",
            requiresAuth: true
        },
        component: ParameterFeelingSearch,
        beforeEnter: (to, from, next) => {
            if (to.query.q) {
                next({ name: 'Selected Feeling Parameter Report', query: to.query });
            } else {
                next();
            }
        }
    }, 
    {
        path: '/parameter-feeling-search',
        name: 'Selected Feeling Parameter Report',
        meta: {
            title: 'Selected Feeling Parameter Report',
            requiresAuth: true
        },
        component: SelectedFeelingParameterReport,
        props: route => ({ selectionCategory: route.query.s, query: route.query.q })
    },
    { 
        path: "/full-data-export",
        name: "Full Data Export",
        meta: {
            title: "Full Data Export",
            requiresAuth: true
        },
        component: FullDataExport
    },
    {
        path: '/about',
        name: 'About',
        meta: {
            title: 'About',
            requiresAuth: true
        },
        component: About
    },
    { 
        path: "/:pathMath(.*)*",
        name: "404 Error",
        meta: {
            title: "404 Error",
            requiresAuth: true
        },
        component: NotFound 
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: "active-link",
})

router.beforeEach((to, from, next) => {
    document.title = to.name + " - Smarter Thinking Admin Dashboard";
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const currentUser = firebase.auth().currentUser;
  
    if (requiresAuth && !currentUser) {
        document.title = "Login - Smarter Thinking Admin Dashboard";
        if (to.path !== '/') { 
          next('/');
        } else {
          next();
        }
    } else if (currentUser && to.path === '/') {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
