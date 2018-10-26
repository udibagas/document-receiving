<template lang="html">
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button></v-ons-back-button>
            </div>
            <div class="center">INSPECTION FORM</div>
            <div class="right">
                <v-ons-toolbar-button>
                    <v-ons-button icon="fa-save" style="border:1px solid #fff;" @click.prevent="submitGr"> SAVE</v-ons-button>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>
        <div class="background"></div>
        <v-ons-list>
            <v-ons-list-item>
                <div class="center">
                    <small>INSPECTION LOT NUMBER</small>
                    <div class="list-item__title">12214234</div>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <small>SERVICEABILITY AUTHORITY</small>
                    <div class="list-item__title">EASA approved part</div>
                    <div class="list-item__subtitle">Status: <span class="danger">Rejected</span></div>
                </div>
                <div class="right">
                    <v-ons-switch v-model="switchOff"> </v-ons-switch>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <small>SEC SERVICEABLE AUTHORITY 1</small>
                    <div class="list-item__title">EASA approved part</div>
                    <div class="list-item__subtitle">Status: <span class="success">Approved</span></div>
                </div>
                <div class="right">
                    <v-ons-switch v-model="switchOn"> </v-ons-switch>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <small>SEC SERVICEABLE AUTHORITY 2</small>
                    <div class="list-item__title">FAA approved part</div>
                    <div class="list-item__subtitle">Status: <span class="danger">Rejected</span></div>
                </div>
                <div class="right">
                    <v-ons-switch v-model="switchOff"> </v-ons-switch>
                </div>
            </v-ons-list-item>
            <v-ons-list-item>
                <div class="center">
                    <small>SERVICEABILITY STATUS</small><br>
                    <div class="list-item__title">Serviceable</div>
                    <div class="list-item__subtitle">Status: <span class="success">Approved</span></div>
                </div>
                <div class="right">
                    <v-ons-switch v-model="switchOn"> </v-ons-switch>
                </div>
            </v-ons-list-item>
        </v-ons-list>

        <v-ons-dialog :visible="false">
            <v-ons-list>
                <v-ons-list-item>
                    DGCA approved part
                </v-ons-list-item>
                <v-ons-list-item>
                    EASA approved part
                </v-ons-list-item>
                <v-ons-list-item>
                    FAA approved part
                </v-ons-list-item>
            </v-ons-list>
        </v-ons-dialog>
    </v-ons-page>
</template>

<script>
import axios from 'axios'

export default {
    data: function() {
        return {
            formData: {},
            inspection: {}
        }
    },
    methods: {
        submitData: function() {
            let _this = this
            axios.post('inspection', formData).then(function(r) {
                alert(r.data)
            }).catch(function(e) {
                alert(e)
            })
        }
    }
}
</script>

<style lang="css" scoped>
</style>
