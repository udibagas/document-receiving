<template lang="html">
    <v-ons-page>
        <div class="background" :style="{ backgroundImage: 'url(' + bg + ')'}"></div>
        <navbar nav="Logout" @logout="logout"></navbar>
        <div class="main">
            <div class="logo-placeholder">&nbsp;</div>
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
import { timeout } from 'q';
import { setInterval } from 'timers';

export default {
    data() {
        return {
            bg: '',
            bgInterval: null
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
    },
    mounted() {
        let _this = this
        this.bg = this.$store.state.bgList[0]
        this.bgInterval = setInterval(function() {
            _this.bg = _this.$store.state.bgList[Math.floor(Math.random() * 10)]
        }, 30000);
    },
    destroyed() {
        clearInterval(this.bgInterval);
    }
}
</script>

<style scoped>
.background {
    background-color:#3355aa;
    /* background-image: url('./assets/img/ID7.png'); */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.main {
    padding: 30px;
    position: absolute;
    bottom: 50px;
    width: 100%;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

.card {
    margin: 0;
    padding: 0;
    box-shadow: none;
    background: transparent;
    color: #fff;
    text-align: center;
}

.logo-placeholder {
    background-image: url('./assets/img/logo-white.png');
    background-size: 150px;
    background-repeat: no-repeat;
    height: 40px;
}
</style>
