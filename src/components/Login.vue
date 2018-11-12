<template>
    <ons-page>
        <div class="background">
            <img class="logo" src="../assets/bg.jpeg" style="height:100%;width:100%;">
        </div>
        <div class="content">
            <img class="logo" src="../assets/logo-white.png"><br>
            <strong style="font-size:13px;color:#fff;">MATERIAL RECEIVING AND INSPECTION</strong><br>
            <div class="form">
                <p><input type="text" v-model="username" class="my-input" placeholder="Username" /></p>
                <p><input type="password" v-model="password" class="my-input" placeholder="Password" /></p>
                <p><v-ons-button class="full-width" @click.prevent="login">LOGIN</v-ons-button></p>
                <p class="white" v-if="error">{{error}}</p>

                <br><br>
                <small style="color:#fff;">&copy; {{year}} | GMF AeroAsia</small>
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
            busy: false,
            year: moment().format('YYYY')
        }
    },
    methods: {
        login() {
            if (!this.username || !this.password || this.busy) {
                return
            }

            let _this = this
            _this.busy = true
            _this.error = 'Logging in...'

            axios.post(process.env.ROOT_API + 'ldap-login', {
                username: _this.username,
                password: _this.password
            }).then(function(r) {
                _this.busy = false
                if (r.data.status) {
                    window.localStorage.api_token = r.data.api_token
                    window.localStorage.isLoggedIn = 'true'
                    window.localStorage.userId = _this.username
                    _this.$emit('replace-page', Main)
                } else {
                    _this.error = r.data.message
                }
            }).catch(function(e) {
                _this.busy = false
                _this.error = e.response.data.message || e.response.message
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

.white {
    color: #fff;
}

.my-input {
    border-radius: 2px;
    padding: 8px;
    width: 100%;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;
    border: none;
    font-size: 16px;
}
</style>
