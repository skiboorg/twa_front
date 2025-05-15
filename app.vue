<script setup>
useHead({
  script: [
    {
      src: 'https://telegram.org/js/telegram-web-app.js',
      async: true,
    },
  ],
});
onMounted(() => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand()
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
