<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">CREATE NOTIFICATION</div>
            <!-- <div class="right">
                <v-ons-toolbar-button>
                    <v-ons-button icon="fa-send" :disabled="busy" style="border:1px solid #fff;" @click.prevent="sendNotification"> SEND</v-ons-button>
                </v-ons-toolbar-button>
            </div> -->
        </v-ons-toolbar>
        <div class="background"></div>
        <ul class="list" style="margin-bottom:45px">
            <li class="list-item" tappable>
                <div class="list-item__center" @click.prevent="problemDialog = true">
                    <div class="list-item__title">
                        <i class="fa fa-edit"></i> {{problem.description}}
                    </div>
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Problem</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="purchaser_name" class="text-input" placeholder="Purchaser Name">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Purchaser Name</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="device_data" class="text-input" placeholder="Device Data">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Device Data</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <textarea v-model="description" class="textarea textarea--transparent" rows="20" placeholder="Detail Description" style="width:100%"></textarea>
                </div>
            </li>
        </ul>

        <div class="btn-fixed-bottom">
            <v-ons-button style="width:95%" :disabled="busy" @click.prevent="sendNotification"> SEND NOTIFICATION</v-ons-button>
        </div>

        <div class="toast" v-show="error">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = false">OK</button>
        </div>

        <v-ons-dialog :visible.sync="problemDialog">
            <v-ons-list>
                <v-ons-list-item v-for="(p, i) in problems" tappable :key="i" @click="problem = p; problemDialog = false">
                    <div class="center">{{p.description}}</div>
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
import fastXmlParser from 'fast-xml-parser'
import SuccessPage from './SuccessPage'

export default {
    components: { PoHeader },
    data: function() {
        return {
            error: '',
            busy: false,
            purchaser_name: '',
            device_data: '',
            description: '',
            problemDialog: false,
            problem: { notifType: '', description: '[SELECT PROBLEM]' },
            problems: [
                { notifType: 'W2', description: 'SN NOT EXISTS' },
                { notifType: 'G3', description: 'RELEASE PO' },
                { notifType: 'G3', description: 'DIFF PIN' },
                { notifType: 'G3', description: 'INSERT QTY' },
                { notifType: 'W2', description: 'CHANGE SN STATUS' },
                { notifType: 'G3', description: 'INSERT PN' },
                { notifType: 'G3', description: 'PO NOT EXIST' },
                { notifType: 'G3', description: 'OTHER' }
            ]
        }
    },
    methods: {
        sendNotification: function() {
            let _this = this

            if (!_this.problem.notifType) {
                _this.error = 'Problem field is required!'
                return
            }

            if (!_this.purchaser_name) {
                _this.error = 'Purchaser Name field is required!'
                return
            }

            if (!_this.device_data) {
                _this.error = 'Device Data field is required!'
                return
            }

            if (!_this.description) {
                _this.error = 'Description field is required!'
                return
            }

            let data = {
                api_token: window.localStorage.api_token,
                problem: _this.problem,
                purchaser_name: _this.purchaser_name,
                device_data: _this.device_data,
                description: _this.description
            }

            _this.error = ''
            _this.busy = true

            axios.post(process.env.ROOT_API + 'notification', data).then(function(r) {
                _this.busy = false
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                let ret = jsonData.Envelope.Body["ZFM_NOTIFICATION_INBOUND.Response"].T_RETURN

                if (ret.item && ret.item.TYPE === 'E') {
                    _this.error = 'ERROR: ' + ret.item.MESSAGE
                } else {
                    _this.$emit('replace-page', {
                        extends: SuccessPage,
                        data: function() {
                            return {
                                message: 'Notification created successfully with number ' + jsonData.Envelope.Body["ZFM_NOTIFICATION_INBOUND.Response"].E_NOTIFHEADER.NOTIF_NO
                            }
                        }
                    })
                }
            }).catch(function(e) {
                _this.busy = false
                if (e.response.status === 500) {
                    _this.error = 'FAIL to send notification! ' + e.response.data
                } else {
                    _this.error = 'FAIL to send notification! Unhandled error.'
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>

</style>
