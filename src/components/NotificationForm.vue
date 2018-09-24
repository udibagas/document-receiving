<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">SEND NOTIFICATION</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <po-component></po-component>
        <div>
            <ul class="list">
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
                        <textarea v-model="notification.description" class="textarea textarea--transparent" rows="5" placeholder="Description"></textarea>
                    </div>
                </li>
            </ul>
            <p class="error text-center" v-if="error">{{error}}</p>
        </div>

        <div class="btn-fixed-bottom">
            <v-ons-button style="width:95%" :disabled="busy" @click.prevent="sendNotification">SEND NOTIFICATION</v-ons-button>
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
            // TODO: benerin URL nembak ke SAP
            axios.post(process.env.ROOT_API + 'notification', data, {timeout: 3000})
                .then(function(r) {
                    _this.busy = false
                    _this.$emit('pop-page')
                    _this.$ons.notification.toast('Notification creation SUCCESS!', { timeout: 3000, animation: 'fall' })
                    this.sendLog(1)
                })
                .catch(function(e) {
                    _this.$ons.notification.toast('Notification creation FAILED!', { timeout: 3000, animation: 'fall' })
                    this.sendLog(0)
                })
        },
        sendLog: function(status) {
            let _this = this
            let data = {
                po_number: _this.po.PO_NUMBER,
                message: 'User :user creates notification for PO #' + _this.po.PO_NUMBER + ' material item #' + _this.item.PO_ITEM + '(' + _this.item.SHORT_TEXT + ') : ' + JSON.stringify(_this.notification),
                action: 'Create Notification',
                status: status
            }

            axios.post(BASE_URL + 'userLog', data).then(function(r) {
                _this.$ons.notification.toast('Log has been saved!', { timeout: 3000, animation: 'fall' })
            }).catch(function(e) {
                _this.$ons.notification.toast('Failed to save log!', { timeout: 3000, animation: 'fall' })
            })
        }
    }
}
</script>

<style lang="css" scoped>
small {
    color: #999;
}
</style>
