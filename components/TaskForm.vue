<script setup>
import { ref, onMounted } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useTasks } from '~/composables/useTasks'

const { addTask } = useTasks()

const schema = ref(null)

onMounted(() => {
  schema.value = yup.object({
    title: yup.string().required('Nagłówek jest wymagany').min(10, 'Min. 10 symboli'),
    description: yup.string().required('Opis jest wymagany'),
    deadline: yup.date().transform((value, originalValue) => originalValue === '' ? null : value).required('Data jest wymagana'),
    is_done: yup.boolean(),
  })
})

const successMessage = ref('')

function submit(values, resetForm) {
  addTask(values)
  resetForm()
  successMessage.value = 'Task dodany!'

  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}
</script>

<template>
  <div class="task-form-wrapper">
  <h2 class="h2-main">Dodaj zadanie</h2>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <Form v-if="schema" :validation-schema="schema" v-slot="{ handleSubmit, resetForm }">
      <form @submit.prevent="handleSubmit(values => submit(values, resetForm))">
        <div class="form-item-wrapper">
          <ErrorMessage class="error" name="title" />
          <Field name="title" class="add-task-title" placeholder="Nagłówek" />
        </div>
        <div class="form-item-wrapper">
          <ErrorMessage class="error" name="description" />
          <Field name="description" class="add-task-description" as="textarea" placeholder="Opis" />
        </div>
        <div class="form-item-wrapper">
          <ErrorMessage class="error" name="deadline" />
          <Field name="deadline" class="add-task-deadline" type="datetime-local" />
        </div>
        <div class="add-task-is-done-wrapper">
          <label class="add-task-is-done">
            <Field name="is_done" type="checkbox" :value="true" :unchecked-value="false" />
            Wykonana
          </label>
        </div>
        <button class="add-task-add-task-button" type="submit">Dodaj</button>
      </form>
    </Form>
  </div>
</template>
