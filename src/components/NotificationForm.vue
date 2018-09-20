<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">SEND NOTIFICATION</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <v-ons-card>
            <ul class="list">
                <v-ons-list-header>PO Number</v-ons-list-header>
                <li class="list-item">
                    <div class="list-item__center">
                        {{po.PO_NUMBER}}</strong>
                    </div>
                </li>
                <v-ons-list-header>Item</v-ons-list-header>
                <li class="list-item">
                    <div class="list-item__center">
                        <div class="list-item__title">{{item.SHORT_TEXT}}</div>
                        <span class="list-item__subtitle">
                            {{item.MATERIAL_EXTERNAL}}<br>
                            Qty PO: {{parseInt(item.QUANTITY)}} &bull;
                            Inbound: {{item.QTY_INBOUND}} &bull;
                            GR: {{item.QTY_GR}}
                        </span>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <select class="select-input" v-model="notification.code" style="width:100%">
                            <option v-for="c in codes" :value="c.value" :key="c.value">{{c.value}} - {{c.label}}</option>
                        </select>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <input type="text" v-model="notification.title" class="text-input" placeholder="Title">
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <textarea v-model="notification.description" class="textarea textarea--transparent" rows="10" placeholder="Description"></textarea>
                    </div>
                </li>
            </ul>
            <br>
            <v-ons-button class="btn-send" :disabled="busy" @click.prevent="sendNotification">SEND NOTIFICATION</v-ons-button>
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
            po: {},
            item: {},
            error: '',
            busy: false,
            notification: {
                code: ''
            },
            codes: [
                {value: '', label: 'Select Coding -'},
                {value: 1, label: 'Create Equipment'},
                {value: 2, label: 'Create Serial Number'},
                {value: 3, label: 'Create Material Number'},
                {value: 4, label: 'Create Serial and Material'},
                {value: 5, label: 'Change Equipment'},
                {value: 6, label: 'Change in Serial Number'},
                {value: 7, label: 'Change in Material Number'},
                {value: 8, label: 'Change in Serial and Part Number'},
                {value: 9, label: 'Deactivate Equipment'},
                {value: 10, label: 'Create Customer'},
                {value: 11, label: 'Change Customer'},
                {value: 12, label: 'Create Master Project'},
                {value: 13, label: 'Change Master Project'}
            ]
        }
    },
    methods: {
        sendNotification: function() {
            let _this = this

            if (!_this.notification.code || !_this.notification.title || !_this.notification.description) {
                _this.error = 'Please fill the form correctly!'
                return
            }

            let data = {
                api_token: window.localStorage.api_token,
                po_number: _this.po_number,
                notification: _this.notification
            }

            _this.error = 'Sending notification...'
            _this.busy = true
            axios.post(process.env.ROOT_API + 'notification', data, {timeout: 3000})
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
                                    title: 'NOTIFICATION SENT',
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
