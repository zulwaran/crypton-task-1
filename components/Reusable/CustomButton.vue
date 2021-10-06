<template>
  <div v-if="type == 'long'" :class="[button, longButton]">{{ message }}</div>
  <div v-else-if="type == 'select'">
    <div :class="[button, shortButton]" @click="isSelected = !isSelected">
      {{ message }}
      <img class="icon" src="@/assets/Icons/arrowDown.svg" alt="" />
    </div>
    <div class="selectButton" v-if="isSelected">
      <div
        :class="[button, shortButton]"
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
      >
        <p>{{ option.symbol }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomButton",
  props: ["type", "message", "options", "action"],
  methods: {
    selectOption(option) {
      this.$emit("select", option);
      this.isSelected = false;
    },
  },
  data() {
    return {
      isSelected: false,
      button: "button",
      longButton: "longButton",
      shortButton: "shortButton",
    };
  },
};
</script>