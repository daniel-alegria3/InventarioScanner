<template>
  <div>
    <input v-model="search_text" placeholder="Buscar productos..." />
    <ul>
      <li v-for="product in search_results" :key="product.id">{{ product.nombre }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useSearch } from "@/composables/useSearch";
const { search_text, search_results } = useSearch();
</script>

