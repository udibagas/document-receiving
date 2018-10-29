<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">INSPECTION FORM</div>
            <div class="right">
                <v-ons-toolbar-button>
                    <v-ons-button icon="fa-save" style="border:1px solid #fff;" @click.prevent="submitInspection"> SAVE</v-ons-button>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>
        <div class="background"></div>
        <v-ons-list>
            <v-ons-list-item>
                <div class="center">
                    <small>INSPECTION LOT NUMBER</small>
                    <div class="list-item__title">{{inspection.OPERATION.INSPLOT}}</div>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <small>PLANT</small>
                    <div class="list-item__title">{{inspection.OPERATION.PLANT}}</div>
                </div>
            </v-ons-list-item>
            <v-ons-list-item v-for="(r, i) in inspection.CHAR_REQUIREMENTS.item" tappable>
                <div class="center">
                    <small>{{r.CHAR_DESCR}}</small>
                    <div class="list-item__title" @click="selectCharacteristic(r.MSTR_CHAR)">
                        {{inspection.CHAR_RESULTS.item[i].CHARACTERISTIC.description}}
                    </div>
                    <div class="list-item__subtitle">Status: <span class="danger">Rejected</span></div>
                </div>
                <div class="right">
                    <v-ons-switch v-model="switchOff"> </v-ons-switch>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-dialog :visible="characteristicDialog">
            <v-ons-list>
                <v-ons-list-item v-for="c in selectedCharacteristic.options" @click="setCharacteristic(c)">
                    {{c.description}}
                </v-ons-list-item>
            </v-ons-list>
        </v-ons-dialog>

        <v-ons-modal :visible="busy">
            <p style="text-align: center">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Saving data...
            </p>
        </v-ons-modal>

        <div class="toast" v-show="toast.show">
            <div class="toast__message">{{toast.message}}</div>
            <button class="toast__button" @click="toast.show = false">OK</button>
        </div>
    </v-ons-page>
</template>

<script>
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'
import SuccessPage from './SuccessPage'

export default {
    computed: {
        inspectionCharacteristics() {
            return this.$store.state.inspectionCharacteristics
        }
    },
    data: function() {
        return {
            busy: false,
            formData: {},
            inspection: {},
            toast: { show: false, message: '' },
            switchOff: 0,
            switchOn: 1,
            characteristicDialog: false,
            selectedCharacteristic: {}
        }
    },
    methods: {
        selectCharacteristic: function(mstr_char) {
            this.selectedCharacteristic = this.inspectionCharacteristics.find(c => c.mstr_char === mstr_char)
            this.characteristicDialog = true
        },
        setCharacteristic: function(c) {
            let _this = this
            _this.characteristicDialog = false
            let idx = _this.inspection.CHAR_REQUIREMENTS.item.findIndex(cr => cr.MSTR_CHAR === _this.selectedCharacteristic.mstr_char)
            _this.inspection.CHAR_RESULTS.item[idx].CHARACTERISTIC = c
        },
        submitInspection: function() {
            // TODO: validation
            let _this = this
            let data = {
                api_token: window.localStorage.api_token,
                inspection_number: _this.inspection.OPERATION.INSPLOT
                // charResults: _this.inspection.CHAR_RESULTS
            }

            axios.post(process.env.ROOT_API + 'inspection', data).then(function(r) {
                _this.busy = false
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                // alert(JSON.stringify(jsonData.Envelope.Body["ZFM_IB_DLV_INBOUND.Response"]));

                let ret = jsonData.Envelope.Body["ZFM_IB_DLV_INBOUND.Response"].ET_RETURN

                if (ret.item && ret.item.TYPE === 'E') {
                    _this.toast = { show: true, message: 'ERROR: ' + ret.item.MESSAGE }
                } else {
                    _this.$emit('replace-page', {
                        extends: SuccessPage,
                        data: function() {
                            return {
                                message: 'Inspection created successfully with number xxx'
                            }
                        }
                    })
                }
            }).catch(function(e) {
                _this.toast = { show: true, message: e.response.data }
                _this.busy = false
            })
        }
    },
    mounted: function() {
        // alert(JSON.stringify(this.inspection.CHAR_RESULTS.item))
    }
}
</script>

<style lang="css" scoped>
</style>
