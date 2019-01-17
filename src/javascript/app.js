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
                <h3 class="headline mb-0">Current active group</h3>
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
        login: function() {
            this.loading = true;
            // console.log(this.email)
            // console.log(this.password)
            // login(email: String!, password: String!): AuthData!
            axios.post('/api', {
                    query: `
                    {
                      login(email: "${this.email}", password: "${this.password}") {
                        token
                      }
                    }`
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    console.log(response);
                    let tk = response.data.data.login.token;
                    if (tk != undefined || tk != "") {
                        console.log(tk)
                        app.token = tk;
                        app.turnOnRoutes();
                        router.replace('/main')
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
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
            <spacer></spacer>
        </template>
    </v-layout>
    </v-layout>


</div>`
}

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
    { name: 'home', path: '/main', component: MainComponent, visible: false },
    { name: 'login', path: '/login', component: LoginComponent, visible: true },

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
        myGroups: []
    },
    methods: {
        turnOnRoutes: function() {
            for (var i in routes) {
                if (routes[i].name !== "login")
                    routes[i].visible = true;
                else
                    routes[i].visible = false;
            }
        }
    },
    created: function() {
        if (this.token == "" || this.token == undefined) {
            router.replace('/login')
        }
        else {
            this.turnOnRoutes();
        }

        //Remove this later
        axios.post('/api', {
                query: `
                   {
                    	groups{
                        name
                        
                      }
                    }`
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response);
                let groups = response.data.data.groups;
                this.myGroups = groups
            })
            .catch((error) => {
                console.log(error);
            });

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
