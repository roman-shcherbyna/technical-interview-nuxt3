<template>
  <form @submit.prevent="handleLogin" class="login-wrapper">
    <h1>Login</h1>
    <input v-model="form.username" placeholder="Username" />
    <input v-model="form.password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
    <NuxtLink to="/register">Utwórz konto</NuxtLink>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuth } from '@/composables/useAuth.js'

const form = reactive({ username: '', password: '' })
const { login } = useAuth()

function handleLogin() {
  login(form).then(() => navigateTo('/'))
}

definePageMeta({ middleware: 'guest' })
</script>