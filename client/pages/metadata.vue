<template>
  <div class="container">
    <h1>メタデータを作成する</h1>
    <p>あなたのアカウントにメタデータを作成します。手数料はかかりません。</p>

    <b-form>
      <section>
        <b-form-group label="Private Key" label-for="inputPrivateKey">
          <b-form-input
            id="inputPrivateKey"
            v-model="privateKey"
            type="text"
            name="privateKey"
            placeholder="Test Private Key"
          />
          <div class="text-right">
            Address: {{ address }}
          </div>
        </b-form-group>
        <b-form-group>
          <template v-if="privateKey">
            <b-button disabled variant="light">
              秘密鍵を生成する
            </b-button>
          </template>
          <template v-else>
            <b-button variant="light" @click="handleGenerate">
              秘密鍵を生成する
            </b-button>
          </template>
        </b-form-group>
      </section>

      <section class="mb-3">
        <hr />
        <h4>メタデータ取得</h4>
        <template v-if="metadata.getCount === 0">
          <p>未取得</p>
        </template>
        <template v-else-if="metadata.isLoading">
          <p>取得中・・・</p>
        </template>
        <template v-else-if="metadata.data.length === 0">
          <p>メタデータはありません</p>
        </template>
        <template v-else>
          <b-table :items="metadata.data" :fields="metadataFields" small/>
        </template>
        <b-form-group>
          <template v-if="metadata.isLoading">
            <b-button disabled variant="primary">
              メタデータを取得する
            </b-button>
          </template>
          <template v-else>
            <b-button variant="primary" @click="handleGet">
              メタデータを取得する
            </b-button>
          </template>
        </b-form-group>
      </section>

      <section>
        <hr />
        <h4>メタデータ設定</h4>
        <b-form-group label="Metadata Key" label-for="inputMetadataKey">
          <b-form-input
            id="inputMetadataKey"
            v-model="metadataKey"
            type="text"
            name="metadataKey"
            placeholder="Metadata Key"
          />
          <div class="text-right">
            Generated Scoped Key: {{ metadataKeyId }}
          </div>
        </b-form-group>
        <b-form-group label="Metadata Value" label-for="inputMetadataValue">
          <b-form-input
            id="inputMetadataValue"
            v-model="metadataValue"
            type="text"
            name="metadataValue"
            placeholder="Metadata Value"
          />
          <div class="text-right">
            Hex Value: {{ metadataValueHex }}
          </div>
        </b-form-group>
        <b-form-group>
          <template v-if="sending">
            <b-button disabled variant="danger">
              メタデータを設定する
            </b-button>
          </template>
          <template v-else>
            <b-button variant="danger" @click="handleSend">
              メタデータを設定する
            </b-button>
          </template>
        </b-form-group>
      </section>
    </b-form>

    <section class="mb-3">
      <hr />
      <h4>送信済みトランザクション</h4>
      <ul>
        <li v-for="hash in hashes" :key="hash">
          <a
            :href="transactionStatus(hash)"
            target="_blank"
          >{{ hash }}</a>
        </li>
        <li v-if="hashes.length === 0">
          なし
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { Account, Convert, KeyGenerator, NetworkType } from 'symbol-sdk'

const metadataFields = [
  { metadataKey: 'Scoped Key' },
  { metadataValue: 'Value' },
  { sourceAddress: 'Source Address' },
  { targetAddress: 'Target Address' }
]

export default {
  components: {
  },
  data () {
    return {
      metadata: { isLoading: false, getCount: 0, data: [] },
      hashes: [],
      announces: [],
      privateKey: '',
      metadataKey: '',
      metadataValue: '',
      sending: false,
      metadataFields
    }
  },
  computed: {
    address () {
      try {
        const account = Account.createFromPrivateKey(this.privateKey, NetworkType.TEST_NET)
        return account.address.plain()
      } catch (e) {
        return ''
      }
    },
    metadataKeyId () {
      try {
        return KeyGenerator.generateUInt64Key(this.metadataKey).toHex()
      } catch (e) {
        return ''
      }
    },
    metadataValueHex () {
      return Convert.utf8ToHex(this.metadataValue)
    }
  },
  methods: {
    async handleGet () {
      try {
        this.metadata.isLoading = true
        if (!this.privateKey) {
          throw new Error('private key required')
        }
        this.metadata.getCount++
        await this.$get(this.privateKey)
          .then((data) => {
            this.metadata.data = data
          })
      } catch (e) {
        this.$bvToast.toast(e.message, {
          title: 'Error',
          variant: 'danger',
          autoHideDelay: 5000,
          appendToast: true
        })
      } finally {
        this.metadata.isLoading = false
      }
    },
    async handleSend () {
      try {
        this.sending = true
        if (!this.privateKey) {
          throw new Error('private key required')
        }
        if (!this.metadataKey) {
          throw new Error('metadata key required')
        }
        if (!this.metadataValue) {
          throw new Error('metadata value required')
        }
        await this.$send(this.privateKey, this.metadataKey, this.metadataValue)
          .then(({ transactionHash, announceResponse }) => {
            this.hashes = [...this.hashes, transactionHash]
            this.announces = [...this.announces, announceResponse]
            this.$bvToast.toast(transactionHash, {
              title: 'Success',
              variant: 'success',
              autoHideDelay: 5000,
              appendToast: true
            })
          })
      } catch (e) {
        this.$bvToast.toast(e.message, {
          title: 'Error',
          variant: 'danger',
          autoHideDelay: 5000,
          appendToast: true
        })
      } finally {
        this.sending = false
      }
    },
    handleGenerate () {
      this.privateKey = Account.generateNewAccount(NetworkType.TEST_NET).privateKey
    },
    transactionStatus (hash) {
      return `${process.env.LINK_NODE_URL}/transactionStatus/${hash}`
    }
  }
}
</script>

<style scoped>
.public-key-ellipsis {
  font-family: Consolas, monospace;
  overflow: hidden;
  max-width: 5rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

hr {
  margin-top: 4rem;
  margin-bottom: 3rem;
}
</style>
