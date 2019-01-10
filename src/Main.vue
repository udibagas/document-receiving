<template lang="html">
    <v-ons-page>
        <div class="background"></div>
        <navbar nav="Logout" @logout="logout"></navbar>
        <div class="content">
            <img style="width:130px;" src="./assets/img/logo-white.png"><br>
            <span style="font-size:22px;color:#fff;font-weight:light;">Material Receiving <br>and Inspection</span>
            <br>
            <br>
            <v-ons-row>
                <v-ons-col>
                    <v-ons-card @click="inbound">
                        <i class="zmdi zmdi-flight-land zmdi-hc-5x" style="display:block;"></i>
                        <span style="font-size:10px;">Inbound</span>
                    </v-ons-card>
                </v-ons-col>
                <v-ons-col width="0">
                    <div style="border-left:1px solid #fff;height:60px;margin-top:10px;">&nbsp;</div>
                </v-ons-col>
                <v-ons-col>
                    <v-ons-card @click="gr">
                        <i class="zmdi zmdi-archive zmdi-hc-5x" style="display:block;"></i>
                        <span style="font-size:10px;">Goods Receipt</span>
                    </v-ons-card>
                </v-ons-col>
            </v-ons-row>
            <br>
            <v-ons-row>
                <v-ons-col>
                    <v-ons-card @click="mrir">
                        <i class="zmdi zmdi-notifications-none zmdi-hc-5x" style="display:block;"></i>
                        <span style="font-size:10px;">MRIR Notification</span>
                    </v-ons-card>
                </v-ons-col>
                <v-ons-col width="0">
                    <div style="border-left:1px solid #fff;height:60px;margin-top:10px;">&nbsp;</div>
                </v-ons-col>
                <v-ons-col>
                    <v-ons-card @click="qi">
                        <i class="zmdi zmdi-search zmdi-hc-5x" style="display:block;"></i>
                        <span style="font-size:10px;">Quality Inspection</span>
                    </v-ons-card>
                </v-ons-col>
            </v-ons-row>
        </div>
    </v-ons-page>
</template>

<script>
import Login from './Login'
import SearchPo from './SearchPo'
import SearchBatchNumber from './SearchBatchNumber'
import DeclareServiceable from './DeclareServiceable'

export default {
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
    background-color:#3355aa;
    background-image: url('./assets/img/ID7.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-blend-mode: color-dodge;
}

.content {
    margin-top: 240px;
    padding: 30px;
    position: absolute;
}

.card {
    margin: 0;
    padding: 0;
    box-shadow: none;
    background: transparent;
    color: #fff;
    text-align: center;
}
</style>
