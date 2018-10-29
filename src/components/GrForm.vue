<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">GR PROCESS</div>
            <div class="right">
                <v-ons-toolbar-button>
                    <v-ons-button icon="fa-save" style="border:1px solid #fff;" @click.prevent="submitGr"> SAVE</v-ons-button>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>
        <div class="background"></div>
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
            <li class="list-item">
                <div class="list-item__center">
                    {{inbound.BILL_OF_LADING}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Bill of Ladding</div>
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
                    {{inbound.QUANTITY}}
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Quantity</div>
                </div>
            </li>
            <!-- <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.eun" disabled class="text-input" placeholder="EUn">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">EUn</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.bun" disabled class="text-input" placeholder="BUn">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">BUn</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.sloc" disabled class="text-input" placeholder="Sloc">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Sloc</div>
                </div>
            </li> -->
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

        <div class="toast" v-show="toast.show">
            <div class="toast__message">{{toast.message}}</div>
            <button class="toast__button" @click="toast.show = false">OK</button>
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

export default {
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
            toast: { show: false, message: '' }
        }
    },
    methods: {
        submitGr: function() {
            // TODO: validate first
            let _this = this
            let pattern = new RegExp("ROT|REP|RT0")

            if (pattern.test(_this.item.MATL_GROUP) && !_this.serial_no) {
                _this.toast = { show: true, message: 'Serial Number harus diisi!' }
                return
            }

            _this.busy = true
            let data = {
                api_token: window.localStorage.api_token,
                po_number: _this.po.E_POHEADER.PO_NUMBER,
                po_item: _this.item.PO_ITEM,
                serial_no: _this.serial_no,
                entry_qty: _this.inbound.QUANTITY,
                item_text: _this.item_text,
                bill_of_lading: _this.inbound.BILL_OF_LADING
            }

            axios.post(process.env.ROOT_API + 'gr', data).then(function(r) {
                _this.busy = false
                let jsonData = fastXmlParser.parse(r.data, {
                    trimValues: true,
                    ignoreNameSpace: true,
                    ignoreAttributes: true,
                    parseAttributeValue: false,
                    parseNodeValue: false
                });

                // alert(JSON.stringify(jsonData.Envelope.Body["ZFM_IB_DLV_INBOUND.Response"]));

                let ret = jsonData.Envelope.Body["ZFM_GR_INBOUND.Response"].ET_RETURN

                if (ret.item && ret.item.TYPE === 'E') {
                    _this.toast = { show: true, message: 'ERROR: ' + ret.item.MESSAGE }
                } else {
                    _this.$emit('replace-page', {
                        extends: SuccessPage,
                        data: function() {
                            return {
                                message: 'GR creation success with number xxx'
                            }
                        }
                    })
                }
            })
            .catch(function(e) {
                _this.toast = { show: true, message: e.response.data }
                _this.busy = false
            })
        }
    },
    mounted: function() {
        this.inbound.QUANTITY = parseInt(this.inbound.QUANTITY)
        this.item.PO_ITEM = parseInt(this.item.PO_ITEM)
    }
}
</script>

<style lang="css" scoped>
</style>
