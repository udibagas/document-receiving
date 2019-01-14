<template>
    <div>
        <v-ons-navigator swipeable
        :page-stack="pageStack"
        :options="{animation: 'slide'}"
        @push-page="pageStack.push($event)"
        @replace-page="pageStack = []; pageStack.push($event)"
        @pop-page="pageStack.pop()"
        ></v-ons-navigator>
    </div>
</template>

<script>
import Login from './Login'
import Main from './Main'

export default {
    name: 'app',
    data: function() {
        return {
            pageStack: [(window.localStorage.isLoggedIn === 'true') ? Main : Login]
            // pageStack: [Login]
        }
    },
    mounted: function() {
        this.$ons.ready(function() {
            window.plugins.insomnia.keepAwake()
        });
    }
}
</script>

<style>
@font-face {
    font-family: "OpenSans";
    src: url("assets/fonts/OpenSans-Regular.ttf");
}

@font-face {
    font-family: "OpenSans";
    src: url("assets/fonts/OpenSans-Bold.ttf");
    font-weight: bold;
}

@font-face {
    font-family: "OpenSans";
    src: url("assets/fonts/OpenSans-Italic.ttf");
    font-style: italic;
}

@font-face {
    font-family: "OpenSans";
    src: url("assets/fonts/OpenSans-BoldItalic.ttf");
    font-weight: bold;
    font-style: italic;
}

@font-face {
    font-family: "OpenSans";
    src: url("assets/fonts/OpenSans-Light.ttf");
    font-weight: lighter;
}

@font-face {
    font-family: "OpenSans";
    src: url("assets/fonts/OpenSans-LightItalic.ttf");
    font-weight: lighter;
    font-style: italic;
}

body {
    font-family: "OpenSans", sans-serif;
    color: #5a5a5a;
}

.page--material__content {
    font-family: "OpenSans", sans-serif;
    color: #5a5a5a;
}

.page--material,
.page,
.button--material,
.list,
.list-item,
.text-input,
.textarea,
.textarea--transparent,
.button {
    font-family: "OpenSans", sans-serif !important;
}

.back-button--material {
    color: #fff;
}

.toolbar__title {
    color: #fff;
    font-size: 1em;
}

.nav-title {
    background-color:#9BA09A;
    background-image: url('./assets/img/ID4.png');
    background-position: left;
    background-repeat: no-repeat;
    margin-top: 0;
    height: 80px;
    line-height: 80px;
    position: fixed;
    width: 100%;
    top: 50px;
    font-size: 24px;
    padding-left: 15px;
    color: #FFF;
}

.button {
    background-color:#3acce1;
    font-weight: bold;
    border-radius: 15px;
    height: 50px;
    line-height: 50px;
    font-size: 13px;
}

.background {
    background-color: #fff;
}

.success {
    color: #38c172;
}

.danger, .error {
    color: #e3342f;
}

.full-width {
    width: 100%;
}

.text-center {
    text-align: center;
}

.btn-fixed-bottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    text-align: center;
    padding: 10px 0;
}

.text-primary, .list-header--material {
    background-color:#3acce1;
}

.text-white {
    color: #fff;
}

.list-header {
    background-color:#3acce1;
    color: #fff;
    font-weight: bold;
}
</style>
