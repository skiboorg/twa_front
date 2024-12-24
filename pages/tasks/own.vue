<script setup lang="ts">

const authStore = useAuthStore()

const {user} = storeToRefs(authStore)



</script>

<template>
  <div class="container ">
    <p class="font-medium text-2xl mb-4">Мои задачи</p>




    <div class="flex flex-col gap-3 items-start">
      <TaskCard v-for="task in user.tasks" :key="task.task.id" :task="task.task" />
    </div>

  </div>
</template>

<style scoped>

</style>