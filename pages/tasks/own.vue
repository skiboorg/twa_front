<script setup lang="ts">

const authStore = useAuthStore()

const {user} = storeToRefs(authStore)

const value = ref('Активные');
const options = ref(['Активные', 'Завершенные' ]);

</script>

<template>
  <div class="container ">
    <p class="font-medium text-2xl mb-4">Мои задачи</p>
    <div class="bg-white p-4 rounded-2xl mb-3">

      <p class="opacity-50 text-xs">
        Вы можете взять до 3х задач в работу одновременно. После выполнения одной из задач вы сможете взять одну новую в работу.
      </p>
    </div>
    <SelectButton class="mb-3" v-model="value" :options="options" />

    <div v-if="value==='Активные'" class="flex flex-col gap-3 items-start">
      <TaskCard v-for="task in user.tasks.filter(x=>!x.is_done)" :key="task.task.id" :task="task.task" :extra_data="task"/>
      <div v-if="user.tasks.filter(x=>!x.is_done).length === 0" class="bg-white p-4 rounded-2xl mb-3 w-full">
        <p class="text-center opacity-50 text-xs">Активных задач нет</p>
      </div>
    </div>
    <div v-if="value==='Завершенные'" class="flex flex-col gap-3 items-start">
      <TaskCard v-for="task in user.tasks.filter(x=>x.is_done)" :key="task.task.id" :task="task.task" :extra_data="task"/>
      <div v-if="user.tasks.filter(x=>x.is_done).length === 0" class="bg-white p-4 rounded-2xl mb-3 w-full">
        <p class="text-center opacity-50 text-xs">Завершенных задач нет</p>
      </div>
    </div>




  </div>
</template>

<style scoped>

</style>