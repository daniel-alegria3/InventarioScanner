import { ref, onMounted, watch, inject } from "vue";
import { DatabaseService, Producto } from "@/services/DatabaseService";

export function useSearch() {
  const db = new DatabaseService(inject('$sqlite'));
  const search_text = ref("");
  const search_results = ref([] as Producto[]);

  const search_query = async () => {
    if (search_text.value.trim() === "") {
      search_results.value = []; // Clear search_results if search is empty
      return;
    }
    search_results.value = await db.obtener_productos_por_texto(search_text.value);
  };

  // Run search when component mounts
  onMounted(search_query);

  // Watch search_text and re-run search whenever it changes
  watch(search_text, search_query);

  return { search_text, search_results };
}

