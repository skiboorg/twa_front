import nuxtStorage from 'nuxt-storage';
import { useToast } from 'primevue/usetoast';

export const useAuthStore = defineStore('auth', () => {

    const toast = useToast()
    const {$api} = useNuxtApp()
    const user = ref(null)
    const authData = ref({})
    const social_services = ref([])

    const loading = ref(false)

    const isLoggedIn = computed(() => !!user.value)

    const login = async (payload:any)=> {
        loading.value = true
        let result = {success:false}

        try{
            const response = await $api.post('/auth/token/login/',{...payload})

            console.log(response.data.auth_token)

            nuxtStorage.localStorage.setData('auth_token', response.data.auth_token, 30, 'd');
            result.success = true
            loading.value = false
            return result
        }catch (e) {
            loading.value = false

            return result

        }

    }



    const update = async (payload)=> {
        console.log(payload)
        await $api.patch(`/api/user/update`,{...payload})
        await me()
        toast.add({ severity: 'success',summary:'Успешно', detail: 'Данные пользователя обновлены', life: 3000 });

    }

    const withdrawal_request = async (amount)=> {
        const {data} = await $api.post(`/api/user/new_request`,{amount})

        if(data.success){
            await me()
            toast.add({ severity: 'success',summary:'Успешно', detail: 'Запрос на вывод отправлен', life: 3000 })
        }
        else {
            toast.add({ severity: 'error',summary:'Ошибка', detail: 'Запрос на вывод не отправлен', life: 3000 })
        }

    }
    const createPassword = async (payload)=> {

        await $api.post(`/api/user/create_password`,{...payload})
        authData.value.status = 'exists'

    }

    const checkUser = async (userData)=> {
        const response = await $api.post(`/api/user/check_user`,{...userData})
        authData.value = response.data
    }

    const me = async ()=> {
        loading.value = true
        try {
            const response = await $api('/api/user/me')
            user.value = response.data
        }catch (e) {

            navigateTo('/')
        }
        loading.value = false
    }

    const social_action = async (payload)=> {
        loading.value = true
        await $api.post(`/api/user/social_action`,{...payload})
        loading.value = false
    }

    const get_social_services = async ()=> {

        const response = await $api('/api/user/social_services')
        social_services.value = response.data

    }

    return { user,isLoggedIn,loading,authData,social_services, login,checkUser,me,update,createPassword,get_social_services,social_action,withdrawal_request }
})