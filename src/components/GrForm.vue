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
                    <input type="text" v-model="gr.po_number" class="text-input" placeholder="PO Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">PO Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.part_number" class="text-input" placeholder="Part Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Part Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.mat_description" class="text-input" placeholder="Mat. Description">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Mat. Description</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.delivery_note" class="text-input" placeholder="Delivery Note/Invoice">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Delivery Note/Invoice</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.bill_of_lading" class="text-input" placeholder="Bill of Ladding">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Bill of Ladding</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.movement_type" class="text-input" placeholder="Movement Type">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Movement Type</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.plant" class="text-input" placeholder="Plant">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Plant</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.storage_location" class="text-input" placeholder="Storage Location">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Storage Location</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.item" class="text-input" placeholder="Item">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Item</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.quantity" class="text-input" placeholder="Quantity">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Quantity</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.eun" class="text-input" placeholder="EUn">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">EUn</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.bun" class="text-input" placeholder="BUn">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">BUn</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.sloc" class="text-input" placeholder="Sloc">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Sloc</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.serial_number" class="text-input" placeholder="Serial Number">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Serial Number</div>
                </div>
            </li>
            <li class="list-item">
                <div class="list-item__center">
                    <input type="text" v-model="gr.text" class="text-input" placeholder="Text">
                </div>
                <div class="list-item__right">
                    <div class="list-item__label">Text</div>
                </div>
            </li>
        </ul>

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

export default {
    data: function() {
        return {
            gr: {},
            busy: false,
            error: '',
            alert: {
                show: false,
                message: ''
            }
        }
    },
    methods: {
        submitGr: function() {
            let _this = this
            _this.busy = true
            _this.error = 'Saving data...'
            axios.post(process.env.ROOT_API + 'gr', _this.gr).then(function(r) {
                _this.busy = false
                _this.error = ''
                _this.$ons.notification.toast(r.data.message, { timeout: 3000, animation: 'fall' })
                if (r.data.success) {
                    _this.$emit('pop-page')
                    _this.$store.commit('update', _this.gr.PO_NUMBER)
                }
            })
            .catch(function(e) {
                _this.busy = false
                _this.error = ''
                _this.$ons.notification.toast('GR creation FAILED!', { timeout: 3000, animation: 'fall' })
            })
        }
    }
}
</script>

<style lang="css" scoped>
.has-error {
    background-color:#f2dede;
}
</style>
