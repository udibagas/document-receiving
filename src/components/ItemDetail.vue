<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">ITEM DETAIL</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <div class="container">
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col width="130px">PO Item</v-ons-col>
                <v-ons-col style="font-weight:normal;">: {{item.PO_ITEM}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col width="130px">Short Text</v-ons-col>
                <v-ons-col style="font-weight:normal;">: {{item.SHORT_TEXT}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col width="130px">Material</v-ons-col>
                <v-ons-col style="font-weight:normal;">: {{item.MATERIAL}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col width="130px">Material External</v-ons-col>
                <v-ons-col style="font-weight:normal;">: {{item.MATERIAL_EXTERNAL}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col width="130px">Plant</v-ons-col>
                <v-ons-col style="font-weight:normal;">: {{item.PLANT}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col width="130px">Material Group</v-ons-col>
                <v-ons-col style="font-weight:normal;">: {{item.MATL_GROUP}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col width="130px">Quantity</v-ons-col>
                <v-ons-col style="font-weight:normal;">: {{item.QUANTITY}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col width="130px">Quantity Inbound</v-ons-col>
                <v-ons-col style="font-weight:normal;">: {{item.QTY_INBOUND}}</v-ons-col>
            </v-ons-row>
            <v-ons-row style="margin-bottom:5px;">
                <v-ons-col width="130px">Quantity GR</v-ons-col>
                <v-ons-col style="font-weight:normal;">: {{item.QTY_GR}}</v-ons-col>
            </v-ons-row>
        </div>
        <v-ons-list style="margin-bottom:45px;">
            <li class="list-header">Unreceived Inbound Delivery ({{poConfirmation.filter(c => parseInt(c.QUANTITY) > parseInt(c.QTY_REDUCED) && c.CONF_NAME === 'Inbound Delivery').length}})</li>
            <v-ons-list-item v-for="c in poConfirmation" :key="c.DELIV_NUMB" :class="selectedInbound === c.DELIV_NUMB ? 'selected' : ''"
                v-if="parseInt(c.QUANTITY) > parseInt(c.QTY_REDUCED) && c.CONF_NAME === 'Inbound Delivery'" tappable @click="selectedInbound = c.DELIV_NUMB">
                <div class="center">
                    <span class="list-item__subtitle">
                        <span class="my-label">Delivery Number</span>: {{c.DELIV_NUMB}} <br>
                        <span class="my-label">Quantity</span>: {{parseInt(c.QUANTITY)}} <br>
                        <span class="my-label">Bill Of Lading</span>: {{c.BILL_OF_LADING}} <br>
                        <span class="my-label">Delivery Date</span>: {{c.DELIV_DATE}} <br>
                        <span class="my-label">Invoice Number</span>: {{c.INVOICE_NO}} <br>
                        <span class="my-label">Invoice Date</span>: {{c.INVOICE_DT}} <br>
                        <span class="my-label">Prelim Doc. Number</span>: {{c.PREL_DOC_NO}} <br>
                        <span class="my-label">Prelim Doc. Date</span>: {{c.DATE_PREL_DOC}}
                    </span>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <div class="btn-fixed-bottom">
            <v-ons-button :disabled="selectedInbound === ''" style="width:95%" @click.prevent="createGr">CREATE GR</v-ons-button>
        </div>
    </v-ons-page>
</template>

<script>
import GrForm from './GrForm'

export default {
    data: function() {
        return {
            po: {},
            item: {},
            poConfirmation: [],
            selectedInbound: ''
        }
    },
    methods: {
        createGr: function() {
            let _this = this
            _this.$emit('push-page', {
                extends: GrForm,
                data: function() {
                    return {
                        item: _this.item,
                        inbound: _this.poConfirmation.find(c => c.DELIV_NUMB === _this.selectedInbound)
                    }
                }
            });
        }
    }
}
</script>

<style lang="css" scoped>
.container {
    padding: 15px;
    background-color: #efefef;
}

.selected {
    background-color: #D1ECF1;
}

.my-label {
    display: inline-block;
    width: 135px;
}
</style>
