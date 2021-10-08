<template>
  <div class="container">
    <div class="head">
      <button v-if="wallet == false" class="head__button" @click="connect()">
        <CustomButton :type="'long'" :message="'connect wallet'" />
      </button>
      <button v-else class="head__button">
        <CustomButton :type="'long'" :message="'wallet is connected'" />
      </button>
    </div>
    <div class="amount">
      <p class="amount__text">Amount</p>
      <div class="amount__content">
        <ValidationObserver>
          <ValidationProvider
            :rules="`required|double|max_value:${balance}`"
            v-slot="{ errors }"
            ref="amount"
          >
            <input class="amount__input" type="text" v-model="amount" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </ValidationObserver>
        <CustomButton
          :type="'select'"
          :message="currentToken.symbol"
          :options="tokenArray"
          @select="optionSelect"
        />
      </div>

    </div>
    <div class="address">
      <p class="address__text">Address (recipient)</p>
      <ValidationObserver>
        <ValidationProvider
          rules="required|max:42|address"
          v-slot="{ errors }"
          ref="address"
        >
          <input class="address__input" type="text" v-model="recipient" />
          <span class="error">{{ errors[0] }}</span>
        </ValidationProvider>
      </ValidationObserver>
    </div>
    <div class="ballance">
      <div class="ballance__content">
        <p class="ballance__text">Your balance:</p>
        <p class="ballance__text">{{ balance }}</p>
      </div>
      <div class="ballance__content">
        <p class="ballance__text">Your allowance:</p>
        <p class="ballance__text">{{ allowance }}</p>
      </div>
    </div>
    <div class="approve">
      <button class="approve__btn" @click="gAllowance()">
        <CustomButton :type="'long'" :message="'Get allowance'" />
      </button>
      <button class="approve__btn" @click="approve()">
        <CustomButton :type="'long'" :message="'Approve'" />
      </button>
      <button class="approve__btn" @click="transfer()">
        <CustomButton :type="'long'" :message="'Transfer'" />
      </button>
    </div>
  </div>
</template>

<script>
import CustomButton from "../components/Reusable/CustomButton.vue";
import { ValidationProvider } from "vee-validate";
import {
  connectWallet,
  checkConnect,
  getTokens,
  connectNode,
  getBalance,
  getAllowance,
  tokenAction,
} from "../utilities/metamask";

export default {
  name: "Main",
  components: { CustomButton, ValidationProvider },

  data() {
    return {
      tokenArray: [],
      currentToken: [],
      recipient: "",
      amount: null,
      balance: "0",
      allowance: "-",
      wallet: false,
    };
  },
  async beforeMount() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start();
      await connectNode();
      this.wallet = await checkConnect();
      this.tokenArray = await getTokens();
      this.currentToken = this.tokenArray[0];
      this.balance = await getBalance(this.tokenArray[0].address);
      this.$nuxt.$loading.finish();
    });
  },

  methods: {
    async optionSelect(option) {
      if (this.currentToken == option) {
        return;
      }
      this.$nextTick(async () => {
        this.$nuxt.$loading.start();
        this.currentToken = option;
        this.allowance = "-";
        this.balance = await getBalance(option.address);
        this.$nuxt.$loading.finish();
      });
    },
    async connect() {
      await connectWallet();
      this.$nextTick(async () => {
        this.$nuxt.$loading.start();
        this.wallet = await checkConnect();
        this.balance = await getBalance(this.currentToken.address);
        this.$nuxt.$loading.finish();
      });
    },
    async gAllowance() {
      const address = await this.$refs.address.validate().then((val) => {
        return val.valid;
      });
      if (address) {
        this.allowance = await getAllowance(this.currentToken, this.recipient);
        return true;
      }
      return false;
    },
    async transfer() {
      const amount = await this.$refs.amount.validate().then((val) => {
        return val.valid;
      });
      const address = await this.$refs.address.validate().then((val) => {
        return val.valid;
      });
      if (amount && address) {
        tokenAction("transfer", this.currentToken, this.recipient, this.amount);
        return true;
      }
      return false;
    },
    async approve() {
      const amount = await this.$refs.amount.validate().then((val) => {
        return val.valid;
      });
      const address = await this.$refs.address.validate().then((val) => {
        return val.valid;
      });
      if (amount && address) {
        tokenAction("approve", this.currentToken, this.recipient, this.amount);
        return true;
      }
      return false;
    },
  },
};
</script>