<template>
  <div class="container">
    <h1>メタデータを作成する</h1>
    <p>あなたのアカウントにメタデータを作成します。手数料はかかりません。</p>

    <b-form>
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
      <b-form-group label="Metadata Key" label-for="inputMetadataKey">
        <b-form-input
          id="inputMetadataKey"
          v-model="metadataKey"
          type="text"
          name="metadataKey"
          placeholder="Metadata Key"
        />
        <div class="text-right">
          Generated Key: {{ metadataKeyId }}
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
    </b-form>

    <section class="mb-3">
      <h4>メタデータ</h4>
      <template v-if="metadata.length === 0">
        <p>未取得もしくは未設定</p>
      </template>
      <template v-else>
        <b-table responsive="true" size="sm">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Sender Public Key</th>
              <th>Target Public Key</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in metadata" :key="m.key">
              <th scope="row">
                {{ m.key }}}
              </th>
              <td>{{ m.value }}}</td>
              <td class="public-key-ellipsis">
                {{ m.senderPublicKey }}}
              </td>
              <td class="public-key-ellipsis">
                {{ m.targetPublicKey }}}
              </td>
            </tr>
          </tbody>
        </b-table>
      </template>
    </section>

    <section class="mb-3">
      <h4>送信済みトランザクション</h4>
      <ul>
        <li v-for="hash in hashes" :key="hash">
          <a
            :href="transactionStatus(hash)"
            target="_blank"
          >{{ hash }}}</a>
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

export default {
  components: {
  },
  data () {
    return {
      metadata: [],
      hashes: [],
      announces: [],
      privateKey: '',
      metadataKey: '',
      metadataValue: '',
      sending: false,
      getting: false
    }
  },
  computed: {
    address () {
      try {
        const account = Account.createFromPrivateKey(this.privateKey, NetworkType.TEST_NET)
        return account.address.pretty()
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
    handleGet () {
      this.metadata = []
      try {
        this.getting = this.$get(this.privateKey)
          .then((data) => {
            this.metadata = data
          })
      } catch (e) {
        this.$bvToast.toast(e.message, {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: true
        })
      }
    },
    handleSend () {
      try {
        this.sending = this.$send(this.privateKey, this.metadataKey, this.metadataValue)
          .then(({ transactionHash, announceResponse }) => {
            this.hashes = [...this.hashes, transactionHash]
            this.announces = [...this.announces, announceResponse]
          })
      } catch (e) {
        this.$bvToast.toast(e.message, {
          title: 'Error',
          autoHideDelay: 5000,
          appendToast: true
        })
      }
    },
    transactionStatus (hash) {
      return `${process.env.NODE_URL}/transactionStatus/${hash}`
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
</style>
