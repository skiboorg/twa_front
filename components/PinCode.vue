<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

const toast = useToast()

enum InputMode {
  init='init',
  repeat='repeat'
}
enum Title {
  inputPassword= 'Введите пароль',
  createPassword= 'Придумайте пароль',
  repeatPassword= 'Подтвердите пароль',
}

const props = defineProps({
  digitsNumber: {
    type: Number,
    required: true
  },
  needConfirm:{
    type: Boolean,
    required:false,
    default:false
  }
})


const emits = defineEmits([
    'new-pincode',
    'entered-pincode',
])

const digits = ref([1,2,3,4,5,6,7,8,9,'0'])//.sort( () => .5 - Math.random() )
const mode = ref(InputMode.init)
const entered_digits = ref([])
const repeated_digits = ref([])
const pinCodeTitle = ref('')

const compareArrays = (a:[], b:[]) =>
    a.length === b.length &&
    a.every((element, index) => element === b[index]);

const removeDigit = () => {
  if (mode.value === InputMode.init){
    entered_digits.value.splice(entered_digits.value.length-1 ,1)
  }else {
    repeated_digits.value.splice(repeated_digits.value.length-1 ,1)
  }
}

const addDigit = (digit) => {
  if (mode.value === InputMode.init) entered_digits.value.push(digit)
  if (mode.value === InputMode.repeat) repeated_digits.value.push(digit)
}

watch(entered_digits,(val)=>{
  if(val.length === props.digitsNumber){
    if (props.needConfirm){
      digits.value//.sort( () => .5 - Math.random() );
      mode.value = InputMode.repeat
      pinCodeTitle.value = Title.repeatPassword
    }else {
      emits('entered-pincode',entered_digits.value.join(''))
    }
  }
}, { deep: true }
)

watch(repeated_digits,(val)=>{
  if(val.length === props.digitsNumber) {
    const compareResult = compareArrays(entered_digits.value, repeated_digits.value)
    console.log(compareResult)
    if (!compareResult){
      toast.add({ severity: 'error',summary:'Ошибка', detail: 'Пароли не совпадают', life: 3000 });

      mode.value = InputMode.init
      entered_digits.value = []
      repeated_digits.value = []
      pinCodeTitle.value = Title.createPassword
      digits.value//.sort( () => .5 - Math.random() );
    }else {
      emits('new-pincode',repeated_digits.value.join(''))
    }

  }
}, { deep: true }
)

onMounted(()=>{
  props.needConfirm ? pinCodeTitle.value = Title.createPassword : pinCodeTitle.value = Title.inputPassword

})

</script>

<template>
  <div class="pincode-panel">

    <div class="flex gap-2 justify-center mb-3">
      <span v-if="needConfirm" class="pin-input"
            :data-number="
            mode === InputMode.init
            ? entered_digits[index] ? entered_digits[index] : '&#9900;'
            : repeated_digits[index] ? repeated_digits[index] : '&#9900;'"
            v-for="(_,index) in digitsNumber" :key="index">
      </span>
      <span v-else class="pin-input"
            :data-number="entered_digits[entered_index] ? '*' : ''"
            v-for="(_,entered_index) in digitsNumber" :key="entered_index">
      </span>

    </div>
    <p class="text-center text-lg font-bold mb-3">{{pinCodeTitle}}</p>
    <div class="pincode-wrapper">
      <Button class="number"
                :class="{hidden:digit===10}"
                severity="secondary"

                @click="addDigit(digit)"
                v-for="digit in digits"
                :key="digit"
              :label="`${digit}`"/>
      <Button class="number"  severity="secondary"  @click="removeDigit" label="<"/>
  </div>

</div>
</template>

<style scoped lang="sass">
.pincode-wrapper
  display: flex
  flex-wrap: wrap
  max-width: 260px
  align-items: center
  justify-content: flex-end
  align-self: center
  margin: 0 auto
  gap: 16px

.number
  width: calc(100% / 3.5 )


.pin-input
  position: relative
  border: 1px solid hsl(var(--input))
  border-radius: var(--radius)
  width: 50px
  height: 50px
  display: inline-block
  &::after
    position: absolute
    content: attr(data-number)
    font-size: 20px
    width: 50px
    height: 50px
    display: flex
    align-items: center
    justify-content: center
    color: var(--text-gray-600)



</style>