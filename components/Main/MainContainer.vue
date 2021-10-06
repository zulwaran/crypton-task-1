<template>
  <div class="container">
    <div class="head">
      <button class="head__button" @click="connect()">
        <CustomButton :type="'long'" :message="'connect wallet'" />
      </button>
    </div>

    <div class="amount">
      <p class="amount__text">Amount</p>
      <div class="amount__content">
        <input class="amount__content_input" type="text" />
        <CustomButton
          :type="'select'"
          :message="selectedCrypto"
          :options="tokenArray"
          @select="optionSelect"
        />
      </div>
    </div>
    <div class="address">
      <p class="address__text">Address (recipient)</p>
      <input class="address__input" type="text" />
    </div>
    <div class="ballance">
      <div class="ballance__content">
        <p class="ballance__content_text">Your balance:</p>
        <p class="ballance__content_text">{{ balance }}</p>
      </div>
      <div class="ballance__content">
        <p class="ballance__content_text">Your allowance:</p>
        <p class="ballance__content_text">{{ allowance }}</p>
      </div>
    </div>
    <div class="approve">
      <CustomButton
        class="approve__btn"
        :type="'long'"
        :message="'Get allowance'"
      />
      <CustomButton class="approve__btn" :type="'long'" :message="'Approve'" />
      <CustomButton class="approve__btn" :type="'long'" :message="'Transfer'" />
    </div>
  </div>
</template>

<script>
import CustomButton from "../Reusable/CustomButton.vue";
import { connectWallet, getTokens, connectNode, getBalance } from "../../metamask";
export default {
  name: "Main",
  components: { CustomButton },
  methods: {
    async optionSelect(option) {
      this.selectedCrypto = option.symbol;
      this.balance = await getBalance(option.address);
    },
    connect() {
      connectWallet();
    },
  },
  data() {
    return {
      tokenArray: [],
      balance: "0",
      allowance: "-",
      selectedCrypto: "",
    };
  },
  async beforeMount() {
    await connectNode();
    this.tokenArray = await getTokens();
    console.log("Mount done");
  },
};
</script>