<template>
    <ons-page>
        <div class="background"></div>
        <div class="content">
            <img src="../assets/logo.png"><br>
            <strong>DOCUMENT RECEIVING</strong><br>
            <div class="form">
                <p> <v-ons-input v-model="username" placeholder="Username" class="full-width"></v-ons-input> </p>
                <p> <v-ons-input type="password" v-model="password" placeholder="Password" class="full-width"></v-ons-input> </p>
                <p><v-ons-button class="login-btn" @click.prevent="login">LOGIN</v-ons-button></p>
                <p class="error" v-if="error">{{error}}</p>

                <br><br>
                <small>&copy; 2018 | GMF AeroAsia</small>
            </div>
        </div>
    </ons-page>
</template>

<script>
import axios from 'axios'
import Main from './Main'

export default {
    data: function() {
        return {
            api_url: 'http://192.168.160.131:8000/api/',
            username: '',
            password: '',
            error: false
        }
    },
    methods: {
        login() {
            if (!this.username || !this.password) {
                return
            }

            if (navigator.connection.type !== Connection.WIFI) {
                this.error = 'Please check your WiFi connection!'
                return
            }

            let _this = this
            _this.error = 'Logging in...'

            axios.post(_this.api_url + 'login', {
                username: _this.username,
                password: _this.password
            }).then(function(r) {
                if (r.data.success) {
                    _this.$emit('replace-page', {
                        extends: Main,
                        data: function() {
                            return {
                                user: r.data.user
                            }
                        }
                    })
                } else {
                    _this.error = r.data.message
                }
            }).catch(function(e) {
                if (e.response) {
                    if (e.response.status === 500) {
                        _this.error = e.response.data.message
                    }

                    if (e.response.status === 404) {
                        _this.error = 'Page not found'
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.background {
    background-color: #fff;
}

.content {
    text-align:center;
    margin: 50px auto 0;
}

img {
    width: 200px;
    margin: 10px auto;
}

.error {
    color: red;
}

.form {
    margin: 100px auto 10px;
    width: 250px;
}

.login-btn {
    font-size: 20px;
    height: 30px;
    font-weight: lighter;
    border-radius: 20px;
    width: 100%;
}

.full-width {
    width: 100%;
}
</style>
