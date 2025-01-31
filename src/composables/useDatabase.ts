import { ref, onMounted, inject } from "vue";
import { DatabaseService, Producto } from "@/services/DatabaseService";

export function useDatabase() {
  const productos = ref([] as Producto[]);
  const db = new DatabaseService(inject('$sqlite'));

  const fetchProductos = async () => {
    productos.value = await db.obtener_productos();
  };

  onMounted(fetchProductos); // Fetch on component mount

  return { productos, fetchProductos };
}

