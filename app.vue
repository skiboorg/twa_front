<script setup>
useHead({
  script: [
    {
      src: 'https://telegram.org/js/telegram-web-app.js',
      async: true,
    },
  ],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
