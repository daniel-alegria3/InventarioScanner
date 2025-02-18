import { ref, onMounted, watch, inject } from "vue";
import { DatabaseService, Producto } from "@/services/DatabaseService";

export function useSearch() {
  const db = new DatabaseService(inject('$sqlite'));
  const search_text = ref("");
  const search_categories = ref([] as string[]);
  const search_results = ref([] as Producto[]);

  const search_query = async () => {
    if (search_text.value.trim() === "") {
      search_results.value = [];
      return;
    }
    if (search_categories.value.length === 0) {
      search_results.value = await db.obtener_productos_por_nombre(search_text.value);
      return;
    }

    search_results.value = await db.obtener_productos_por_nombre_y_categorias(search_text.value, search_categories.value);
  };

  // Run search when component mounts
  onMounted(search_query);

  // Watch search_text and re-run search whenever it changes
  watch(search_text, search_query);

  return { search_text, search_categories, search_results };
}

