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
                <div v-else>
                <h5> You are currently in no groups </h5>

                </div>
              </div>
            </v-card-title>
            <v-card-actions>
            
                <router-link to="/createGroup">
                   <v-btn flat color="orange">
                        Create a group
                    </v-btn>
                </router-link>
                <router-link to="/findGroup">
                  <v-btn flat color="orange">Explore</v-btn>
                </router-link>
            </v-card-actions>
          </v-card>
    </v-flex>
    </template>
    </div>
`,
    created: function() {
        app.loadMyGroups();
    }
})

Vue.component('group-card', {
    props: ['group'],
    template: `
          <v-card flat tile>
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
              aspect-ratio="2.75"
            ></v-img>
    
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{group.name}}</h3>
                <div>{{group.description}}</div>
              </div>
            </v-card-title>

            <v-divider light></v-divider>
    
            <v-card-actions>
                <router-link v-bind:to="path">
                    <v-btn flat color="orange">Find out more</v-btn>
                </router-link>
            </v-card-actions>
          </v-card>
    `,
    computed: {
        path: function() {
            return '/groups/' + this.group.id;
        }
    }
})



// These can be imported from other files
const FindSessionComponent = { template: `<h1>Find session component</h1>` }
const FindGroupComponent = {
    template: `
    <div>
        <h1>Find a group</h1>
        <v-layout>
    <v-flex xs12 sm6 offset-sm3>
        <v-container  v-bind="md" fluid>
            <v-layout row wrap>
            <v-flex
             v-for="group in groups"
             xs4
            >
                <group-card :group="group"></group-card>
            <v-flex>
            <v-layout>
        </v-container>
        <v-flex>
    <v-layout>
       
    </div>
    `,
    data: function() {
        return {
            groups: [],
            page: 1
        }
    },
    methods: {
        getGroups: async function() {
            try {
                let data = await sendRequest(`{groups(page: ${this.page}){id,name, description}}`, "groups");
                console.log(data);
                this.groups = data.groups;
            }
            catch (err) {
                app.error = true;
                throw err;
            }
        }
    },
    created: function() {
        this.getGroups();
    }

}
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

                let tk = data.login.token
                if (tk != undefined || tk != "") {
                    app.token = tk;
                    app.turnOnRoutes();
                    router.replace('/main')
                }
            }
            catch (err) {
                this.loading = false;
                app.error = true;
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
const IndividualGroup = {
    template: `<div>
        <h1>Individual group component</h1>
    </div>`,
    date: function() {
        return {
            group: {}
        }
    },
    methods: {
        getGroup: async function() {
            let data = await sendRequest(`{findGroup(id:"${this.$route.params.id}"){creator,name,description,id,isPrivate,creationDate}}`, "group")
            console.log(data);
        }
    }
}
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
        <v-switch v-model="allowOfflineUse"  v-on:change="setOfflineUsage" v-if="!isOffline">
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
        },
        isOffline: () => {
            return app.isOffline;
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
            let data = await sendRequest(`{myProfile{local{id,username,email}}}`, "profile")
            this.user = data.myProfile
        }
    },
    created: function() {
        this.getUserData();
    }

}
const CreateGroup = {
    template: `
    <div>
    <div class="text-xs-center" v-if="loading">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
        </div>
      <v-form v-else>
        <v-container fluid>
          <v-layout>
            <v-flex
              xs12
              md4
            >
            
            <v-flex xs12 sm6>
              <v-text-field
                v-model="name"
                :rules="[rules.required, rules.counter]"
                label="Name"
                hint="This is your groups name be creative!"
                counter
                maxlength="20"
              ></v-text-field>
            </v-flex>
    
          <v-flex xs6>
            <v-textarea
              name="description"
              :rules="[rules.required]"
              label="Description"
              v-model="description"
              hint="Write a short description of what your group is about"
            ></v-textarea>
            </v-flex>
    
            
            <v-checkbox v-model="isPrivate">
                <div slot="label">
                    Is your group private?
                </div>
            </v-checkbox>
            
            <v-btn v-on:click='createGroup' primary large block>Submit</v-btn>

            </v-flex>
          </v-layout>
        </v-container>
      </v-form>
    </div>
`,
    data: function() {
        return {
            loading: false,
            name: "",
            description: "",
            isPrivate: false,
            rules: {
                required: value => !!value || 'Required.',
                counter: value => value.length <= 20 || 'Max 20 characters'
            }
        }
    },

    methods: {
        createGroup: async function() {
            try {
                this.loading = true;
                // console.log(this.email)
                // console.log(this.password)
                // login(email: String!, password: String!): AuthData!
                let data = await sendRequest(`mutation{createGroup(groupInput:{isPrivate:${this.isPrivate},name:"${this.name}",description:"${this.description}"}){name,description,creationDate,creator{local{username}}}}`);


                console.log(data);
                //Change this so that it redirects to the actual group 
                router.replace('/findGroup');
            }
            catch (err) {
                this.loading = false;
                app.error = true;
                console.error(err);
            }
        }
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
    { name: 'group', path: '/groups/:id', component: IndividualGroup, visible: false, fixed: true },
    { name: 'user', path: '/user/:id', component: IndividualUser, visible: false, fixed: true },
    { name: 'notes', path: '/notes', component: NotesMenuComponent, visible: false, offline: true },
    { name: 'note', path: '/notes/:id', component: IndividualNote, visible: false, fixed: true },
    { name: 'find Group', path: '/findGroup', component: FindGroupComponent, visible: false },
    { name: 'find Session', path: '/session', component: FindSessionComponent, visible: false },
    { name: 'profile', path: '/profile', component: UserProfile, visible: false, offline: true },
    { name: 'create a group', path: '/createGroup', component: CreateGroup, visible: false, offline: false, fixed: true }
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
        isOffline: false,
        success: false,
        info: false,
        error: false,
        warning: false
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
        },
        loadMyGroups: async function() {
            let data = await sendRequest(`{myGroups{id,name,description}}`, "myGroups");
            this.myGroups = data.myGroups;
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
    else {
        app.turnOffRoutes();
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

const getOffline = async(dataType) => {
    let dataString = window.localStorage.getItem(dataType);
    let data = JSON.parse(dataString);
    return data;
}

const sendRequest = async(query, dataType) => {
    try {
        if (app.isOffline) {
            console.warn("Currently offline so will not send any changes");
            let data = await getOffline(dataType);
            return data;
        }
        if (app.token == "" && app.$route.path != '/login') {
            console.warn("Not logged in")
            return;
        }
        // console.log("-----------------This is the query-------------------")
        // console.log("-----------------------------------------------------")
        // console.log(query)
        //Remove this later
        let response = await axios.post('/api', { query }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'StudyMaps ' + app.token
            }
        });


        let data = response.data.data;
        if (app.allowOfflineUse) {
            SaveDataOffline(data, dataType);
        }

        return data;

    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

const SaveDataOffline = async function(data, dataType) {
    //Not allowed to use offline therefor no point saving data for offline use
    if (!app.allowOfflineUse)
        return;

    switch (dataType) {
        default:
            // code block
            window.localStorage.setItem(dataType, JSON.stringify(data));
        console.warn("Data saved using default method because data type not found")
        break;
    }

}
