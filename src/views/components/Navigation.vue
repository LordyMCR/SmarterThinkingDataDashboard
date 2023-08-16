<template>    
    <div id="test">
      <div id="main1">
          <nav>
              <router-link to="/dashboard" class="customLink"><div id="Dashboard">Dashboard</div></router-link>
              <router-link to="/app-user-management" class="customLink">
                <div>
                  App User Management
                </div>
              </router-link>
              <div class="dropdown" id="user-metrics">
                User Metrics:
              </div>
              <router-link to="/user-metrics-all-users" class="customLink">
                <div class="dropdown-content" id="user-metrics-content1">
                  All Users
                </div>
              </router-link>
              <router-link to="/user-metrics-by-submissions" class="customLink">
                <div class="dropdown-content" id="user-metrics-content2">
                    By Submissions
                </div>
              </router-link>
              <div class="dropdown" id="parameter-reports">
                Parameter Reports:
              </div>
              <router-link to="/parameter-user-search" class="customLink">
                <div class="dropdown-content" id="parameter-reports-content1">
                  User Parameters
                </div>
              </router-link>
              <router-link to="/parameter-feeling-search" class="customLink">
                <div class="dropdown-content">
                  Base Feeling Parameters
                </div>
              </router-link>
              <router-link to="/full-data-export" class="customLink">
                <div>
                  Full Data Export
                </div>
              </router-link>
              <router-link to="/about" class="customLink">
                <div>
                  About
                </div>
              </router-link>
          </nav>
      </div> 
      <div id="main2">
        <router-view />
      </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageTitle: "",
        };
    },
    watch: {
        $route(to, from) {
            this.pageTitle = to.name;
        },
    },
};
</script>

<style scoped>
#test {
    display: flex;
    flex-direction: row;
    height: 93vh;
  }
#main1 {
    width: 18.5vh;
    background: white;
    border-right: 1px solid #e0e0e0;

  }
  #main2 {
    width: 100%;
    background: #ededed;
    overflow: auto;
  }
  .customLink {
    text-decoration: none;
    color: black;
  }
  nav div {
    padding: 13px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    font-size: 16px;
  }
  nav div:hover {
    background-color: #8686ac;
    color: white;
    text-decoration: underline;
    text-decoration-color: white;
  }
  nav .active-link div {
    background-color: #ec549d !important;
    color: white;
    font-weight: bold;
    text-decoration: underline;
    text-decoration-color: white !important;
  }

  .dropdown, #user-metrics-content1, #parameter-reports-content1 {
    border-bottom: none;
  }

  .dropdown:hover {
    background-color: white;
    color: black;
    text-decoration: none;
  }
  .dropdown-content:hover {
    background-color: #8686ac;
    color: white !important;
    text-decoration: underline;
    text-decoration-color: white;
  }

</style>
