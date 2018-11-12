<template>
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">REGISTER</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <div class="content">
            <div class="form">
                <p><input disabled type="text" v-model="username" class="my-input" placeholder="Username" /></p>
                <p><input type="text" v-model="email" class="my-input" placeholder="Email" /></p>
                <p><input disabled type="password" v-model="password" class="my-input" placeholder="Password" /></p>
                <p><input type="password" v-model="confirm_password" class="my-input" placeholder="Confirm Password" /></p>
                <p><v-ons-button class="full-width" @click.prevent="register">REGISTER</v-ons-button></p>
                <p class="white" v-if="error">{{error}}</p>
            </div>
        </div>

        <div class="alert-dialog-mask" v-show="registerOkDialog"></div>
        <div class="alert-dialog">
            <div class="alert-dialog-container" v-show="registerOkDialog">
                <div class="alert-dialog-title">REGISTRATION SUCCEED</div>
                <div class="alert-dialog-content">
                    <p>Registration succeed. Please wait Admin confirmation for account activation.</p>
                </div>

                <div class="alert-dialog-footer">
                    <button class="alert-dialog-button alert-dialog-button--primal" @click="registerOkDialog = false; $emit('pop-page')">OK</button>
                </div>
            </div>
        </div>

        <div class="toast" v-show="error">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = ''">OK</button>
        </div>

        <v-ons-modal :visible="busy">
            <p style="text-align: center">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Registering...
            </p>
        </v-ons-modal>
    </ons-page>
</template>

<script>
import axios from 'axios'

export default {
    data: function() {
        return {
            username: '',
            password: '',
            email: '',
            confirm_password: '',
            error: false,
            busy: false
        }
    },
    methods: {
        register() {
            if (!this.email) {
                this.error = 'Email address is required!'
                return
            }

            if (this.password !== this.confirm_password) {
                this.error = 'Password doesn\'t match!'
                return
            }

            let _this = this
            _this.busy = true

            axios.post(process.env.ROOT_API + 'register', {
                username: _this.username,
                password: _this.password,
                email: _this.email
            }).then(function(r) {
                _this.busy = false
                if (r.data.status) {
                    _this.registerOkDialog = true
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
