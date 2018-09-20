<template lang="html">
    <ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">CREATE INBOUND</div>
        </v-ons-toolbar>
        <div class="background"></div>
        <v-ons-card>
            <v-ons-list>
                <li class="list-item">
                    <div class="list-item__center">
                        <v-ons-row>
                            <v-ons-col>PO NUMBER</v-ons-col>
                            <v-ons-col>: <strong>{{po.PO_NUMBER}}</strong></v-ons-col>
                        </v-ons-row>
                    </div>
                </li>
                <v-ons-list-item>
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
            <v-ons-button :disabled="busy" class="btn-submit" @click.prevent="submitInbound">SUBMIT</v-ons-button>
            <p class="error" v-if="error">{{error}}</p>
        </v-ons-card>
    </ons-page>
</template>

<script>
import axios from 'axios'

export default {
    data: function() {
        return {
            busy: false,
            quantity: '',
            po: {},
            item: {},
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
            axios.post(process.env.ROOT_API + 'inbound', {
                po: _this.po,
                po_number: _this.po.PO_NUMBER,
                item: _this.item,
                quantity: _this.quantity
            }).then(function(r) {
                _this.busy = false
                _this.error = ''
                _this.$emit('replace-page', {
                    extends: Main,
                    data: function() {
                        return {
                            alert: {
                                title: 'INBOUND CREATED',
                                show: true,
                                message: 'Inbound for PO #' + _this.po.PO_NUMBER + ' created'
                            }
                        }
                    }
                })
            }).catch(function(e) {
                _this.busy = false
                if (e.response) {
                    if (e.response.status === 500) {
                        _this.error = 'Internal server error! ' + e.response.data.message
                    }

                    if (e.response.status === 404) {
                        _this.error = 'Page not found!'
                    }
                } else {
                    _this.error = 'Failed to connect to server!'
                }
            })
        }
    }
}
</script>

<style lang="css" scoped>
.background {
    background-color: #eee;
}

.btn-submit {
    display: block;
    width: 100%;
    margin-bottom: 5px;
    border-radius: 20px;
}

.error {
    color: red;
    text-align: center;
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
