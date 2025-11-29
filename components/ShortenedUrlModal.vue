<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  X,
  Copy,
  Check,
  Calendar,
  Lock,
  Share2,
  QrCode,
  Download,
  MoreVertical,
} from "lucide-vue-next";
import type { Url } from "~/client/src/generated/models/Url";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  url: {
    type: Object as () => Url | null,
    default: null,
  },
});

const emit = defineEmits(["close"]);

const copied = ref(false);
const showDownloadDropdown = ref(false);
const downloadDropdownRef = ref<HTMLElement | null>(null);

const shortUrl = computed(() => {
  if (!props.url) return "";
  return `env.link/${props.url.code}`;
});

const fullUrl = computed(() => `https://${shortUrl.value}`);

const copyToClipboard = async () => {
  if (!shortUrl.value) return;

  try {
    await navigator.clipboard.writeText(fullUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const closeModal = () => {
  emit("close");
};

const formatDate = (date: Date | null) => {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Download QR code functions
const downloadQR = (format: "png" | "svg" | "jpg" = "png") => {
  // This is a mockup - in production, you would generate actual QR code
  console.log(`Downloading QR code as ${format.toUpperCase()}`);
  // TODO: Implement actual QR code download logic
  showDownloadDropdown.value = false;
};

const toggleDownloadDropdown = () => {
  showDownloadDropdown.value = !showDownloadDropdown.value;
};

// Handle click outside to close dropdown
const handleClickOutside = (event: MouseEvent) => {
  if (
    downloadDropdownRef.value &&
    !downloadDropdownRef.value.contains(event.target as Node)
  ) {
    showDownloadDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Social share functions
const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl.value)}`;
  window.open(url, "_blank", "width=600,height=400");
};

const shareOnTwitter = () => {
  const text = `Check out this link: ${fullUrl.value}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "width=600,height=400");
};

const shareOnLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl.value)}`;
  window.open(url, "_blank", "width=600,height=400");
};

const shareOnWhatsApp = () => {
  const text = `Check out this link: ${fullUrl.value}`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "width=600,height=400");
};

const shareOnTelegram = () => {
  const text = `Check out this link`;
  const url = `https://t.me/share/url?url=${encodeURIComponent(fullUrl.value)}&text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "width=600,height=400");
};
</script>

