<template lang="html">
    <v-ons-page>
        <div class="background"></div>
        <div class="content">
            <img class="logo" src="../assets/logo.png"><br>
            <strong class="text-primary" style="font-size:13px">MATERIAL RECEIVING AND INSPECTION</strong><br>

            <v-ons-row style="padding:0 20px;margin-top:80px;">
                <v-ons-col>
                    <v-ons-card style="background-color:#396080;" class="text-center text-white" @click="goTo('GoodsReceipt')">
                        <i class="zmdi zmdi-widgets" style="font-size:90px;"></i><br>
                        <span style="font-size:10px">GOODS RECEIPT</span>
                    </v-ons-card>
                </v-ons-col>
                <v-ons-col>
                    <v-ons-card style="background-color:#396080;" class="text-center text-white" @click="goTo('QualityInspection')">
                        <i class="zmdi zmdi-assignment-check" style="font-size:90px;"></i><br>
                        <span style="font-size:10px">QUALITY INSPECTION</span>
                    </v-ons-card>
                </v-ons-col>
            </v-ons-row>
            <v-ons-row style="padding:0 20px;">
                <v-ons-col>
                    <v-ons-card style="background-color:#396080;" class="text-center text-white" @click="goTo('MrirNotification')">
                        <i class="zmdi zmdi-notifications" style="font-size:90px;"></i><br>
                        <span style="font-size:10px">MRIR NOTIFICATION</span>
                    </v-ons-card>
                </v-ons-col>
                <v-ons-col>
                    <v-ons-card style="background-color:#396080;" class="text-center text-white" @click="goTo('DeclareServiceable')">
                        <i class="zmdi zmdi-wrench" style="font-size:90px;"></i><br>
                        <span style="font-size:10px">DECLARE SERVICEABLE</span>
                    </v-ons-card>
                </v-ons-col>
            </v-ons-row>
            <!-- <v-ons-row style="padding:0 20px;">
                <v-ons-col>
                    <v-ons-card style="background-color:#396080;" class="text-center text-white" @click="logout">
                        <v-ons-icon icon="ion-log-out" size="90px"></v-ons-icon><br>
                        <span style="font-size:10px">LOGOUT</span>
                    </v-ons-card>
                </v-ons-col>
                <v-ons-col>
                    <v-ons-card style="background-color:#396080;" class="text-center text-white" @click="exit">
                        <v-ons-icon icon="ion-power" size="90px"></v-ons-icon><br>
                        <span style="font-size:10px">EXIT</span>
                    </v-ons-card>
                </v-ons-col>
            </v-ons-row> -->
        </div>

        <div class="btn-fixed-bottom">
            <small style="color:#999">&copy; {{year}} | GMF AeroAsia</small>
        </div>

        <v-ons-bottom-toolbar>
            <v-ons-row>
                <v-ons-col style="text-align:center">
                    <v-ons-button style="margin-top:3px;background:none;color:#396080;" modifier="material--flat" @click.prevent="exit">EXIT APP</v-ons-button>
                </v-ons-col>
                <v-ons-col style="text-align:center">
                    <v-ons-button style="margin-top:3px;background:none;color:#396080;" modifier="material--flat" @click.prevent="logout">LOGOUT</v-ons-button>
                </v-ons-col>
            </v-ons-row>
        </v-ons-bottom-toolbar>
    </v-ons-page>
</template>

<script>
import moment from 'moment'
import Login from './Login'
import GoodsReceipt from './GoodsReceipt'
import QualityInspection from './QualityInspection'
import DeclareServiceable from './DeclareServiceable'
import MrirNotification from './MrirNotification'

export default {
    components: {
        GoodsReceipt,
        QualityInspection,
        DeclareServiceable,
        MrirNotification,
        Login
    },
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
        goTo: function(page) {
            let components = {
                'GoodsReceipt': GoodsReceipt,
                'QualityInspection': QualityInspection,
                'DeclareServiceable': DeclareServiceable,
                'MrirNotification': MrirNotification
            }
            this.$emit('push-page', components[page])
        }
    }
}
</script>

<style scoped>
.content {
    text-align: center;
    margin: 20px auto 0;
}

.form {
    margin: 100px auto 10px;
    width: 250px;
}
</style>
