<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">GR PROCESS</div>
            <!-- <div class="right">
                <v-ons-toolbar-button>
                    <v-ons-button icon="fa-save" style="border:1px solid #fff;" @click.prevent="submitGr"> SAVE</v-ons-button>
                </v-ons-toolbar-button>
            </div> -->
        </v-ons-toolbar>
        <div class="background"></div>
        <po-header></po-header>
        <ul class="list" style="margin-bottom:45px">
            <!-- <li class="list-item">
                <div class="list-item__center">
                    {{po.E_POHEADER.PO_NUMBER}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">PO Number</div>
                </div>
            </li> -->
            <li class="list-item">
                <div class="list-item__center">
                    {{parseInt(item.PO_ITEM)}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Item</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.MATERIAL_EXTERNAL}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Part Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.SHORT_TEXT}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Mat. Description</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.PLANT}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Plant</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.MATL_GROUP}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Material Group</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{item.STGE_LOC}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Storage Location</div>
                </div>
            </li>
            <li class="list-header">Inbound Detail</li>
            <li class="list-item">
                <div class="list-item__center">
                    {{inbound.DELIV_NUMB}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Delivery Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{inbound.CONF_TYPE}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Movement Type</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    {{parseInt(inbound.QUANTITY)}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Quantity</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="inbound.PREL_DOC_NO" class="text-input" placeholder="Prelim Doc Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Prelim Doc Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="date" style="width:120px" v-model="inbound.DATE_PREL_DOC" class="text-input" placeholder="Prelim Doc Date">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Prelim Doc Date</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="inbound.INVOICE_NO" class="text-input" placeholder="Invoice Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Invoice Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="date" style="width:120px" v-model="inbound.INVOICE_DT" class="text-input" placeholder="Invoice Date">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Invoice Date</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="inbound.BILL_OF_LADING" class="text-input" placeholder="Bill Of Lading">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Bill of Lading</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="date" v-model="inbound.DELIV_DATE" class="text-input" placeholder="Delivery Date">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Delivery Date</div>
                </div>
            </li>
            <li class="list-header">GR Detail</li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="delivery_note" class="text-input" placeholder="Delivery Note/Invoice">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Delivery Note/Invoice</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="ref_num" class="text-input" placeholder="Reference Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Reference Number</div>
                </div>
            </li>
            <li class="list-item" v-if="RegExp('ROT|REP|RT0').test(item.MATL_GROUP)">
                <div class="list-item__center">
                    <input type="text" v-model="serial_no" class="text-input" placeholder="Serial Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Serial Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="item_text" class="text-input" placeholder="Text">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Text</div>
                </div>
            </li>
        </ul>

        <div class="btn-fixed-bottom">
            <v-ons-button style="width:95%" :disabled="busy" @click.prevent="submitGr"> SUMBIT</v-ons-button>
        </div>

        <div class="toast" v-show="error">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = ''">OK</button>
        </div>

        <v-ons-modal :visible="busy">
            <p style="text-align: center">
                <v-ons-icon icon="fa-spinner" spin size="40px"></v-ons-icon>
                <br><br>
                Saving data...
            </p>
        </v-ons-modal>
    </v-ons-page>
</template>

<script>
import axios from 'axios'
import fastXmlParser from 'fast-xml-parser'
import SuccessPage from './SuccessPage'
import PoHeader from './PoHeader'

export default {
    components: { PoHeader },
    computed: {
        po() { return this.$store.state.po }
    },
    data: function() {
        return {
            item: {},
            inbound: {},
            busy: false,
            serial_no: '',
            delivery_note: '',
            item_text: '',
            error: ''
        }
    },
    methods: {
        submitGr: function() {
            let _this = this

            if (RegExp("ROT|REP|RT0").test(_this.item.MATL_GROUP) && !_this.serial_no) {
                _this.error = 'Serial Number harus diisi!'
                return
            }

            _this.busy = true
            let data = {
                api_token: window.localStorage.api_token,
                po_number: _this.po.E_POHEADER.PO_NUMBER,
                serial_no: _this.serial_no,
                item_text: _this.item_text,
                ref_num: _this.ref_num,
                // TODO: ambil dari login LDAP
                user_id: '580422',
                inbound: _this.inbound
            }

            // alert(JSON.stringify(data))

            axios.post(process.env.ROOT_API + 'gr', data).then(function(r) {
                _this.busy = false
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                // alert(JSON.stringify(jsonData.Envelope.Body["ZFM_GR_INBOUND.Response"]));

                let ret = jsonData.Envelope.Body["ZFM_GR_INBOUND.Response"].ET_RETURN

                if (ret.item && ret.item.TYPE === 'E') {
                    _this.error = 'ERROR: ' + ret.item.MESSAGE
                } else {
                    _this.$emit('replace-page', {
                        extends: SuccessPage,
                        data: function() {
                            return {
                                message: 'GR creation success. Material Document : ' + jsonData.Envelope.Body["ZFM_GR_INBOUND.Response"].E_MATDOC.MAT_DOC
                            }
                        }
                    })
                }
            })
            .catch(function(e) {
                _this.error = e.response.data
                _this.busy = false
            })
        }
    }
}
</script>

<style lang="css" scoped>
</style>
