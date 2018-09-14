<template>
    <ons-page>
        <div class="background"></div>
        <div class="content">
            <img src="../assets/logo.png">
            <div class="form">
                <p> <v-ons-input v-model="email" placeholder="Username"></v-ons-input> </p>
                <p> <v-ons-input type="password" v-model="password" placeholder="Password"></v-ons-input> </p>
                <p class="error" v-if="error">{{error}}</p>
                <p><v-ons-button :disabled="is_ready" class="login-btn" @click.prevent="login">LOGIN</v-ons-button></p>
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
            email: '',
            password: '',
            error: false,
            is_ready: false
        }
    },
    methods: {
        login() {
            if (!this.email || !this.password) {
                this.error = 'Please enter username & password!'
                return
            }

            if (navigator.connection.type !== Connection.WIFI) {
                this.error = 'Please check your WiFi connection!'
                return
            }

            let _this = this
            axios.post(api_url + '/login', {
                email: _this.email,
                password: _this.password
            }).then(function(r) {
                _this.$emit('replace-page', {
                    extends: Main,
                    data: function() {
                        return {
                            user: r.data
                        }
                    }
                })
            }).catch(function(e) {
                if (e.response) {
                    if (e.response.status === 500) {
                        this.error = e.response.data.message
                    }
                    if (e.response.status === 404) {
                        this.error = 'Page not found'
                    }
                }

                console.log(e);
            })
        }
    },
    mounted: function() {
        let _this = this
        this.$ons.ready(function() {
            _this.is_ready = true;
        })
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
    width: 200px;
}

.login-btn {
    font-size: 20px;
    height: 30px;
    font-weight: lighter;
    border-radius: 20px;
    width: 100%;
}
</style>
