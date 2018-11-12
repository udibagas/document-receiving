<template>
    <v-ons-navigator swipeable
        :page-stack="pageStack"
        :options="{animation: 'slide'}"
        @push-page="pageStack.push($event)"
        @replace-page="pageStack = []; pageStack.push($event)"
        @pop-page="pageStack.pop()"
    ></v-ons-navigator>
</template>

<script>
import Login from './components/Login'
import Main from './components/Main'

export default {
    name: 'app',
    data: function() {
        return {
            pageStack: [(window.localStorage.isLoggedIn === 'true') ? Main : Login]
            // pageStack: [Main]
        }
    }
}
</script>

<style>
body {
    color: #5a5a5a;
}

.page--material__content {
    color: #5a5a5a;
}

.back-button--material {
    color: #fff;
}

.toolbar--material.toolbar,
.action-sheet-button--material,
.action-sheet-button--material:last-of-type {
    background-color: #396080;
    color: #fff;
}

.toolbar__title {
    color: #fff;
    font-size: 1em;
}

.action-sheet-button--material {
    padding: 0;
    text-align: center;
    height: 40px;
    line-height: 40px;
}

.button {
    background-color: #396080;
}

.btn-action {
    background-color: #38c172;
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
    background-color: #fff;
    padding: 10px 0;
}

img.logo {
    width: 200px;
    margin: 0 auto 10px;
}

.text-primary, .list-header--material {
    color: #396080;
}

.text-white {
    color: #fff;
}

.list-header {
    background-color: #396080;
    color: #fff;
}
</style>
