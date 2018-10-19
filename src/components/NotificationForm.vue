<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">CREATE NOTIFICATION</div>
            <div class="right">
                <v-ons-toolbar-button>
                    <v-ons-button icon="fa-send" :disabled="busy" style="border:1px solid #fff;" @click.prevent="sendNotification"> SEND</v-ons-button>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>
        <div class="background"></div>
        <div>
            <ul class="list">
                <li class="list-item">
                    <div class="list-item__center">
                        <input type="text" @click.prevent="problemDialog = true" readonly v-model="notification.problem" class="text-input" placeholder="Problem">
                    </div>
                    <div class="list-item__right">
                        <div class="list-item__label">Problem</div>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <input type="text" v-model="notification.purchaser_name" class="text-input" placeholder="Purchaser Name">
                    </div>
                    <div class="list-item__right">
                        <div class="list-item__label">Purchaser Name</div>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <input type="text" v-model="notification.device_data" class="text-input" placeholder="Device Data">
                    </div>
                    <div class="list-item__right">
                        <div class="list-item__label">Device Data</div>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <input type="text" v-model="notification.main_work_center" class="text-input" placeholder="Main Work Center">
                    </div>
                    <div class="list-item__right">
                        <div class="list-item__label">Main Work Center</div>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <textarea v-model="notification.description" class="textarea textarea--transparent" rows="18" placeholder="Detail Description" style="width:100%"></textarea>
                    </div>
                </li>
            </ul>
        </div>

        <div class="toast" v-show="error">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = false">OK</button>
        </div>

        <v-ons-dialog :visible.sync="problemDialog">
            <v-ons-list>
                <v-ons-list-item v-for="(p, $index) in problems" tappable :key="p">
                    <label class="left">
                        <v-ons-radio :input-id="'radio-' + $index" :value="p" v-model="notification.problem"> </v-ons-radio>
                    </label>
                    <label :for="'radio-' + $index" class="center">{{ p }}</label>
                </v-ons-list-item>
            </v-ons-list>
        </v-ons-dialog>

        <v-ons-modal :visible="busy">
            <p style="text-align: center">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Sending notification...
            </p>
        </v-ons-modal>
    </ons-page>
</template>

<script>
import axios from 'axios'
import PoHeader from './PoHeader'

export default {
    components: { PoHeader },
    watch: {
        'notification.problem': function(v, o) {
            this.problemDialog = false
        }
    },
    data: function() {
        return {
            po: {},
            item: {},
            error: '',
            busy: false,
            notification: {
                problem: '',
                // TODO: isi ini dengan PO dan atau material
                description: ''
            },
            problemDialog: false,
            problems: [
                'CREATE SN',
                'RELEASE PO',
                'DIFF PIN',
                'INSERT QTY',
                'CHANGE SN STATUS',
                'INSERT PN',
                'PO NOT EXIST',
                'OTHER'
            ]
        }
    },
    methods: {
        sendNotification: function() {
            let _this = this

            if (!_this.notification.problem ||
                !_this.notification.purchaser_name ||
                !_this.notification.device_data ||
                !_this.notification.main_work_center ||
                !_this.notification.description) {
                _this.error = 'Please fill the form correctly!'
                return
            }

            let data = {
                api_token: window.localStorage.api_token,
                po_number: _this.po.PO_NUMBER,
                notification: _this.notification
            }

            _this.error = ''
            _this.busy = true

            axios.post(process.env.ROOT_API + 'notification', data, {timeout: 3000}).then(function(r) {
                _this.busy = false
                _this.$ons.notification.toast(r.data.message, { timeout: 3000, animation: 'fall' })
                if (r.data.success) {
                    _this.$emit('pop-page')
                }
            }).catch(function(e) {
                _this.busy = false
                if (e.response.status === 500) {
                    _this.error = 'FAIL to send notification! ' + e.response.data.message
                } else {
                    _this.error = 'FAIL to send notification! Unhandled error.'
                }
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
