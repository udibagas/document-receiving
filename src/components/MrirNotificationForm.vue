<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">CREATE MRIR NOTIFICATION</div>
            <div class="right">
                <v-ons-toolbar-button>
                    <v-ons-button icon="fa-send" :disabled="busy" style="border:1px solid #fff;" @click.prevent="sendMrirNotification"> SEND</v-ons-button>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>
        <div class="background"></div>
        <div>
            <ul class="list">
                <li class="list-item">
                    <div class="list-item__center">
                        {{po.E_POHEADER.PO_NUMBER}}
                    </div>
                    <div class="list-item__right">
                        <div class="list-item__label">PO Number</div>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        {{item.PO_ITEM}}
                    </div>
                    <div class="list-item__right">
                        <div class="list-item__label">PO Item</div>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        {{item.MATERIAL_EXTERNAL}}
                    </div>
                    <div class="list-item__right">
                        <div class="list-item__label">Material</div>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <input type="text" v-model="short_text" class="text-input" placeholder="Short Text">
                    </div>
                    <div class="list-item__right">
                        <div class="list-item__label">Short Text</div>
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
                        <input type="text" v-model="qty_compliant" class="text-input" placeholder="Main Work Center">
                    </div>
                    <div class="list-item__right">
                        <div class="list-item__label">Quantity Compliant</div>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <input type="text" v-model="qty_unit" class="text-input" placeholder="Main Work Center">
                    </div>
                    <div class="list-item__right">
                        <div class="list-item__label">Quantity Unit</div>
                    </div>
                </li>
                <li class="list-item">
                    <div class="list-item__center">
                        <textarea v-model="description" class="textarea textarea--transparent" rows="18" placeholder="Detail Description" style="width:100%"></textarea>
                    </div>
                </li>
            </ul>
        </div>

        <div class="toast" v-show="error">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = false">OK</button>
        </div>

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

export default {
    components: { PoHeader },
    computed: {
        po() { return this.$store.state.po }
    },
    data: function() {
        return {
            item: {},
            error: '',
            busy: false
        }
    },
    methods: {
        sendMrirNotification: function() {
            let _this = this

            if (!_this.description || !_this.short_text || !_this.device_data) {
                _this.error = 'Please fill the form correctly!'
                return
            }

            _this.error = ''
            _this.busy = true

            let data = {
                api_token: window.localStorage.api_token,
                po_number: _this.po.E_POHEADER.PO_NUMBER,
                to: _this.po.E_USER_EMAIL,
                description: _this.description,
                short_text: _this.short_text,
                device_data: _this.device_data,
                qty_compliant: _this.qty_compliant,
                qty_unit: _this.qty_unit,
                material: _this.item.MATERIAL_EXTERNAL
            }

            axios.post(process.env.ROOT_API + 'mrirNotification', data).then(function(r) {
                _this.busy = false
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                let ret = jsonData.Envelope.Body["ZFM_QM_NOTIF_INBOUND.Response"].ET_RETURN

                if (ret.item && ret.item.TYPE === 'E') {
                    _this.error = 'ERROR: ' + ret.item.MESSAGE
                } else {
                    _this.error = 'SUCCESS: MRIR Notification sent. Notif No. ' + jsonData.Envelope.Body["ZFM_QM_NOTIF_INBOUND.Response"].E_HEADER.NOTIF_NO
                    setTimeout(function () { _this.$emit('pop-page') }, 3000);
                }
            }).catch(function(e) {
                _this.busy = false
                _this.error = 'FAIL to send notification! ' + e.response.data
            })
        }
    }
}
</script>

<style lang="css" scoped>

</style>
