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
  const checkTelegramReady = () => {
    if (window.Telegram?.WebApp?.expand) {
      window.Telegram.WebApp.expand()
    } else {
      // Проверяем каждые 100ms, пока не появится WebApp
      setTimeout(checkTelegramReady, 100)
    }
  }

  if (typeof window !== 'undefined') {
    checkTelegramReady()
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
