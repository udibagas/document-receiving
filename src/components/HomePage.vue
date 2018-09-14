<template>
  <v-ons-page>
    <div class="header">
      <img src="../assets/logo.png">
    </div>

    <section style="margin: 16px">
        <v-ons-input modifier="large" v-model="po_number" placeholder="PO NUMBER"></v-ons-input>
        <v-ons-button v-if="is_ready" modifier="large" style="margin: 6px 0;" @click.prevent="scanDocument">Scan Document</v-ons-button>
        <br>
        <img :src="image_src" alt=""><br>
    </section>

  </v-ons-page>
</template>

<script>
export default {
    name: 'home',
    data () {
        return {
            po_number: '',
            image_src: '',
            is_ready: false
        }
    },
    methods: {
        scanDocument() {
            let _this = this;
            _this.po_number = '';
            _this.image_src = '';

            let cameraOptions = {
                quality: 20,
                destinationType: Camera.DestinationType.DATA_URL
            };

            navigator.camera.getPicture(function(imageData) {
                _this.image_src = 'data:image/jpeg;base64,' + imageData;
                TesseractPlugin.recognizeText(imageData, 'eng', function(recognizedText) {
                    _this.po_number = recognizedText;
                }, function(reason) {
                    alert('Failed to recognize text: ' + reason);
                });
            }, function(message) {
                alert(message);
            }, cameraOptions);
        }
    },
    mounted: function() {
        let _this = this;
        this.$ons.ready(function() {
            _this.is_ready = true;
            TesseractPlugin.loadLanguage('eng', function(response) {
                // language loaded
            }, function(reason) {
                alert(reason);
            });
        });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
    text-align: center;
    margin: 10px auto;
}

img {
    max-width: 300px;
    margin: 10px auto;
}
</style>
