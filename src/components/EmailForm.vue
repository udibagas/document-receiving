<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">SEND EMAIL</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <po-component></po-component>
        <ul class="list">
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
        <p class="error text-center" v-if="error">{{error}}</p>

        <div class="btn-fixed-bottom">
            <v-ons-button class="btn-send" :disabled="busy" @click.prevent="sendMessage">SEND EMAIL</v-ons-button>
        </div>
    </ons-page>
</template>

<script>
import axios from 'axios'
import PoComponent from './PoComponent'

export default {
    components: { PoComponent },
    data: function() {
        return {
            po: {},
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
                po_number: _this.po.PO_NUMBER,
                subject: _this.subject,
                body: _this.body,
                // TODO : sesuaikan ini
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
                    _this.$emit('pop-page')
                    _this.$ons.notification.toast('Sending email SUCCESS!', { timeout: 3000, animation: 'fall' })
                })
                .catch(function(e) {
                    _this.busy = false
                    _this.$ons.notification.toast('Sending email FAILED!', { timeout: 3000, animation: 'fall' })
                })
        }
    }
}
</script>

<style lang="css" scoped>
.btn-send {
    width: 95%;
}
</style>
