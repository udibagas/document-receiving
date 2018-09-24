<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">CREATE INBOUND</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <po-component></po-component>
        <v-ons-list style="margin-bottom:45px">
            <v-ons-list-item v-for="item in items" :key="item.PO_ITEM" v-if="parseInt(item.QUANTITY) > item.QTY_INBOUND">
                <label class="left">
                    <strong>#{{parseInt(item.PO_ITEM)}}</strong>
                </label>
                <label class="center">
                    <div class="list-item__title">{{item.SHORT_TEXT}}</div>
                    <span class="list-item__subtitle">
                        {{item.MATERIAL_EXTERNAL}}<br>
                        Qty PO: {{parseInt(item.QUANTITY)}} &bull;
                        Inbound: {{item.QTY_INBOUND}} &bull;
                        GR: {{item.QTY_GR}}
                    </span>
                </label>
                <label class="right" style="text-align:right">
                    <input type="number" v-model="quantity" class="my-input" placeholder="Qty">
                </label>
            </v-ons-list-item>
        </v-ons-list>
        <br>
        <div class="btn-fixed-bottom">
            <v-ons-button :disabled="busy" class="btn-submit" @click.prevent="submitInbound">SUBMIT</v-ons-button>
            <p class="error text-center" v-if="error">{{error}}</p>
        </div>
    </ons-page>
</template>

<script>
import axios from 'axios'
import PoComponent from './PoComponent'

export default {
    components: { PoComponent },
    data: function() {
        return {
            busy: false,
            quantity: '',
            po: {},
            items: [],
            error: ''
        }
    },
    methods: {
        submitInbound: function() {
            let _this = this

            if (!_this.quantity) {
                _this.error = "Please fill the quantity!"
                return
            }

            _this.busy = true
            _this.error = 'Processing...'
            // TODO: sesuaikan URL & data
            axios.post(process.env.ROOT_API + 'inbound', {
                po: _this.po,
                po_number: _this.po.PO_NUMBER,
                item: _this.item,
                quantity: _this.quantity
            }).then(function(r) {
                _this.sendLog(1)
                _this.busy = false
                _this.error = ''
                _this.$ons.notification.toast('Inbound creation SUCCESS!', { timeout: 3000, animation: 'fall' })
                _this.$emit('pop-page')
                _this.$store.commit('update', _this.po.PO_NUMBER)
            }).catch(function(e) {
                _this.busy = false
                _this.$ons.notification.toast('Inbound creation FAILED!', { timeout: 3000, animation: 'fall' })
                _this.sendLog(2)
            })
        },
        sendLog: function(status) {
            let _this = this
            let data = {
                po_number: _this.po.PO_NUMBER,
                // TODO : sesuaikan lagi
                message: 'User :user creates Inbound for PO #' + _this.po.PO_NUMBER + ' items : ' + JSON.stringify(_this.items),
                action: 'Create Inbound',
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
.btn-submit {
    width: 95%;
}

.my-input {
    background-color: #eee;
    border: none;
    padding: 5px;
    font-size: 20px;
    width: 50px;
    color: red;
    text-align: center;
}

::-webkit-input-placeholder {
   text-align: center;
   font-weight: lighter;
}

:-moz-placeholder { /* Firefox 18- */
   text-align: center;
   font-weight: lighter;
}

::-moz-placeholder {  /* Firefox 19+ */
   text-align: center;
   font-weight: lighter;
}

:-ms-input-placeholder {
   text-align: center;
   font-weight: lighter;
}
</style>
