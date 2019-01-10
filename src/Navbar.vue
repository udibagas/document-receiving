<template>
    <div class="nav">
        <v-ons-row>
            <v-ons-col @click="$emit(nav === 'Logout' ? 'logout' : 'back')">
                <i :class="iconLeftClass[nav]"></i> {{nav}}
            </v-ons-col>
            <v-ons-col width="0">
                <div class="separator">&nbsp;</div>
            </v-ons-col>
            <v-ons-col style="text-align:right;">
                {{user}} <i class="zmdi zmdi-account-circle zmdi-hc-2x icon-right"></i>
            </v-ons-col>
        </v-ons-row>
    </div>
</template>

<script>
    export default {
        props: ['nav'],
        data() {
            return {
                user: window.localStorage.userId,
                iconLeftClass: {
                    Logout: ['zmdi', 'zmdi-hc-2x', 'icon-left', 'zmdi-close-circle'],
                    Back: ['zmdi', 'zmdi-hc-3x', 'icon-left', 'zmdi-chevron-left']
                }
            }
        }
    }
</script>

<style scoped>
.nav {
    background-color: rgba(0, 0, 0, .5);
    color:white;
    height:50px;
    line-height: 50px;
    position:fixed;
    top:0;
    width:100%;
    font-size: 12px;
    padding: 0 15px;
    box-shadow: #fff;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

.separator {
    border-left:1px solid #fff;
    height:30px;
    margin-top:10px;
}

.icon-left {
    vertical-align:middle;
    margin-right:10px;
}

.icon-right {
    vertical-align:middle;
    margin-left:10px;
}
</style>