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
            <v-ons-row class="form-item">
                <v-ons-button class="btn-save" @click.prevent="submitData">SUBMIT</v-ons-button>
            </v-ons-row>
        </div>

        <v-ons-dialog :visible.sync="alert.show">
            <div style="text-align:center;padding:15px;">
                <p v-if="alert.title"><strong>{{alert.title}}</strong></p>
                <p>{{alert.message}}</p>
                <br>
                <p><v-ons-button class="btn-save" @click.prevent="alert.show = false">OK</v-ons-button></p>
            </div>
        </v-ons-dialog>
    </v-ons-page>
</template>

<script>
import axios from 'axios'
import Main from './Main'

export default {
    data: function() {
        return {
            formData: {},
            validationErrors: {},
            alert: {
                show: false,
                title: '',
                message: ''
            }
        }
    },
    methods: {
        submitData: function() {
            let _this = this
            axios.post(process.env.ROOT_API + 'grProcess', _this.formData)
                .then(function(r) {
                    _this.$emit('replace-page', {
                        extends: Main,
                        data: function() {
                            return {
                                alert: {
                                    show: true,
                                    title: 'GR COMPLETED',
                                    message: 'Material Document #' + _this.formData.po_number + ' created'
                                }
                            }
                        }
                    });
                })
                .catch(function(e) {
                    if (e.response) {
                        if (e.response.status === 500) {
                            _this.validationErrors = {};
                            _this.alert = {
                                show: true,
                                title: 'ERROR 500',
                                message: e.response.data.message
                            }
                        }

                        if (e.response.status === 422) {
                            _this.validationErrors = e.response.data.errors
                            _this.alert = {
                                show: true,
                                title: 'VALIDATION ERROR',
                                message: 'Please fill form correctly!'
                            }
                        }

                        if (e.response.status === 404) {
                            _this.validationErrors = {};
                            _this.alert = {
                                show: true,
                                title: 'ERROR 404',
                                message: 'Page not found!'
                            }
                        }
                    } else {
                        _this.alert = {
                            show: true,
                            title: 'ERROR',
                            message: 'Failed to connect to server!'
                        }
                    }
                })
        }
    }
}
</script>

<style lang="css" scoped>
.background {
    background-color: white;
}

.content {
    margin-top: 20px;
    padding: 20px;
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
    display: block;
    width: 100%;
    margin-bottom: 5px;
    border-radius: 20px;
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
