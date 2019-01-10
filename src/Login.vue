<template>
    <ons-page>
        <div class="background"></div>
        <div class="content">
            <img style="width:65%;margin:10px auto;" src="./assets/img/logo-white.png"><br>
            <span style="font-size:24px;color:#fff;">MATERIAL RECEIVING <br>AND INSPECTION</span><br>
            <div class="form">
                <p><input type="text" v-model="username" class="my-input" placeholder="Username" /></p>
                <p><input type="password" v-model="password" class="my-input" placeholder="Password" /></p>
                <p><v-ons-button @click.prevent="login" class="login-btn">SUBMIT</v-ons-button></p>
            </div>
        </div>

        <div class="toast" v-show="error" style="position:fixed;bottom:5px;">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = ''">OK</button>
        </div>
    </ons-page>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Main from './Main'
import Register from './Register'

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

            axios.post(process.env.ROOT_API + 'login', {
                username: _this.username,
                password: _this.password
            }).then(function(r) {
                _this.busy = false
                _this.error = ''
                if (r.data.success) {
                    if (r.data.registered) {
                        if (r.data.active) {
                            window.localStorage.api_token = r.data.api_token
                            window.localStorage.isLoggedIn = 'true'
                            window.localStorage.userId = _this.username
                            _this.$emit('replace-page', Main)
                        } else {
                            _this.error = r.data.message
                        }
                    } else {
                        _this.$emit('push-page', {
                            extends: Register,
                            data: function() {
                                return {
                                    username: _this.username,
                                    password: _this.password
                                }
                            }
                        })
                    }
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
.background {
    background-color:#3355aa;
    background-image: url('./assets/img/ID7.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-blend-mode: color-dodge;
}

.content {
    text-align: center;
    margin: 50px auto 0;
}

.form {
    margin: 150px auto 0;
    padding: 20px;
}

.my-input {
    padding-left: 20px;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: none;
    font-size: 16px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    /* font-weight: bold; */
    border-radius: 15px;
    height:50px;
    line-height:50px;
}

.login-btn {
    background-color:#3acce1;
    height:50px;
    line-height:50px;
    font-size:16px;
    width: 100%;
    font-weight: bold;
    border-radius: 15px;
}

::-webkit-input-placeholder {
   color: #ddd;
}

:-moz-placeholder {
   color: #ddd;
}

::-moz-placeholder {
   color: #ddd;
}

:-ms-input-placeholder {
   color: #ddd;
}
</style>
