<template lang="html">
    <v-ons-page>
        <div class="background"></div>
        <div class="content">
            <img style="width:80%;margin:10px auto;" src="../assets/logo-white.png"><br>
            <span style="font-size:18px;color:#fff;">MATERIAL RECEIVING AND INSPECTION<br>MOBILE APP</span><br>

            <v-ons-row style="margin-top:20px;">
                <v-ons-col>
                    <v-ons-card class="text-center text-white inbound-btn" @click="inbound">
                        <span style="font-size:14px;">INBOUND</span><br>
                        <img style="margin-top:30px;" src="../assets/inbound-icon.png">
                    </v-ons-card>
                </v-ons-col>
                <v-ons-col>
                    <v-ons-card class="text-center text-white gr-btn" @click="gr">
                        <span style="font-size:14px;">GOODS RECEIPT</span><br>
                        <img style="margin-top:30px;" src="../assets/gr-icon.png">
                    </v-ons-card>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row>
                <v-ons-col>
                    <v-ons-card class="text-center text-white mrir-btn" @click="mrir">
                        <span style="font-size:14px;">MRIR NOTIFICATION</span><br>
                        <img style="margin-top:30px;" src="../assets/mrir-icon.png">
                    </v-ons-card>
                </v-ons-col>
                <v-ons-col>
                    <v-ons-card class="text-center text-white qi-btn" @click="qi">
                        <span style="font-size:14px;">QUALITY INSPECTION</span><br>
                        <img style="margin-top:30px;" src="../assets/inspection-icon.png">
                    </v-ons-card>
                </v-ons-col>
            </v-ons-row>
        </div>

        <v-ons-bottom-toolbar style="background:transparent">
            <v-ons-row>
                <v-ons-col style="text-align:center">
                    <v-ons-button style="margin-top:3px;background:none;color:#fff;" modifier="material--flat" @click.prevent="exit">EXIT APP</v-ons-button>
                </v-ons-col>
                <v-ons-col style="text-align:center">
                    <v-ons-button style="margin-top:3px;background:none;color:#fff;" modifier="material--flat" @click.prevent="logout">LOGOUT</v-ons-button>
                </v-ons-col>
            </v-ons-row>
        </v-ons-bottom-toolbar>
    </v-ons-page>
</template>

<script>
import moment from 'moment'
import Login from './Login'
import SearchPo from './SearchPo'
import SearchBatchNumber from './SearchBatchNumber'
import DeclareServiceable from './DeclareServiceable'

export default {
    data: function() {
        return {
            year: moment().format('YYYY')
        }
    },
    methods: {
        logout: function() {
            window.localStorage.isLoggedIn = null
            window.localStorage.user = null
            this.$emit('replace-page', Login);
        },
        exit: function() {
            window.localStorage.isLoggedIn = null
            window.localStorage.user = null
            navigator.app.exitApp()
        },
        inbound: function() {
            this.$emit('push-page', {
                extends: SearchPo,
                data: function() {
                    return {
                        action: 'inbound'
                    }
                }
            })
        },
        gr: function() {
            this.$emit('push-page', {
                extends: SearchPo,
                data: function() {
                    return {
                        action: 'gr'
                    }
                }
            })
        },
        mrir: function() {
            this.$emit('push-page', {
                extends: SearchPo,
                data: function() {
                    return {
                        action: 'mrir'
                    }
                }
            })
        },
        qi: function() {
            this.$emit('push-page', SearchBatchNumber)
        },
        ds: function() {
            this.$emit('push-page', DeclareServiceable)
        }
    }
}
</script>

<style scoped>
.background {
    /* background-image: url('../assets/bg_main_cropped.jpg'); */
    background-image: url('http://13.76.153.42/material-receiving-and-inspection-dev/images/bg_main_cropped.jpg');
    background-color:#3355aa;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-blend-mode: color-dodge;
}

.content {
    text-align: center;
    margin: 20px auto 0;
}

.form {
    margin: 100px auto 10px;
    width: 250px;
}

.inbound-btn {
    background-color: #B99364;
    opacity: 0.8;
    border-top: 2px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-left: 2px solid #ddd;
}

.gr-btn {
    background-color: #4f76bd;
    opacity: 0.8;
    border-top: 2px solid #ddd;
    border-right: 2px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
}

.mrir-btn {
    background-color: #7cd997;
    opacity: 0.8;
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 2px solid #ddd;
    border-left: 2px solid #ddd;
}

.qi-btn {
    background-color: #d370a6;
    opacity: 0.8;
    border-top: 1px solid #ddd;
    border-right: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
    border-left: 1px solid #ddd;
}

.card {
    margin: 0;
    box-shadow: none;
    border-radius: 0;
    height: 170px;
}
</style>
