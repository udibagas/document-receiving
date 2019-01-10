<template>
    <ons-page>
        <div class="background"></div>
        <div class="content">
            <!-- <div class="select-area"> </div> -->
            <div class="btn-bottom">
                <v-ons-button class="my-btn" @click.prevent="takePicture">TAKE PICTURE</v-ons-button>
            </div>
        </div>

        <img :src="img" alt="" style="width:100%">
    </ons-page>
</template>

<script>
import Tesseract from 'tesseract.js'
export default {
    data: function() {
        return {
            img: ''
        }
    },
    methods: {
        startCamera() {
            this.$ons.ready(function() {
                let options = {
                    x: 0,
                    y: 0,
                    width: window.screen.width,
                    // height: window.screen.height,
                    // width: 200,
                    height: 50,
                    camera: CameraPreview.CAMERA_DIRECTION.BACK,
                    toBack: true,
                    tapPhoto: true,
                    tapFocus: true,
                    previewDrag: true
                };

                CameraPreview.startCamera(options);
            })
        },
        takePicture() {
            let _this = this
            CameraPreview.takePicture(function(base64PictureData) {
                _this.img = `data:image/jpeg;base64,${base64PictureData}`
                Tesseract.recognize(_this.img).then(function(result) {
                    alert(JSON.stringify(result))
                }).catch(function(e) {
                    alert(e)
                })
            });
            // CameraPreview.stopCamera()
        }
    },
    mounted: function() {
        this.startCamera()
    }
}
</script>

<style scoped>
.select-area {
    width:250px;
    height:50px;
    border:1px solid red;
    background:transparent;
    margin:150px auto 0;
}

.background {
    background: transparent;
}

.content {
    text-align: center;
}

.btn-bottom {
    position: fixed;
    bottom: 5px;
    width: 100%;
    text-align: center;
    background-color: transparent;
}

.my-btn {
    width: 90%;
    height: 60px;
    line-height: 60px;
}
</style>
