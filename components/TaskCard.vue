<script setup lang="ts">
const props = defineProps(['task'])
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';

dayjs.extend(relativeTime);
dayjs.locale('ru');

const formattedDate = dayjs(props.task.created_at).fromNow();
</script>

<template>
  <div class="rounded-2xl bg-white p-4" @click="navigateTo(`/tasks/${task.id}`)">
    <p class="font-medium mb-1">{{task.name}}</p>
    <p class="text-gray-400 text-xs font-medium mb-3">{{formattedDate}}</p>

    <div class="flex items-center gap-3 mb-4">
      <div class="border rounded-xl px-3 py-2 grow">
        <p class="text-gray-400 font-medium text-xs mb-1">Цена</p>
        <p class="text-primary font-medium text-xs flex gap-2 items-center"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.74189 8.05508L2.5044 9.4258C2.27174 9.5683 1.96759 9.49522 1.82507 9.26258C1.75546 9.14894 1.73471 9.01201 1.76752 8.88287L2.11388 7.51958C2.23891 7.02744 2.57567 6.61608 3.03341 6.3963L5.47439 5.22434C5.58819 5.1697 5.63616 5.03316 5.58152 4.91936C5.53727 4.8272 5.43721 4.77562 5.33647 4.79307L2.61934 5.26347C2.06701 5.35909 1.50061 5.20657 1.07097 4.84653L0.21261 4.1272C0.00349054 3.95195 -0.0239677 3.64035 0.151281 3.43124C0.236515 3.32952 0.359084 3.26638 0.491381 3.25603L3.11394 3.05079C3.29921 3.03629 3.46068 2.91904 3.53181 2.74735L4.54354 0.305081C4.64796 0.0530114 4.93696 -0.06668 5.18903 0.0377421C5.31006 0.0878814 5.40622 0.184046 5.45636 0.305081L6.4681 2.74735C6.53922 2.91904 6.70069 3.03629 6.88596 3.05079L9.52296 3.25716C9.79496 3.27845 9.99818 3.51621 9.97689 3.78822C9.96668 3.91907 9.90475 4.04047 9.80489 4.12562L7.79382 5.84014C7.65218 5.96084 7.59046 6.15083 7.63396 6.33171L8.25225 8.90015C8.31611 9.16544 8.15282 9.43222 7.88761 9.49608C7.76011 9.5268 7.62568 9.50551 7.51389 9.43701L5.25802 8.05508C5.09965 7.95808 4.90025 7.95808 4.74189 8.05508Z" fill="#6092F1"/>
        </svg>
          {{task.price}}</p>
      </div>
      <div class="border rounded-xl px-3 py-2 grow">
        <p class="text-gray-400 font-medium text-xs mb-1">Срок</p>
        <p class=" font-medium text-xs flex gap-2 items-center">{{task.days_until_deadline}} дней</p>
      </div>
      <div class="border rounded-xl px-3 py-2 grow">
        <p class="text-gray-400 font-medium text-xs mb-1">Уровень</p>
        <p class=" font-medium text-xs flex gap-2 items-center">{{task.level?.name}}</p>
      </div>
    </div>
    <p class="text-gray-400 text-sm">{{task.short_description}}</p>

  </div>
</template>

<style scoped>

</style>