<template>
    <div>
      <vue-toast :type="type" :message="message" />
    </div>
  </template>
  
  <script>
  import VueToast from 'vue-toast-notification';
  import 'vue-toast-notification/dist/theme-sugar.css';
  
  export default {
    name: 'CustomToast',
    components: { VueToast },
    props: {
      type: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    },
    mounted() {
      this.showToast();
    },
    methods: {
      showToast() {
        switch (this.type) {
          case "success":
            this.$toast.success(this.message, { timeout: 3000 });
            break;
          case "warning":
            this.$toast.warning(this.message, { timeout: 3000 });
            break;
          case "error":
            this.$toast.error(this.message, { timeout: 3000 });
            break;
          default:
            break;
        }
      }
    }
  };
  </script>
  