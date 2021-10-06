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
        <input class="amount__content_input" type="text" v-model="amount" />
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
      <input class="address__input" type="text" v-model="recipient" />
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
      <button class="approve__btn" @click="gAllowance()">
        <CustomButton :type="'long'" :message="'Get allowance'" />
      </button>
      <button class="approve__btn" @click="approve()">
        <CustomButton :type="'long'" :message="'Approve'" />
      </button>
      <button class="approve__btn" @click.prevent="transfer()">
        <CustomButton :type="'long'" :message="'Transfer'" />
      </button>
    </div>
  </div>
</template>

<script>
import CustomButton from "../Reusable/CustomButton.vue";
import {
  connectWallet,
  getTokens,
  connectNode,
  getBalance,
  getAllowance,
  tokenTransfer,
  tokenApprove,
} from "../../metamask";
export default {
  name: "Main",
  components: { CustomButton },
  data() {
    return {
      tokenArray: [],
      currentToken: [],
      recipient: "",
      amount: null,
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
  methods: {
    async optionSelect(option) {
      this.selectedCrypto = option.symbol;
      this.currentToken = option;
      this.balance = await getBalance(option.address);
    },
    connect() {
      connectWallet();
    },
    async gAllowance() {
      this.allowance = await getAllowance(
        this.currentToken.address,
        this.recipient
      );
    },
    transfer() {
      tokenTransfer(this.currentToken.address, this.recipient, this.amount);
    },
    approve() {
      tokenApprove(this.currentToken.address, this.recipient, this.amount);
    },
  },
};
</script>