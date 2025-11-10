import { ref } from 'vue';

const isSidebarOpen = ref(false);

export const useSidebar = () => {
  const toggle = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  return {
    isSidebarOpen,
    toggle,
  };
};
