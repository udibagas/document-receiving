<template lang="html">
    <v-ons-page>
        <div class="background"></div>
        <navbar nav="Back" @back="$emit('pop-page')" style="background-color:#1e2237;"></navbar>
        <div class="nav-title">Inspection Form</div>
        <v-ons-card>
            <span class="label">Inspection Lot Number</span>
            <span class="value">{{inspection.ET_OPERATION.item.INSPLOT}}</span>
            <v-ons-row>
                <v-ons-col>
                    <span class="label">Batch Number</span>
                    <span class="value">{{batch_number}}</span>
                </v-ons-col>
                <v-ons-col>
                    <span class="label">Plant</span>
                    <span class="value">{{inspection.ET_OPERATION.item.PLANT}}</span>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row>
                <v-ons-col>
                    <span class="label">Text Operation</span>
                    <span class="value">{{inspection.ET_OPERATION.item.TXT_OPER}}</span>
                </v-ons-col>
                <v-ons-col>
                    <span class="label">Work Center</span>
                    <span class="value">{{inspection.ET_OPERATION.item.WORKCENTER || '-'}}</span>
                </v-ons-col>
            </v-ons-row>
        </v-ons-card>
        <v-ons-list style="margin-bottom:70px;">
            <v-ons-list-item v-for="(r, i) in inspection.ET_CHAR_REQUIREMENTS.item" :key="r.INSPCHAR">
                <div class="center">
                    <small class="char-desc">{{r.CHAR_DESCR}}</small>
                    <div class="list-item__title" v-if="r.MSTR_CHAR !== '50000018'">
                        <span @click="selectCharacteristic(r.MSTR_CHAR)" :class="inspection.ET_CHAR_RESULTS.item[i].CHARACTERISTIC.code === '' ? 'danger' : ''">
                            <i class="zmdi zmdi-border-color"></i>
                            &nbsp;
                            {{inspection.ET_CHAR_RESULTS.item[i].CHARACTERISTIC.description}}
                        </span>
                        <textarea rows="2" v-model="inspection.ET_CHAR_RESULTS.item[i].REMARK" class="remark-input" placeholder="Remark"></textarea>
                    </div>
                    <div class="list-item__title" v-if="r.MSTR_CHAR === '50000018'">
                        <input type="text" v-mask="'99/99/9999'" v-model="inspection.ET_CHAR_RESULTS.item[i].ORIGINAL_INPUT" class="remark-input" placeholder="dd/mm/yyyy">
                        <textarea rows="2" v-model="inspection.ET_CHAR_RESULTS.item[i].REMARK" class="remark-input" placeholder="Remark"></textarea>
                        <!-- <datetime v-model="inspection.ET_CHAR_RESULTS.item[i].ORIGINAL_INPUT" placeholder="Best Before Date" format="dd/MM/yyyy" zone="Asia/Jakarta" value-zone="Asia/Jakarta"></datetime> -->
                        <!-- <v-ons-input type="date" style="width:150px;" v-model="inspection.ET_CHAR_RESULTS.item[i].ORIGINAL_INPUT" placeholder="Best Before Date"></v-ons-input> -->
                    </div>
                    <div class="list-item__subtitle">
                        <span :class="evaluation[r.INSPCHAR] ? 'approved' : 'rejected'">
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

        <div class="btn-fixed-bottom">
            <v-ons-button style="width:95%" @click.prevent="submitInspection">SUBMIT</v-ons-button>
        </div>

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
                    ORIGINAL_INPUT: cr.ORIGINAL_INPUT ? moment(cr.ORIGINAL_INPUT, 'DD/MM/YYYY').format('DDMMYYYY') : '31129999'
                })
            })

            // ini nunggu api-nya final
            if (charResults.filter((cr, i) => cr.CODE1 === '' && _this.inspection.ET_CHAR_REQUIREMENTS.item[i].MSTR_CHAR !== '50000018').length > 0) {
                _this.error = 'Please fill the form correctly!'
                return
            }

            // alert(JSON.stringify(charResults))
            // return

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
.page {
    margin-top: 130px;
}

.label {
    display: block;
    font-style: italic;
    color: #ccc;
    font-size: 12px;
}

.value {
    color: #3a6897;
    margin-bottom: 10px;
    font-size: 18px;
    display: block;
    font-weight: bold;
}

.card {
    border-radius: 15px;
}

.approved, .rejected {
    border-radius: 5px;
    color: white;
    font-size: 10px;
    padding: 5px;
    font-weight: bold;
}

.approved {
    background-color: #3ACCE1;
}

.rejected {
    background-color: red;
}

.char-desc {
    font-size: 10px;
    color: #999;
    font-style: italic;
    font-weight: bold;
}

.list-item__title {
    color: #3a6897;
    font-size: 14px;
}

.remark-input {
    margin: 10px 0;
    border-radius: 10px;
    font-size: 14px;
    font-family: 'OpenSans';
    background-color: #F3F3F3;
    border: none;
    display: block;
    width: 250px;
    padding: 10px;
}
</style>
