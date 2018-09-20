<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">SEND EMAIL</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <v-ons-card>
            <ul class="list">
                <li class="list-item">
                    <div class="list-item__center">
                        <v-ons-row>
                            <v-ons-col>PO NUMBER</v-ons-col>
                            <v-ons-col>: <strong>{{po_number}}</strong></v-ons-col>
                        </v-ons-row>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <input type="text" v-model="subject" class="text-input" placeholder="Subject">
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <textarea v-model="body" class="textarea textarea--transparent" rows="10" placeholder="Message"></textarea>
                    </div>
                </li>
            </ul>
            <br>
            <v-ons-button class="btn-send" :disabled="busy" @click.prevent="sendMessage">SEND EMAIL</v-ons-button>
            <p class="error" v-if="error">{{error}}</p>
        </v-ons-card>
    </ons-page>
</template>

<script>
import axios from 'axios'
import Main from './Main'

export default {
    data: function() {
        return {
            po_number: '',
            subject: '',
            body: '',
            to: '',
            error: '',
            busy: false
        }
    },
    methods: {
        sendMessage: function() {
            let _this = this

            if (!_this.subject || !_this.body) {
                _this.error = 'Please fill the form correctly!'
                return
            }

            let data = {
                api_token: window.localStorage.api_token,
                po_number: _this.po_number,
                subject: _this.subject,
                body: _this.body,
                to: 'bagas@lamsolusi.com'
            }

            _this.error = 'Sending message...'
            _this.busy = true
            axios.post(process.env.ROOT_API + 'message', data)
                .then(function(r) {
                    _this.busy = false
                    if (!r.data.success) {
                        _this.error = r.data.message
                        return
                    }
                    _this.error = ''
                    _this.$emit('replace-page', {
                        extends: Main,
                        data: function() {
                            return {
                                alert: {
                                    show: true,
                                    title: 'EMAIL SENT',
                                    message: r.data.message
                                }
                            }
                        }
                    })
                })
                .catch(function(e) {
                    _this.busy = false
                    if (e.response) {
                        if (e.response.status === 500) {
                            _this.error = 'Internal server error! ' + e.response.data.message
                        }

                        if (e.response.status === 404) {
                            _this.error = 'Page not found!'
                        }
                    } else {
                        _this.error = 'Failed to connect to server!'
                    }
                })
        }
    }
}
</script>

<style lang="css" scoped>
.background {
    background-color: #eee;
}

.btn-send {
    display: block;
    width: 100%;
    margin-bottom: 5px;
    border-radius: 20px;
}

.error {
    color: red;
    text-align: center;
}
</style>
