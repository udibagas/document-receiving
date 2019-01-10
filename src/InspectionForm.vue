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
                    <div class="list-item__title">{{inspection.ET_OPERATION.item.INSPLOT}}</div>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <small>BATCH NUMBER</small>
                    <div class="list-item__title">{{batch_number}}</div>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <small>PLANT</small>
                    <div class="list-item__title">{{inspection.ET_OPERATION.item.PLANT}}</div>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <small>TEXT OPERATION</small>
                    <div class="list-item__title">{{inspection.ET_OPERATION.item.TXT_OPER}}</div>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <small>WORK CENTER</small>
                    <div class="list-item__title">{{inspection.ET_OPERATION.item.WORKCENTER || '-'}}</div>
                </div>
            </v-ons-list-item>
            <v-ons-list-item v-for="(r, i) in inspection.ET_CHAR_REQUIREMENTS.item" tappable :key="r.INSPCHAR">
                <div class="center">
                    <small>{{r.CHAR_DESCR}}</small>
                    <div class="list-item__title" @click="selectCharacteristic(r.MSTR_CHAR)" v-if="r.MSTR_CHAR !== '50000018'">
                        <i class="fa fa-edit"></i>
                        <span :class="inspection.ET_CHAR_RESULTS.item[i].CHARACTERISTIC.code === '' ? 'danger' : ''">
                            {{inspection.ET_CHAR_RESULTS.item[i].CHARACTERISTIC.description}}
                        </span>
                    </div>
                    <div class="list-item__title" v-if="r.MSTR_CHAR === '50000018'">
                        <datetime v-model="inspection.ET_CHAR_RESULTS.item[i].ORIGINAL_INPUT" placeholder="Best Before Date" format="dd/MM/yyyy" zone="Asia/Jakarta" value-zone="Asia/Jakarta"></datetime>

                        <!-- <v-ons-input type="date" style="width:150px;" v-model="inspection.ET_CHAR_RESULTS.item[i].ORIGINAL_INPUT" placeholder="Best Before Date"></v-ons-input> -->
                    </div>
                    <div class="list-item__subtitle">
                        Status:
                        <span :class="evaluation[r.INSPCHAR] ? 'success' : 'danger'">
                            {{evaluation[r.INSPCHAR] ? 'Approved' : 'Rejected'}}
                        </span>
                    </div>
                </div>
                <div class="right">
                    <v-ons-switch v-model="evaluation[r.INSPCHAR]"> </v-ons-switch>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-dialog :visible="characteristicDialog">
            <v-ons-list>
                <v-ons-list-item v-for="c in selectedCharacteristic.options" :key="c.code" @click="setCharacteristic(c)">
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

        <div class="toast" v-show="error" style="position:fixed;bottom:5px;">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = false">OK</button>
        </div>
    </v-ons-page>
</template>

<script>
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'
import SuccessPage from './SuccessPage'
import moment from 'moment'

export default {
    computed: {
        inspectionCharacteristics() {
            return this.$store.state.inspectionCharacteristics
        }
    },
    data: function() {
        return {
            batch_number: '',
            busy: false,
            inspection: {},
            error: '',
            characteristicDialog: false,
            selectedCharacteristic: {},
            evaluation: {}
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
            let idx = _this.inspection.ET_CHAR_REQUIREMENTS.item.findIndex(cr => cr.MSTR_CHAR === _this.selectedCharacteristic.mstr_char)
            _this.inspection.ET_CHAR_RESULTS.item[idx].CHARACTERISTIC = c
        },
        submitInspection: function() {
            let _this = this

            let charResults = []
            _this.inspection.ET_CHAR_RESULTS.item.forEach(function(cr, i) {
                charResults.push({
                    INSPCHAR: cr.INSPCHAR,
                    EVALUATION: _this.evaluation[cr.INSPCHAR] ? 'A' : 'R',
                    CODE1: cr.CHARACTERISTIC.code,
                    CODE_GRP1: cr.CHARACTERISTIC.group,
                    ORIGINAL_INPUT: cr.ORIGINAL_INPUT ? moment(cr.ORIGINAL_INPUT).format('DDMMYYYY') : ''
                })
            })

            // alert(JSON.stringify(charResults))
            // return

            // ini nunggu api-nya final
            if (charResults.filter((cr, i) => cr.CODE1 === '' && _this.inspection.ET_CHAR_REQUIREMENTS.item[i].MSTR_CHAR !== '50000018').length > 0) {
                _this.error = 'Please fill the form correctly!'
                return
            }

            let data = {
                api_token: window.localStorage.api_token,
                inspection_number: _this.inspection.ET_OPERATION.item.INSPLOT,
                charResults: charResults,
                user_id: window.localStorage.userId
            }

            // alert(JSON.stringify(data))
            _this.busy = true
            axios.post(process.env.ROOT_API + 'inspection', data).then(function(r) {
                _this.busy = false
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                // alert(JSON.stringify(jsonData.Envelope.Body["ZFM_INSP_RESULT_INBOUND.Response"]));

                let ret = jsonData.Envelope.Body["ZFM_INSP_RESULT_INBOUND.Response"].ET_RETURN
                // alert(JSON.stringify(ret))

                if ((ret.item && ret.item.TYPE === 'E') || (Array.isArray(ret.item) && ret.item[0].TYPE === 'E')) {
                    _this.error = 'ERROR: ' + (Array.isArray(ret.item) ? ret.item[0].MESSAGE : ret.item.MESSAGE)
                } else {
                    _this.$emit('replace-page', {
                        extends: SuccessPage,
                        data: function() {
                            return {
                                message: 'Inspection created successfully'
                            }
                        }
                    })
                }
            }).catch(function(e) {
                _this.error = e.response.data
                _this.busy = false
            })
        }
    }
}
</script>

<style lang="css" scoped>
</style>