<template>
  <div
    v-if="isOpen && url"
    class="fixed inset-0 z-50 flex items-center justify-center bg-(--overlay-color)/50"
    @click.self="closeModal"
  >
    <div class="box-modal">
      <button
        class="absolute top-4 right-4 text-(--text-color) opacity-70 hover:opacity-100 transition-opacity z-10"
        @click="closeModal"
      >
        <X class="w-6 h-6" />
      </button>

      <div class="flex flex-col gap-6">
        <!-- Header -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <div
              class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
            >
              <Check class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-2xl font-bold">Link Shortened Successfully!</h3>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Your shortened link is ready to share
          </p>
        </div>

        <!-- Short URL and QR Code Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          <!-- Left Column: Short URL + Share Buttons (2 columns) -->
          <div class="md:col-span-2 flex flex-col gap-4 h-full">
            <!-- Short URL Display -->

            <div class="flex-1 pb-5 h-full w-full">
              <label
                class="text-xs mb-2 font-semibold uppercase tracking-wide opacity-70 block"
              >
                Your Short URL
              </label>

              <!-- URL Display -->
              <div
                class="h-full rounded-lg p-5 w-full bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800"
              >
                <a
                  :href="fullUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:underline truncate block"
                >
                  {{ shortUrl }}
                </a>
              </div>
            </div>

            <!-- Share Buttons Section -->
            <div class="space-y-3">
              <div
                class="flex flex-1 rounded-lg flex-wrap gap-1.5 bg-gray-200/80 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700"
              >
                <div
                  class="flex min-h-10 bg-(--primary-color) flex-1 items-center justify-center rounded-l-lg text-white font-semibold gap-2"
                >
                  <Share2 class="w-5 h-5" />
                  <span class="hidden sm:block">Share</span>
                </div>

                <div class="flex flex-wrap justify-between p-1 gap-1.5 pr-1.5">
                  <!-- Facebook -->
                  <button
                    type="button"
                    class="flex items-center justify-center px-2 py-2 rounded-lg bg-[#1877F2] hover:bg-[#0C63D4] text-white transition-all active:scale-95 shadow-md hover:shadow-lg"
                    title="Share on Facebook"
                    @click="shareOnFacebook"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                  </button>

                  <!-- X (Twitter) -->
                  <button
                    type="button"
                    class="flex items-center justify-center px-2 py-2 rounded-lg bg-black hover:bg-gray-800 text-white transition-all active:scale-95 shadow-md hover:shadow-lg"
                    title="Share on X"
                    @click="shareOnTwitter"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      />
                    </svg>
                  </button>

                  <!-- LinkedIn -->
                  <button
                    type="button"
                    class="flex items-center justify-center px-2 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white transition-all active:scale-95 shadow-md hover:shadow-lg"
                    title="Share on LinkedIn"
                    @click="shareOnLinkedIn"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                      />
                    </svg>
                  </button>

                  <!-- WhatsApp -->
                  <button
                    type="button"
                    class="flex items-center justify-center px-2 py-2 rounded-lg bg-[#25D366] hover:bg-[#1DA851] text-white transition-all active:scale-95 shadow-md hover:shadow-lg"
                    title="Share on WhatsApp"
                    @click="shareOnWhatsApp"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                      />
                    </svg>
                  </button>

                  <!-- Telegram -->
                  <button
                    type="button"
                    class="flex items-center justify-center px-2 py-2 rounded-lg bg-[#0088cc] hover:bg-[#006699] text-white transition-all active:scale-95 shadow-md hover:shadow-lg"
                    title="Share on Telegram"
                    @click="shareOnTelegram"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
                      />
                    </svg>
                  </button>

                  <!-- Copy Button -->
                  <button
                    type="button"
                    class="flex items-center justify-center p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-95 shadow-md hover:shadow-lg"
                    :class="copied && 'bg-green-600 hover:bg-green-700'"
                    title="Copy to clipboard"
                    @click="copyToClipboard"
                  >
                    <Check v-if="copied" class="w-4 h-4" />
                    <Copy v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- QR Code (Right - 1 column) -->
          <div class="space-y-2">
            <label
              class="text-xs font-semibold uppercase tracking-wide opacity-70 flex items-center gap-2"
            >
              <QrCode class="w-4 h-4" />
              QR Code
            </label>
            <div
              class="p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-3"
            >
              <!-- Mockup QR Code - Replace with actual QR code generator -->
              <div
                class="w-full max-w-[150px] aspect-square bg-white p-3 rounded-lg"
              >
                <svg
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-full h-full"
                >
                  <!-- Simple QR code mockup pattern -->
                  <rect width="100" height="100" fill="white" />
                  <!-- Corner squares -->
                  <rect x="5" y="5" width="20" height="20" fill="black" />
                  <rect x="75" y="5" width="20" height="20" fill="black" />
                  <rect x="5" y="75" width="20" height="20" fill="black" />
                  <rect x="9" y="9" width="12" height="12" fill="white" />
                  <rect x="79" y="9" width="12" height="12" fill="white" />
                  <rect x="9" y="79" width="12" height="12" fill="white" />
                  <rect x="13" y="13" width="4" height="4" fill="black" />
                  <rect x="83" y="13" width="4" height="4" fill="black" />
                  <rect x="13" y="83" width="4" height="4" fill="black" />
                  <!-- Random pattern blocks -->
                  <rect x="35" y="10" width="5" height="5" fill="black" />
                  <rect x="45" y="10" width="5" height="5" fill="black" />
                  <rect x="55" y="10" width="5" height="5" fill="black" />
                  <rect x="35" y="20" width="5" height="5" fill="black" />
                  <rect x="55" y="20" width="5" height="5" fill="black" />
                  <rect x="35" y="35" width="5" height="5" fill="black" />
                  <rect x="45" y="35" width="5" height="5" fill="black" />
                  <rect x="55" y="35" width="5" height="5" fill="black" />
                  <rect x="65" y="35" width="5" height="5" fill="black" />
                  <rect x="35" y="45" width="5" height="5" fill="black" />
                  <rect x="55" y="45" width="5" height="5" fill="black" />
                  <rect x="75" y="45" width="5" height="5" fill="black" />
                  <rect x="45" y="55" width="5" height="5" fill="black" />
                  <rect x="65" y="55" width="5" height="5" fill="black" />
                  <rect x="35" y="65" width="5" height="5" fill="black" />
                  <rect x="55" y="65" width="5" height="5" fill="black" />
                  <rect x="75" y="65" width="5" height="5" fill="black" />
                  <rect x="35" y="75" width="5" height="5" fill="black" />
                  <rect x="45" y="75" width="5" height="5" fill="black" />
                  <rect x="65" y="75" width="5" height="5" fill="black" />
                  <rect x="45" y="85" width="5" height="5" fill="black" />
                  <rect x="55" y="85" width="5" height="5" fill="black" />
                  <rect x="75" y="85" width="5" height="5" fill="black" />
                </svg>
              </div>
            </div>

            <!-- Download Button with Dropdown -->
            <div ref="downloadDropdownRef" class="relative">
              <div class="flex">
                <!-- Download Button (Main) -->
                <button
                  type="button"
                  class="flex-1 flex items-center justify-center gap-2 px-3 min-h-10 rounded-l-lg bg-(--primary-color) border-r-0 border-(--primary-color) hover:bg-blue-700 transition-all text-sm text-white font-semibold"
                  @click="downloadQR('png')"
                >
                  <Download class="w-4 h-4" />
                  <span>Download</span>
                </button>

                <!-- Dropdown Toggle Button -->
                <button
                  type="button"
                  class="flex items-center justify-center px-2 py-2 rounded-r-lg bg-(--primary-color) border border-l-0 border-(--primary-color) hover:bg-blue-700 transition-all text-white"
                  @click="toggleDownloadDropdown"
                >
                  <MoreVertical class="w-4 h-4" />
                </button>
              </div>

              <!-- Dropdown Menu -->
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div
                  v-show="showDownloadDropdown"
                  class="absolute z-50 w-full mt-2 rounded-lg bg-(--bg-color) border border-(--border-color) shadow-lg overflow-hidden"
                >
                  <button
                    type="button"
                    class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    @click="downloadQR('svg')"
                  >
                    <Download class="w-4 h-4" />
                    <span>Download as SVG</span>
                  </button>
                  <button
                    type="button"
                    class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    @click="downloadQR('png')"
                  >
                    <Download class="w-4 h-4" />
                    <span>Download as PNG</span>
                  </button>
                  <button
                    type="button"
                    class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    @click="downloadQR('jpg')"
                  >
                    <Download class="w-4 h-4" />
                    <span>Download as JPG</span>
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Original URL and Created Date (Two Columns One Row) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Original URL -->
          <div class="space-y-2">
            <label
              class="text-xs font-semibold uppercase tracking-wide opacity-70"
            >
              Original URL
            </label>
            <div
              class="p-3 rounded-lg bg-gray-200/80 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700"
            >
              <p class="text-sm break-all">{{ url.originalUrl }}</p>
            </div>
          </div>

          <!-- Created Date -->
          <div class="space-y-2">
            <label
              class="text-xs font-semibold uppercase tracking-wide opacity-70 flex items-center gap-2"
            >
              <Calendar class="w-4 h-4" />
              Created
            </label>
            <div
              class="p-3 rounded-lg bg-gray-200/80 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700"
            >
              <p class="text-sm font-semibold">
                {{ formatDate(url.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Additional Details -->
        <div
          v-if="url.expiresAt || url.isProtected"
          class="grid grid-cols-2 gap-3"
        >
          <!-- Expiration -->
          <div
            v-if="url.expiresAt"
            class="p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-2 mb-1">
              <div
                class="w-7 h-7 rounded-md bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"
              >
                <Calendar
                  class="w-3.5 h-3.5 text-orange-600 dark:text-orange-400"
                />
              </div>
              <span
                class="text-[10px] font-semibold uppercase tracking-wide opacity-70"
              >
                Expires
              </span>
            </div>
            <p class="text-xs font-semibold">{{ formatDate(url.expiresAt) }}</p>
          </div>

          <!-- Protection Status -->
          <div
            v-if="url.isProtected"
            class="p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-2 mb-1">
              <div
                class="w-7 h-7 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
              >
                <Lock class="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              </div>
              <span
                class="text-[10px] font-semibold uppercase tracking-wide opacity-70"
              >
                Protected
              </span>
            </div>
            <p class="text-xs font-semibold">Password Required</p>
          </div>
        </div>

        <!-- Channels -->
        <div v-if="url.channels && url.channels.length > 0" class="space-y-2">
          <label
            class="text-xs font-semibold uppercase tracking-wide opacity-70 flex items-center gap-2"
          >
            <Share2 class="w-4 h-4" />
            Channels
          </label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="channel in url.channels"
              :key="channel.id"
              class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              {{ channel.name }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <button
            type="button"
            :class="{
              'button-box w-full flex items-center gap-2 justify-center': true,
              success: copied,
            }"
            @click="copyToClipboard"
          >
            <Check v-if="copied" class="w-5 h-5" />
            <Copy v-else class="w-5 h-5" />
            {{ copied ? "Copied!" : "Copy Link" }}
          </button>
          <button
            type="button"
            class="button-box verbose hover:translate-x-0.5 hover:translate-y-0.5"
            @click="closeModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoom-in-95 {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}

.animate-in {
  animation:
    fade-in 0.3s ease-out,
    zoom-in-95 0.3s ease-out;
}
</style>
