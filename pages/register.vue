<template>
  <Form v-if="schema" :validation-schema="schema" v-slot="{ handleSubmit, isSubmitting }">
    <form @submit.prevent="handleSubmit(onSubmit)" class="register-wrapper">
      <h1>Rejestracja</h1>

      <div class="form-item-wrapper">
        <ErrorMessage class="error" name="username" />
        <Field name="username" placeholder="Username" />
      </div>

      <div class="form-item-wrapper">
        <ErrorMessage class="error" name="password" />
        <Field name="password" type="password" placeholder="Password" />
      </div>

      <div class="form-item-wrapper">
        <ErrorMessage class="error" name="confirmPassword" />
        <Field name="confirmPassword" type="password" placeholder="Powtórz hasło" />
      </div>

      <div class="form-item-wrapper">
        <label class="checkbox">
          <Field name="terms" type="checkbox" :value="true" :unchecked-value="false" />
          Akceptuję regulamin
        </label>
        <ErrorMessage class="error" name="terms" />
      </div>

      <p v-if="serverError" class="error">{{ serverError }}</p>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Rejestrowanie…' : 'Register' }}
      </button>

      <NuxtLink to="/login" class="link-under">
        Masz konto? Zaloguj się
      </NuxtLink>
    </form>
  </Form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useAuth } from '@/composables/useAuth.js'

const { register } = useAuth()

const schema = ref(null)
const serverError = ref('')

onMounted(() => {
  schema.value = yup.object({
    username: yup
      .string()
      .trim()
      .required('Nazwa użytkownika jest wymagana')
      .min(3, 'Min. 3 znaki')
      .matches(/^[a-zA-Z0-9_.-]+$/, 'Dozwolone litery, cyfry, _ . -'),
    password: yup
      .string()
      .required('Hasło jest wymagane')
      .min(8, 'Min. 8 znaków')
      .matches(/\d/, 'Hasło musi zawierać cyfrę'),
    confirmPassword: yup
      .string()
      .required('Potwierdź hasło')
      .oneOf([yup.ref('password')], 'Hasła muszą być takie same'),
    terms: yup
      .boolean()
      .oneOf([true], 'Musisz zaakceptować regulamin'),
  })
})

async function onSubmit(values) {
  serverError.value = ''
  try {
    await register({
      username: values.username,
      email: values.email,
      password: values.password,
    })
    navigateTo('/login')
  } catch (e) {
    serverError.value = e?.data?.message || 'Błąd rejestracji. Spróbuj ponownie.'
  }
}

definePageMeta({ middleware: 'guest' })
</script>

