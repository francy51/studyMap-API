// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.

// 1. Define route components.
Vue.component('current-card', {
    props: ['group'],
    template: `
    <div>
    <template>
    <v-flex>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Your groups</h3>
                <h5  v-if="group"> {{group.name}} </h5>
                <h5 v-else> No group currently active </h5>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat color="orange">Chat</v-btn>
              <v-btn flat color="orange">Explore</v-btn>
            </v-card-actions>
          </v-card>
    </v-flex>
    </template>
    </div>
`
})


Vue.component('group-card', {
    props: ['group'],
    template: `
    <div>
    <v-flex xs7 offset-xs5 offset-md2 offset-lg5>
        <v-card max-width=1000 min-width=200 width=600>
            <v-card-title>
              <div>
                <h3 class="headline mb-0">{{group.name}}</h3>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat color="orange">More details</v-btn>
              <v-btn flat color="orange">Chat</v-btn>
            </v-card-actions>
          </v-card>
         </v-flex>
    </div>`
})



// These can be imported from other files
const FindSessionComponent = { template: `<h1>Find session component</h1>` }
const FindGroupComponent = { template: `<h1>Find group component</h1>` }
const LoginComponent = {
    data: function() {
        return {
            email: "",
            password: "",
            rememberMe: false,
            loading: false
        }
    },
    template: `
    
    <v-container class="text-xs-center">
    <v-layout row class="text-xs-center" align-center justify-center row fill-height>
        <div class="text-xs-center" v-if="loading">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
        </div>
      <v-flex xs4 class="grey lighten-4" v-else>
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
          <v-card flat>
            <v-card-title primary-title>
              <h4>Login</h4>
            </v-card-title>
            <v-form>
            <v-text-field v-model='email' prepend-icon="person" name="Email" label="Email"></v-text-field>
            <v-text-field v-model='password' prepend-icon="lock" name="Password" label="Password" type="password"></v-text-field>
            <v-card-actions>
              <v-btn v-on:click='login' primary large block>Login</v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-container>
      </v-flex>

    </v-layout>
  </v-container>`,
    methods: {
        login: async function() {

            this.loading = true;

            try {
                // console.log(this.email)
                // console.log(this.password)
                // login(email: String!, password: String!): AuthData!
                let data = await sendRequest(`{login(email: "${this.email}", password: "${this.password}") {token}}`);

                console.log(data);
                let tk = data.login.token;
                if (tk != undefined || tk != "") {
                    console.log(tk)
                    app.token = tk;
                    app.turnOnRoutes();
                    router.replace('/main')
                }
                else {
                    this.loading = false;
                    console.warn("Wrong login");
                }
            }
            catch (err) {
                console.error(err);
            }
        }
    }
}
const MainComponent = {
    computed: {
        myGroups: function() {
            return app.myGroups;
        }
    },
    template: `
<div>
    <h1>Welcome back to the study map API</h1>
    
    <v-layout justify-center row wrap fill-height>
    <current-card/>
    <v-layout justify-space-around column fill-height>
        <template v-for="(group,index) in myGroups">
            <group-card v-bind:group="group"/>
        </template>
    </v-layout>
    </v-layout>


</div>`
}
const IndividualGroup = { template: `<h1>Individual group component</h1>` }
const IndividualUser = { template: `<h1>Individual user component</h1>` }
const NotesMenuComponent = { template: `<h1>Notes menu</h1>` }
const IndividualNote = { template: `<h1>Individual note</h1>` }
const UserProfile = {
    template: `
    <div>
        <h1>Profile</h1>
        <ul v-if="user.local">
        <li>
            Username: {{user.local.username}}
        </li>
        <li>
            Email: {{user.local.email}}
        </li>
        </ul>
        <v-switch v-model="allowOfflineUse"  v-on:change="setOfflineUsage">
            <div slot="label">
            Offline Usage
            </div>
        </v-switch>
    </div>`,
    data: function() {
        return {
            user: {}
        }
    },
    computed: {
        allowOfflineUse: () => {
            return app.allowOfflineUse;
        }
    },
    methods: {
        setOfflineUsage: () => {
            app.allowOfflineUse = !app.allowOfflineUse;
            window.localStorage.setItem('offlineFlag', app.allowOfflineUse);
            console.log(app.allowOfflineUse)
            app.$swal('Offline mode set to - ' + app.allowOfflineUse);
        },
        getUserData: async function() {
            let profile = window.localStorage.getItem('profile');
            console.log(profile)
            if (!profile) {
                let data = await sendRequest(`{myProfile{local{username,email}}}`)
                console.log(data);
                this.user = data.myProfile
                console.log(this.user);
            }
            else {
                this.user = profile;
            }

        }
    },
    created: function() {
        this.getUserData();
    }

}

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
    { name: 'home', path: '/main', component: MainComponent, visible: false, offline: true },
    { name: 'login', path: '/login', component: LoginComponent, visible: true },
    { name: 'group', path: '/group/:id', component: IndividualGroup, visible: false, fixed: true },
    { name: 'user', path: '/user/:id', component: IndividualUser, visible: false, fixed: true },
    { name: 'notes', path: '/notes', component: NotesMenuComponent, visible: false, offline: true },
    { name: 'note', path: '/notes/:id', component: IndividualNote, visible: false, fixed: true },
    { name: 'find Group', path: '/findGroup', component: FindGroupComponent, visible: false },
    { name: 'find Session', path: '/session', component: FindSessionComponent, visible: false },
    { name: 'profile', path: '/profile', component: UserProfile, visible: false, offline: true }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes // short for `routes: routes`
})


// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
    router,
    data: {
        token: "",
        routes: routes,
        groups: [],
        myGroups: [],
        allowOfflineUse: false,
        isOffline: false
    },
    methods: {
        turnOnRoutes: function() {
            for (var i in routes) {
                if (routes[i].name !== "login" && routes[i].fixed !== true)
                    routes[i].visible = true;
                else
                    routes[i].visible = false;
            }
        },
        turnOffRoutes: function() {
            for (var i in routes) {
                if (routes[i].name !== "login")
                    routes[i].visible = false;
                else
                    routes[i].visible = true;
            }
        },
        offlineMode: function() {
            for (var i in routes) {
                if (routes[i].name !== "login" && routes[i].fixed !== true && routes[i].offline == true)
                    routes[i].visible = true;
                else
                    routes[i].visible = false;
            }

            router.replace('/main')
        },
        notifyOffline: function() {
            if (this.allowOfflineUse)
                this.$swal('You offline! Your may continue working in offline mode.')
            else
                this.$swal('You offline! You are unable to work change this in your profile.')
        },
        notifyBackOnline: function() {
            this.$swal("You are back online!")
        }

    },

    created: function() {
        this.allowOfflineUse = window.localStorage.getItem('offlineFlag');
        if (this.token == "" || this.token == undefined) {
            router.replace('/login')
        }
        else {
            this.turnOnRoutes();
        }


    }
}).$mount('#app')

// Now the app has started!
router.beforeEach((to, from, next) => {
    // console.log('Global -- beforeEach - fired')
    // re-route
    if (to.path !== '/login' && app.token === "") {
        next('/login')
    }
    // Abort navigation based on some criteria:
    // else if (to.path === '/user/1') {
    //   next(false)
    // } 
    else if (to.path === '/error') {
        const err = new Error('My Error Message')

        // pass the error to onError() callback.
        next(err)
    }
    else {
        next()
    }
})

//Event listener that triggers the offline notification
window.addEventListener('offline', function(e) {
    app.allowOfflineUse = window.localStorage.getItem('offlineFlag');
    if (app.allowOfflineUse == null) app.allowOfflineUse = false;
    if (app.allowOfflineUse) {
        if (app.token === "") {
            app.token = "offline"
        }
        app.isOffline = true;
        app.offlineMode();
    }
    app.notifyOffline();
    console.log('offline');
});

//Event listener that triggers the online notification
window.addEventListener('online', function(e) {
    app.isOffline = false;
    if (app.token == "offline") {
        app.token = "";
        router.replace('/login')
        app.turnOffRoutes();
    }
    else {
        app.turnOnRoutes();
    }
    app.notifyBackOnline();
    console.log('online');
});


const sendRequest = async(query) => {
    try {
        if (app.isOffline) {
            console.warn("Currently offline so will not send any changes");
            return;
        }
        if (app.token == "" && app.$route.path != '/login') {
            console.warn("Not logged in")
            return;
        }
        //Remove this later
        let response = await axios.post('/api', { query }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'StudyMaps ' + app.token
            }
        });

        console.log(response);
        let data = response.data.data;
        if (app.allowOfflineUse == true) {
            SaveDataOffline(data);
        }

        return data;

    }
    catch (err) {
        console.log(err);
    }
}

const SaveDataOffline = async function(data) {

    if (!app.allowOfflineUse)
        return;

    console.log(data)

    window.localStorage.setItem('profile', data);

    console.warn("not implemented properly");
}
