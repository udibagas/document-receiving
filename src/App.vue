<template>
    <v-ons-navigator swipeable
        :page-stack="pageStack"
        @push-page="pageStack.push($event)"
        @replace-page="pageStack.pop(); pageStack.push($event)"
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
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@font-face{
    font-family:"Nirmala UI";
    src:url("assets/fonts/Nirmala_0.ttf")
}

body {
    /* font-family: "Nirmala UI",sans-serif; */
    color: #5a5a5a;
    /* font-size: .9em; */
}

.page--material__content {
    color: #5a5a5a;
    /* font-size: .9em; */
}

.page--material__content,
.text-input__label.text-input--material__label,
.text-input,
.card--material,
.list-item,
.list-item__subtitle.list-item--material__subtitle
.button {
    /* font-family: "Nirmala UI",sans-serif; */
    /* font-size: .9em; */
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
    /* font-family: "Nirmala UI",sans-serif; */
    font-size: 1em;
}

.action-sheet-button--material {
    /* font-family: "Nirmala UI",sans-serif; */
    padding: 0;
    text-align: center;
    height: 40px;
    line-height: 40px;
}

.button {
    /* border-radius: 20px; */
    background-color: #396080;
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
    display: block;
    width: 100%;
    margin-bottom: 5px;
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
    margin: 10px auto;
}
</style>
