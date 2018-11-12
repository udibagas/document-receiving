<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">GOODS RECEIPT</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <po-header></po-header>

        <v-ons-list style="margin-bottom:15px;">
            <li class="list-header">Unprocessed Inbound</li>
            <v-ons-list-item v-for="c in poConfirmation"
                :key="c.DELIV_NUMB"
                v-if="parseInt(c.QUANTITY) > parseInt(c.QTY_REDUCED) && c.CONF_NAME === 'Inbound Delivery'"
                tappable modifier="chevron"
                @click="createGr(c)">
                <div class="center">
                    <div class="list-item__title">
                        {{c.DELIV_NUMB}}
                    </div>
                    <div class="list-item__subtitle">
                        <span class="my-label">Prelim Doc No.</span> : {{c.PREL_DOC_NO}}<br>
                        <span class="my-label">Invoice Number</span> : {{c.INVOICE_NO}}<br>
                        <span class="my-label">Bill of Lading</span> : {{c.BILL_OF_LADING}}<br>
                    </div>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <h4 class="danger" style="text-align:center;text-transform:uppercase;margin-top:50px;" v-if="poConfirmation.filter(c => parseInt(c.QUANTITY) > parseInt(c.QTY_REDUCED)).length === 0">
            No Unprocessed Inbund Found
        </h4>

        <div class="btn-fixed-bottom">
            <v-ons-button v-if="parseInt(po.E_POHEADER.PO_REL_IND) !== 2" style="width:95%;" @click.prevent="createNotification">CREATE NOTIFICATION</v-ons-button>
        </div>

        <div class="toast" v-show="error" style="bottom:45px;">
            <div class="toast__message">{{error}}</div>
            <button class="toast__button" @click="error = ''">OK</button>
        </div>

    </v-ons-page>
</template>

<script>
import axios from 'axios'
import NotificationForm from './NotificationForm'
import GrForm from './GrForm'
import PoHeader from './PoHeader'

export default {
    components: { PoHeader },
    computed: {
        po() { return this.$store.state.po },
        poConfirmation() { return this.$store.getters.poConfirmation },
        itemList() { return this.$store.getters.itemList }
    },
    data: function() {
        return {
            error: ''
        }
    },
    methods: {
        createNotification: function() {
            let problemDescription = '[TULIS PESAN ANDA]'
            problemDescription += '\n\n\n'
            problemDescription += '------------------------------------' + '\n'
            problemDescription += 'Detail PO' + '\n'
            problemDescription += '------------------------------------' + '\n'
            problemDescription += 'PO Number: ' + this.po.E_POHEADER.PO_NUMBER + '\n'
            problemDescription += 'Vendor: ' + this.po.E_VENDOR_NAME + '\n'
            problemDescription += 'Created By: ' + this.po.E_POHEADER.CREATED_BY + '/' + this.po.E_USER_FULLNAME + '\n'
            problemDescription += 'Created Date: ' + this.po.E_POHEADER.CREAT_DATE + '\n'
            problemDescription += 'Release Status: NOT RELEASED'

            let _this = this
            this.$emit('push-page', {
                extends: NotificationForm,
                data: function() {
                    return {
                        problem: { notifType: 'G3', description: 'RELEASE PO' },
                        purchaser_name: _this.po.E_USER_FULLNAME,
                        description: problemDescription
                    }
                }
            })
        },
        createGr: function(inbound) {
            let item = this.itemList.find(i => i.PO_ITEM === inbound.PO_ITEM)
            this.$emit('push-page', {
                extends: GrForm,
                data: function() {
                    return {
                        inbound: inbound,
                        item: item
                    }
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>
.my-label {
    width: 100px;
    display: inline-block;
}
</style>
