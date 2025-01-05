<script setup lang="ts">

const authStore = useAuthStore()

const {user} = storeToRefs(authStore)



</script>

<template>
  <div class="container ">
    <p class="font-medium text-2xl mb-4">Мои задачи</p>



    <div class="bg-white p-4 rounded-2xl mb-3">

      <p class="opacity-50 text-xs">
        Вы можете взять до 3х задач в работу одновременно. После выполнения одной из задач вы сможете взять одну новую в работу.
      </p>
    </div>

    <div class="flex flex-col gap-3 items-start">

      <TaskCard v-for="task in user.tasks" :key="task.task.id" :task="task.task" :extra_data="task"/>
    </div>

  </div>
</template>

<style scoped>

</style>