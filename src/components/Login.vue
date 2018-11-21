<template>
    <ons-page>
        <div class="background"></div>
        <div class="content">
            <img style="width:80%;margin:10px auto;" src="../assets/logo-white.png"><br>
            <span style="font-size:18px;color:#fff;">MATERIAL RECEIVING AND INSPECTION<br>MOBILE APP</span><br>
            <div class="form">
                <p><input type="text" v-model="username" class="my-input" placeholder="Enter Your Username" /></p>
                <p><input type="password" v-model="password" class="my-input" placeholder="Enter Your Password" /></p>
                <p><v-ons-button @click.prevent="login" class="login-btn">SUBMIT</v-ons-button></p>
                <p class="white" v-if="error">{{error}}</p>
            </div>
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
    /* background-image: url('../assets/bg_login_cropped.jpg'); */
    background-image: url('http://13.76.153.42/material-receiving-and-inspection-dev/images/bg_login_cropped.jpg');
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
    margin: 60px auto 10px;
}

.white {
    color: #fff;
}

/* .my-input {
    border-radius: 2px;
    padding: 8px;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: none;
    font-size: 16px;
} */

.login-btn {
    width: 60%;
    background-color:#55c284;
    height:50px;
    line-height:50px;
    font-size:20px;
}

.my-input {
    height: 50px;
    line-height: 50px;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: none;
    font-size: 20px;
    background-color: #396080;
    opacity: 0.8;
    background-blend-mode: darken;
    border-top: 1px solid #555;
    border-bottom: 1px solid #555;
    text-align: center;
    color: #ddd;
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
