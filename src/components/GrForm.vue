<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">GR PROCESS</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <div class="content">
            <v-ons-row class="form-item">
                <v-ons-col class="label">Purchase Order</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.po_number" placeholder="Purchase Order" :class="validationErrors.po_number ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.po_number">{{validationErrors.po_number[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Part Number</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.part_number" placeholder="Part Number" :class="validationErrors.part_number ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.part_number">{{validationErrors.part_number[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Mat. Description</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.mat_description" placeholder="Mat. Description" :class="validationErrors.mat_description ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.mat_description">{{validationErrors.mat_description[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Delivery Note/Invoice</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.delivery_note" placeholder="Delivery Note/Invoice" :class="validationErrors.delivery_note ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.delivery_note">{{validationErrors.delivery_note[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Bill of Lading</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.bill_of_lading" placeholder="Bill of Lading":class="validationErrors.bill_of_lading ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.bill_of_lading">{{validationErrors.bill_of_lading[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Movement Type</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.movement_type" placeholder="Movement Type" :class="validationErrors.movement_type ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.movement_type">{{validationErrors.movement_type[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Plant</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.plant" placeholder="Plant" :class="validationErrors.plant ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.plant">{{validationErrors.plant[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Storage Location</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.storage_location" placeholder="Storage Location" :class="validationErrors.storage_location ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.storage_location">{{validationErrors.storage_location[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Item</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.item" placeholder="Item" :class="validationErrors.item ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.item">{{validationErrors.item[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Quantity</v-ons-col>
                <v-ons-col>
                    <input type="text" v-model="formData.quantity" placeholder="Quantity" :class="validationErrors.quantity ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.quantity">{{validationErrors.quantity[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">EUn</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.eun" placeholder="EUn" :class="validationErrors.eun ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.eun">{{validationErrors.eun[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">BUn</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.bun" placeholder="BUn" :class="validationErrors.bun ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.bun">{{validationErrors.bun[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Material</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.material" placeholder="Material" :class="validationErrors.material ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.material">{{validationErrors.material[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Material Description</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.mat_description" placeholder="Material Description" :class="validationErrors.mat_description ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.mat_description">{{validationErrors.mat_description[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Plant</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.plant" placeholder="Plant" :class="validationErrors.plant ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.plant">{{validationErrors.plant[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Sloc</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.sloc" placeholder="Sloc" :class="validationErrors.sloc ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.sloc">{{validationErrors.sloc[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">PO</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.po_number" placeholder="PO" :class="validationErrors.po_number ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.po_number">{{validationErrors.po_number[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Movement Type</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.movement_type" placeholder="Movement Type" :class="validationErrors.movement_type ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.movement_type">{{validationErrors.movement_type[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Serial Number</v-ons-col>
                <v-ons-col>
                    <input type="text" disabled v-model="formData.serial_number" placeholder="Serial Number" :class="validationErrors.serial_number ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.serial_number">{{validationErrors.serial_number[0]}}</p>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row class="form-item">
                <v-ons-col class="label">Text</v-ons-col>
                <v-ons-col>
                    <input type="text" v-model="formData.text" placeholder="Text" :class="validationErrors.text ? 'has-error' : ''">
                    <p class="error" v-if="validationErrors.text">{{validationErrors.text[0]}}</p>
                </v-ons-col>
            </v-ons-row>
        </div>

        <div class="btn-fixed-bottom">
            <v-ons-button class="btn-save" @click.prevent="submitData">SUBMIT</v-ons-button>
        </div>
    </v-ons-page>
</template>

<script>
import axios from 'axios'

export default {
    data: function() {
        return {
            formData: {},
            busy: false,
            validationErrors: {},
            alert: {
                show: false,
                message: ''
            }
        }
    },
    methods: {
        submitData: function() {
            let _this = this
            // TODO: benerin url-nya nembak ke api SAP
            axios.post(process.env.ROOT_API + 'grProcess', _this.formData)
                .then(function(r) {
                    _this.sendLog(1)
                    _this.busy = false
                    _this.$ons.notification.toast('GR creation SUCCESS!', { timeout: 3000, animation: 'fall' })
                    _this.$emit('pop-page')
                    _this.$store.commit('update', _this.formData.PO_NUMBER)
                })
                .catch(function(e) {
                    _this.$ons.notification.toast('GR creation FAILED!', { timeout: 3000, animation: 'fall' })
                    _this.sendLog(0)
                })
        },
        sendLog: function(status) {
            let _this = this
            let data = {
                po_number: _this.po.PO_NUMBER,
                message: 'User :user creates GR for PO #' + _this.po.PO_NUMBER + ' material item #' + _this.item.PO_ITEM + '(' + _this.item.SHORT_TEXT + ')',
                action: 'Create GR',
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
.content {
    margin-top: 20px;
    padding: 20px;
    margin-bottom: 45px;
}

.label {
    padding: 4px 0;
}

input {
    background-color: #eee;
    border: 1px solid #eee;
    padding: 4px 0 4px 4px;
    display: block;
    width: 100%;
    font-size: 16px;
}

.form-item {
    margin-bottom: 10px;
}

.form-field {
    text-align: right;
}

.btn-save {
    width: 95%;
}

.error {
    color: red;
    font-size: 11px;
    margin: 2px 0;
}

.has-error {
    background-color:#f2dede;
}
</style>
