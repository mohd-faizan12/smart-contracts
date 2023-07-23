const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
    block_height: {
        type: String
    },
    data: {
        type: Object,
        fee: {
            type: Object,
            ptxwei: {
                type: String
            }
        },
        proposer: {
            type: Object,
            address: {
                type: String,
            },
            coins: {
                type: Object,
                pandowei: {
                    type: String
                },
                ptxwei: {
                    type: String

                }

            },
            sequence: {
                type: String
            },
            signature: {
                type: String
            },


        },
        outputs: {
            type: Array,
            address: {
                type: String
            },
            coins: {
                type: Object,
                pandowei: {
                    type: String
                },
                ptxwei: {
                    type: String
                }
            }
        },
        block_height: {
            type: String
        },
        source: {
            type: Object,
            address: {
                type: String
            }
        },
        purpose: {
            type: Number
        },
      

    },
    
      eth_tx_hash: {
    type: String
},
    hash: {
    type: String
},
    number: {
    type: Number
},
    receipt: {
    type: String
},
    status: {
    type: String
},
    timestamp: {
    type: "String"
},
    type: {
    type: Number
}

});

const transactionmodelSync = model("transaction", transactionSchema, "transaction");

module.exports = transactionmodelSync;
