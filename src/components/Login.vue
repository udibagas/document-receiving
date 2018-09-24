<template>
    <ons-page>
        <div class="background"></div>
        <div class="content">
            <img class="logo" src="../assets/logo.png"><br>
            <strong style="color:#396080;">MATERIAL HANDLING</strong><br>
            <div class="form">
                <p><v-ons-input v-model="username" placeholder="Username" class="full-width"></v-ons-input></p>
                <p> <v-ons-input type="password" v-model="password" placeholder="Password" class="full-width"></v-ons-input> </p>
                <p><v-ons-button class="full-width" @click.prevent="login">LOGIN</v-ons-button></p>
                <p class="error" v-if="error">{{error}}</p>

                <br><br>
                <small>&copy; {{year}} | GMF AeroAsia</small>
            </div>
        </div>
    </ons-page>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Main from './Main'

export default {
    data: function() {
        return {
            username: '',
            password: '',
            error: false,
            year: moment().format('YYYY')
        }
    },
    methods: {
        login() {
            if (!this.username || !this.password) {
                return
            }

            // if (navigator.connection.type !== Connection.WIFI) {
            //     this.error = 'Check your WiFi connection!'
            //     return
            // }

            let _this = this
            _this.error = 'Logging in...'

            axios.post(process.env.ROOT_API + 'login', {
                username: _this.username,
                password: _this.password
            }).then(function(r) {
                if (r.data.success) {
                    window.localStorage.isLoggedIn = 'true'
                    window.localStorage.api_token = r.data.user.api_token
                    _this.$emit('replace-page', Main)
                } else {
                    _this.error = r.data.message
                }
            }).catch(function(e) {
                if (e.response) {
                    if (e.response.status === 500) {
                        _this.error = e.response.data.message
                    }

                    if (e.response.status === 404) {
                        _this.error = 'Page not found!'
                    }
                } else {
                    _this.error = 'Failed to connect to server! ' + process.env.ROOT_API
                    console.log(e);
                }
            })
        }
    }
}
</script>

<style scoped>
.content {
    text-align: center;
    margin: 50px auto 0;
}

.form {
    margin: 100px auto 10px;
    width: 250px;
}

.full-width {
    width: 100%;
}
</style>
