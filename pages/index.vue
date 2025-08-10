<script setup>
import TaskForm from '~/components/TaskForm.vue'
import TaskList from '~/components/TaskList.vue'

definePageMeta({ middleware: 'auth' })
</script>

<template>
  <div class="main-wrapper">
    <TaskForm />
    <TaskList />
  </div>
</template>

