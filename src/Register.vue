<template>
    <ons-page>
        <div class="background"></div>
        <div class="content">
            <div class="form">
                <p><input type="text" v-model="email" class="email-input" placeholder="Enter Your Email Address"></p>
                <p><v-ons-button class="register-btn" @click.prevent="register">REQUEST ACTIVATION</v-ons-button></p>
                <p class="error" v-if="error">{{error}}</p>
            </div>
        </div>

        <div class="alert-dialog-mask" v-show="registerOkDialog"></div>
        <div class="alert-dialog">
            <div class="alert-dialog-container" v-show="registerOkDialog">
                <div class="alert-dialog-title">ACTIVATION REQUEST SENT</div>
                <div class="alert-dialog-content">
                    <p>Please wait Admin confirmation for account activation.</p>
                </div>

                <div class="alert-dialog-footer">
                    <button class="alert-dialog-button alert-dialog-button--primal" @click="registerOkDialog = false; $emit('pop-page')">OK</button>
                </div>
            </div>
        </div>

        <v-ons-modal :visible="busy">
            <p style="text-align: center">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Sending activation request...
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
            error: false,
            busy: false,
            registerOkDialog: false
        }
    },
    methods: {
        register() {
            let _this = this
            _this.busy = true

            axios.post(process.env.ROOT_API + 'register', {
                name: _this.username,
                password: _this.password,
                email: _this.email
            }).then(function(r) {
                _this.busy = false
                _this.error = ''
                _this.registerOkDialog = true
            }).catch(function(e) {
                _this.busy = false
                if (e.response.status === 422) {
                    _this.error = e.response.data.errors.email[0];
                }

                if (e.response.status === 500) {
                    _this.error = e.response.data.message;
                }
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
}

.content {
    text-align: center;
    margin: 100px auto 0;
}

.form {
    margin: 100px auto 10px;
    width: 300px;
}

.email-input {
    width: 100%;
    font-size: 20px;
    background-color: #eee;
    text-align: center;
    border: none;
    border-radius: 2px;
    height: 50px;
    line-height: 50px;
}

.register-btn {
    width: 100%;
}
</style>
