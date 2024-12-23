import nuxtStorage from 'nuxt-storage';
import { useToast } from 'primevue/usetoast';

export const useAuthStore = defineStore('auth', () => {
    const toast = useToast()
    const {$api} = useNuxtApp()
    const user = ref(null)
    const authData = ref({})

    const loading = ref(false)

    const isLoggedIn = computed(() => !!user.value)

    const login = async (payload:any)=> {
        loading.value = true
        let result = {success:false}

        try{
            const response = await $api.post('/auth/token/login/',{...payload})

            console.log(response.data.auth_token)
            nuxtStorage.localStorage.setData('auth_token', response.data.auth_token);
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
        toast.add({ severity: 'success',summary:'Success', detail: 'User updated', life: 3000 });

    }

    const createPassword = async (payload)=> {
        delete payload.orders
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

    return { user,isLoggedIn,loading,authData, login,checkUser,me,update,createPassword }
})